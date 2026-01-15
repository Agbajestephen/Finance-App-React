"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { useAuth } from "./AuthContext"
import {
  loadAccounts,
  saveAccounts,
  loadTransactions,
  saveTransactions,
} from "../services/bankingService"

const BankingContext = createContext()

export const useBanking = () => useContext(BankingContext)

export const BankingProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [accounts, setAccounts] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // Load user's data from localStorage
  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    // Simulate loading delay
    setTimeout(() => {
      // Load accounts
      const savedAccounts = localStorage.getItem(`banking_accounts_${currentUser.uid}`)
      const savedTransactions = localStorage.getItem(`banking_transactions_${currentUser.uid}`)

      if (!savedAccounts) {
        // Create default accounts for new user
        const defaultAccounts = [
          {
            id: "acc_" + Date.now(),
            name: "Savings Account",
            type: "savings",
            balance: 50000,
            accountNumber: "SAV" + Math.random().toString().slice(2, 11),
            userId: currentUser.uid,
            createdAt: new Date().toISOString(),
          },
          {
            id: "acc_" + (Date.now() + 1),
            name: "Current Account",
            type: "checking",
            balance: 25000,
            accountNumber: "CUR" + Math.random().toString().slice(2, 11),
            userId: currentUser.uid,
            createdAt: new Date().toISOString(),
          },
        ]
        setAccounts(defaultAccounts)
        localStorage.setItem(`banking_accounts_${currentUser.uid}`, JSON.stringify(defaultAccounts))
      } else {
        setAccounts(JSON.parse(savedAccounts))
      }

      // Load transactions
      if (!savedTransactions) {
        const defaultTransactions = [
          {
            id: "txn_" + Date.now(),
            type: "deposit",
            amount: 50000,
            description: "Initial deposit",
            fromAccount: "CASH",
            toAccount: "Savings Account",
            userId: currentUser.uid,
            date: new Date().toISOString(),
            status: "completed",
          },
          {
            id: "txn_" + (Date.now() + 1),
            type: "deposit",
            amount: 25000,
            description: "Account opening bonus",
            fromAccount: "CASH",
            toAccount: "Current Account",
            userId: currentUser.uid,
            date: new Date().toISOString(),
            status: "completed",
          },
        ]
        setTransactions(defaultTransactions)
        localStorage.setItem(`banking_transactions_${currentUser.uid}`, JSON.stringify(defaultTransactions))
      } else {
        setTransactions(JSON.parse(savedTransactions))
      }

      setLoading(false)
    }, 500)
  }, [currentUser])

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (!currentUser) return
    localStorage.setItem(`banking_accounts_${currentUser.uid}`, JSON.stringify(accounts))
  }, [accounts, currentUser])

  useEffect(() => {
    if (!currentUser) return
    localStorage.setItem(`banking_transactions_${currentUser.uid}`, JSON.stringify(transactions))
  }, [transactions, currentUser])

  // CREATE NEW ACCOUNT
  const createAccount = (accountData) => {
    if (!currentUser) return null

    const newAccount = {
      id: "acc_" + Date.now(),
      userId: currentUser.uid,
      accountNumber: "ACC" + Math.random().toString().slice(2, 11),
      balance: 0,
      ...accountData,
      createdAt: new Date().toISOString(),
    }

    setAccounts((prev) => [newAccount, ...prev])

    // Log the transaction
    const transaction = {
      id: "txn_" + Date.now(),
      type: "account_opened",
      amount: 0,
      description: `Opened ${accountData.name}`,
      fromAccount: "SYSTEM",
      toAccount: accountData.name,
      userId: currentUser.uid,
      date: new Date().toISOString(),
      status: "completed",
    }

    setTransactions((prev) => [transaction, ...prev])

    return newAccount
  }

  // DEPOSIT MONEY
  const deposit = (accountId, amount, description = "Deposit") => {
    if (!currentUser || amount <= 0) return false

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          return { ...acc, balance: acc.balance + amount }
        }
        return acc
      }),
    )

    const account = accounts.find((a) => a.id === accountId)
    const transaction = {
      id: "txn_" + Date.now(),
      type: "deposit",
      amount,
      description,
      fromAccount: "CASH",
      toAccount: account?.name || "Account",
      userId: currentUser.uid,
      date: new Date().toISOString(),
      status: "completed",
    }

    setTransactions((prev) => [transaction, ...prev])
    return true
  }

  // WITHDRAW MONEY
  const withdraw = (accountId, amount, description = "Withdrawal") => {
    if (!currentUser || amount <= 0) return false

    const account = accounts.find((acc) => acc.id === accountId)
    if (!account || account.balance < amount) return false

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === accountId) {
          return { ...acc, balance: acc.balance - amount }
        }
        return acc
      }),
    )

    const transaction = {
      id: "txn_" + Date.now(),
      type: "withdrawal",
      amount,
      description,
      fromAccount: account.name,
      toAccount: "CASH",
      userId: currentUser.uid,
      date: new Date().toISOString(),
      status: "completed",
    }

    setTransactions((prev) => [transaction, ...prev])
    return true
  }

  // TRANSFER MONEY
  const transfer = (fromAccountId, toAccountId, amount, description = "Transfer") => {
    if (!currentUser || amount <= 0) return false

    const fromAccount = accounts.find((acc) => acc.id === fromAccountId)
    const toAccount = accounts.find((acc) => acc.id === toAccountId)

    if (!fromAccount || !toAccount || fromAccount.balance < amount) return false

    setAccounts((prev) =>
      prev.map((acc) => {
        if (acc.id === fromAccountId) {
          return { ...acc, balance: acc.balance - amount }
        }
        if (acc.id === toAccountId) {
          return { ...acc, balance: acc.balance + amount }
        }
        return acc
      }),
    )

    const transaction = {
      id: "txn_" + Date.now(),
      type: "transfer",
      amount,
      description,
      fromAccount: fromAccount.name,
      toAccount: toAccount.name,
      userId: currentUser.uid,
      date: new Date().toISOString(),
      status: "completed",
    }

    setTransactions((prev) => [transaction, ...prev])
    return true
  }

  // GET USER TRANSACTIONS (with pagination)
  const getUserTransactions = (page = 1, limit = 10) => {
    if (!currentUser) return { transactions: [], totalPages: 0 }

    const userTransactions = transactions
      .filter((tx) => tx.userId === currentUser.uid)
      .sort((a, b) => new Date(b.date) - new Date(a.date))

    const start = (page - 1) * limit
    const end = start + limit

    return {
      transactions: userTransactions.slice(start, end),
      totalPages: Math.ceil(userTransactions.length / limit),
      currentPage: page,
    }
  }

  // GET ALL USER TRANSACTIONS (for history page)
  const getAllUserTransactions = () => {
    if (!currentUser) return []
    return transactions
      .filter((tx) => tx.userId === currentUser.uid)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  }

  // GET ACCOUNT BY ID
  const getAccountById = (accountId) => {
    return accounts.find((acc) => acc.id === accountId)
  }

  const value = {
    accounts,
    transactions,
    loading,
    createAccount,
    deposit,
    withdraw,
    transfer,
    getUserTransactions,
    getAllUserTransactions,
    getAccountById,
  }

  return <BankingContext.Provider value={value}>{children}</BankingContext.Provider>
}
