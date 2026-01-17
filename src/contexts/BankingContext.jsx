"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  loadAccounts,
  saveAccounts,
  loadTransactions,
  saveTransactions,
} from "../services/bankingService";

const BankingContext = createContext(null);
export const useBanking = () => useContext(BankingContext);

export const BankingProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const [accounts, setAccounts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     LOAD DATA
  ========================= */
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);

      const accs = await loadAccounts(currentUser.uid);
      const txns = await loadTransactions(currentUser.uid);

      if (!accs || accs.length === 0) {
        const defaults = [
          {
            id: "main",
            name: "Main Account",
            type: "checking",
            balance: 20000,
            accountNumber: "SB-MAIN",
            createdAt: new Date().toISOString(),
          },
          {
            id: "savings",
            name: "Savings Account",
            type: "savings",
            balance: 0,
            accountNumber: "SB-SAV",
            createdAt: new Date().toISOString(),
          },
        ];

        setAccounts(defaults);
        await saveAccounts(currentUser.uid, defaults);
      } else {
        setAccounts(accs);
      }

      setTransactions(txns || []);
      setLoading(false);
    };

    loadData();
  }, [currentUser]);

  /* =========================
     PERSIST
  ========================= */
  useEffect(() => {
    if (currentUser) saveAccounts(currentUser.uid, accounts);
  }, [accounts, currentUser]);

  useEffect(() => {
    if (currentUser) saveTransactions(currentUser.uid, transactions);
  }, [transactions, currentUser]);

  /* =========================
     HELPERS
  ========================= */
  const getAccountById = (id) => accounts.find((a) => a.id === id);

  const getAllUserTransactions = () => {
    return [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  };

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
     CORE TRANSFER
  ========================= */
  const transfer = (fromId, toId, amount, description) => {
    const from = getAccountById(fromId);
    const to = getAccountById(toId);

    if (!from || !to) {
      throw new Error("Invalid account");
    }

    if (amount <= 0) {
      throw new Error("Invalid amount");
    }

    if (from.balance < amount) {
      throw new Error("Insufficient balance");
    }

    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === fromId)
          return { ...a, balance: a.balance - amount };
        if (a.id === toId)
          return { ...a, balance: a.balance + amount };
        return a;
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

  /* =========================
     ✅ THIS WAS MISSING
  ========================= */
  const transferBetweenBalances = ({ from, to, amount }) => {
    return transfer(from, to, amount, "Internal transfer");
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
        getAccountById,
        getAllUserTransactions,
        transfer,
        transferBetweenBalances, // ✅ now defined
      }}
    >
      {children}
    </BankingContext.Provider>
  );
};
