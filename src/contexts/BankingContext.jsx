"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  loadAccounts,
  saveAccounts,
  loadTransactions,
  saveTransactions,
} from "../services/bankingService";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { generateAccountNumber } from "../services/accountNumber";

const BankingContext = createContext(null);
export const useBanking = () => useContext(BankingContext);

export const BankingProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD DATA (SAFE + ONE-TIME BONUS)
  ========================= */
  useEffect(() => {
    if (!currentUser) {
      setAccounts([]);
      setTransactions([]);
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);

      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      const accs = await loadAccounts(currentUser.uid);
      const txns = await loadTransactions(currentUser.uid);

      const userData = userSnap.exists() ? userSnap.data() : {};

      const bonusAlreadyGranted = userData?.welcomeBonusGranted === true;

      // ✅ FIRST TIME USER ONLY
      if ((!accs || accs.length === 0) && !bonusAlreadyGranted) {
        const mainAccount = {
          id: "main",
          name: "Main Account",
          type: "checking",
          balance: 20000, // ✅ welcome bonus
          accountNumber: generateAccountNumber(),
          createdAt: new Date().toISOString(),
        };

        const savingsAccount = {
          id: "savings",
          name: "Savings Account",
          type: "savings",
          balance: 0,
          accountNumber: generateAccountNumber(),
          createdAt: new Date().toISOString(),
        };

        const defaults = [mainAccount, savingsAccount];

        setAccounts(defaults);
        setTransactions([]);

        await saveAccounts(currentUser.uid, defaults);
        await saveTransactions(currentUser.uid, []);

        await setDoc(
          userRef,
          {
            displayName: currentUser.displayName || "User",
            primaryAccountNumber: mainAccount.accountNumber,
            welcomeBonusGranted: true, // 🔒 permanent lock
            createdAt: new Date().toISOString(),
          },
          { merge: true }
        );

        setLoading(false);
        return;
      }

      // ✅ NORMAL LOAD (NO BONUS LOGIC)
      setAccounts(accs || []);
      setTransactions(txns || []);
      setLoading(false);
    };

    loadData();
  }, [currentUser]);

  /* =========================
     PERSIST CHANGES
  ========================= */
  useEffect(() => {
    if (!currentUser || loading) return;
    saveAccounts(currentUser.uid, accounts);
  }, [accounts, currentUser, loading]);

  useEffect(() => {
    if (!currentUser || loading) return;
    saveTransactions(currentUser.uid, transactions);
  }, [transactions, currentUser, loading]);

  /* =========================
     HELPERS
  ========================= */
  const getAccountById = (id) => accounts.find((a) => a.id === id);

  const getAllUserTransactions = () =>
    [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

  const logTransaction = (data) => {
    setTransactions((prev) => [
      {
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        status: "completed",
        ...data,
      },
      ...prev,
    ]);
  };

  /* =========================
     CORE OPERATIONS
  ========================= */
  const deposit = (accountId, amount, description = "Deposit") => {
    if (amount <= 0) throw new Error("Invalid amount");

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? { ...acc, balance: acc.balance + amount }
          : acc
      )
    );

    logTransaction({
      type: "deposit",
      amount,
      description,
      accountId,
    });
  };

  const withdraw = (accountId, amount, description = "Withdrawal") => {
    if (amount <= 0) throw new Error("Invalid amount");

    const account = getAccountById(accountId);
    if (!account || account.balance < amount)
      throw new Error("Insufficient balance");

    setAccounts((prev) =>
      prev.map((acc) =>
        acc.id === accountId
          ? { ...acc, balance: acc.balance - amount }
          : acc
      )
    );

    logTransaction({
      type: "withdraw",
      amount,
      description,
      accountId,
    });
  };

  const transfer = (fromId, toId, amount, description = "Internal Transfer") => {
    if (amount <= 0) throw new Error("Invalid amount");

    const from = getAccountById(fromId);
    const to = getAccountById(toId);

    if (!from || !to) throw new Error("Invalid account");
    if (from.balance < amount) throw new Error("Insufficient balance");

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromId)
          return { ...acc, balance: acc.balance - amount };
        if (acc.id === toId)
          return { ...acc, balance: acc.balance + amount };
        return acc;
      })
    );

    logTransaction({
      type: "internal_transfer",
      amount,
      description,
      fromAccount: from.accountNumber,
      toAccount: to.accountNumber,
    });
  };

  const transferBetweenBalances = ({ from, to, amount }) =>
    transfer(from, to, amount);

  const createAccount = ({ name, type }) => {
    const newAccount = {
      id: crypto.randomUUID(),
      name,
      type,
      balance: 0,
      accountNumber: generateAccountNumber(),
      createdAt: new Date().toISOString(),
    };

    setAccounts((prev) => [...prev, newAccount]);
  };

  /* =========================
     PROVIDER
  ========================= */
  return (
    <BankingContext.Provider
      value={{
        accounts,
        transactions,
        loading,
        deposit,
        withdraw,
        transfer,
        transferBetweenBalances,
        createAccount,
        getAccountById,
        getAllUserTransactions,
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};
