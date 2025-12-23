"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useBanking } from "../contexts/BankingContext"
import {
  FaUsers,
  FaWallet,
  FaExchangeAlt,
  FaShieldAlt,
  FaChartLine,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa"
import toast from "react-hot-toast"

const AdminDashboard = () => {
  const { currentUser, userRole, isSuperAdmin } = useAuth()
  const { getAllAccounts, getAllTransactions, getAllFraudLogs } = useBanking()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalAccounts: 0,
    totalBalance: 0,
    totalTransactions: 0,
    todayTransactions: 0,
    fraudAlerts: 0,
  })
  const [recentTransactions, setRecentTransactions] = useState([])
  const [fraudLogs, setFraudLogs] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [exchangeRates, setExchangeRates] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAdminData()
    fetchExchangeRates()
  }, [])

  const loadAdminData = () => {
    // Get all accounts from all users
    const allAccountsData = getAllAccounts()
    const allTransactionsData = getAllTransactions()
    const allFraudLogsData = getAllFraudLogs()

    // Calculate statistics
    let totalBalance = 0
    let totalAccounts = 0
    const userIds = Object.keys(allAccountsData)

    userIds.forEach((userId) => {
      const userAccounts = allAccountsData[userId]
      if (Array.isArray(userAccounts)) {
        totalAccounts += userAccounts.length
        userAccounts.forEach((acc) => {
          totalBalance += acc.balance || 0
        })
      }
    })

    // Get today's transactions
    const today = new Date().toDateString()
    const todayTransactions = allTransactionsData.filter((tx) => new Date(tx.date).toDateString() === today)

    // Get users data from localStorage
    const usersData = []

    const bankingUsers = JSON.parse(localStorage.getItem("banking_users") || "{}")
    Object.values(bankingUsers).forEach((user) => usersData.push(user))

    // Add admin users
    const adminUsers = JSON.parse(localStorage.getItem("admin_users") || "[]")
    adminUsers.forEach((admin) => usersData.push(admin))

    setStats({
      totalUsers: usersData.length,
      totalAccounts,
      totalBalance,
      totalTransactions: allTransactionsData.length,
      todayTransactions: todayTransactions.length,
      fraudAlerts: allFraudLogsData.length,
    })

    setRecentTransactions(allTransactionsData.slice(0, 10))
    setFraudLogs(allFraudLogsData.slice(0, 10))
    setAllUsers(usersData)
    setLoading(false)
  }

  const fetchExchangeRates = async () => {
    try {
      // Using free currency API
      const response = await fetch("https://api.exchangerate-api.com/v4/latest/NGN")
      const data = await response.json()
      setExchangeRates(data.rates)
    } catch (error) {
      console.error("Failed to fetch exchange rates:", error)
      toast.error("Failed to load currency rates")
    }
  }

  const convertCurrency = (amountInNGN, targetCurrency) => {
    if (!exchangeRates[targetCurrency]) return "N/A"
    return (amountInNGN * exchangeRates[targetCurrency]).toFixed(2)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {currentUser?.displayName} ({isSuperAdmin() ? "Super Admin" : "Admin"})
          </p>
        </div>
        <div className="badge badge-lg badge-primary gap-2">
          <FaShieldAlt />
          {userRole}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-primary">
              <FaUsers className="text-3xl" />
            </div>
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{stats.totalUsers}</div>
            <div className="stat-desc">Registered customers</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-secondary">
              <FaWallet className="text-3xl" />
            </div>
            <div className="stat-title">Total Accounts</div>
            <div className="stat-value text-secondary">{stats.totalAccounts}</div>
            <div className="stat-desc">Active bank accounts</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-success">
              <FaMoneyBillWave className="text-3xl" />
            </div>
            <div className="stat-title">Total Balance</div>
            <div className="stat-value text-success">₦{stats.totalBalance.toLocaleString()}</div>
            <div className="stat-desc">System-wide balance</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-info">
              <FaExchangeAlt className="text-3xl" />
            </div>
            <div className="stat-title">Total Transactions</div>
            <div className="stat-value text-info">{stats.totalTransactions}</div>
            <div className="stat-desc">↗︎ {stats.todayTransactions} today</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-warning">
              <FaExclamationTriangle className="text-3xl" />
            </div>
            <div className="stat-title">Fraud Alerts</div>
            <div className="stat-value text-warning">{stats.fraudAlerts}</div>
            <div className="stat-desc">Suspicious activities detected</div>
          </div>
        </div>

        <div className="stats shadow">
          <div className="stat">
            <div className="stat-figure text-accent">
              <FaChartLine className="text-3xl" />
            </div>
            <div className="stat-title">System Status</div>
            <div className="stat-value text-accent text-2xl">
              <FaCheckCircle className="inline" /> Active
            </div>
            <div className="stat-desc">All systems operational</div>
          </div>
        </div>
      </div>

      {/* Currency Converter */}
      <div className="card bg-white shadow-md border">
        <div className="card-body">
          <h2 className="card-title mb-4">Live Currency Conversion</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">USD</p>
              <p className="text-2xl font-bold text-blue-600">${convertCurrency(stats.totalBalance, "USD")}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600">EUR</p>
              <p className="text-2xl font-bold text-green-600">€{convertCurrency(stats.totalBalance, "EUR")}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">GBP</p>
              <p className="text-2xl font-bold text-purple-600">£{convertCurrency(stats.totalBalance, "GBP")}</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600">JPY</p>
              <p className="text-2xl font-bold text-orange-600">¥{convertCurrency(stats.totalBalance, "JPY")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions and Fraud Logs */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card bg-white shadow-md border">
          <div className="card-body">
            <h2 className="card-title mb-4">Recent Transactions</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`badge ${
                        tx.type === "deposit"
                          ? "badge-success"
                          : tx.type === "withdrawal"
                            ? "badge-error"
                            : "badge-info"
                      }`}
                    >
                      {tx.type}
                    </span>
                    <span className="font-bold text-lg">₦{tx.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600">{tx.description}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(tx.date).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fraud Detection Logs */}
        <div className="card bg-white shadow-md border">
          <div className="card-body">
            <h2 className="card-title mb-4 text-warning">
              <FaExclamationTriangle /> Fraud Detection Logs
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {fraudLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-400">
                  <FaCheckCircle className="text-5xl mx-auto mb-2 text-green-400" />
                  <p>No fraud detected</p>
                </div>
              ) : (
                fraudLogs.map((log) => (
                  <div
                    key={log.id}
                    className={`p-4 border-l-4 rounded-lg ${
                      log.details.severity === "high"
                        ? "border-red-500 bg-red-50"
                        : log.details.severity === "medium"
                          ? "border-orange-500 bg-orange-50"
                          : "border-yellow-500 bg-yellow-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">{log.type.replace(/_/g, " ")}</span>
                      <span
                        className={`badge ${
                          log.details.severity === "high"
                            ? "badge-error"
                            : log.details.severity === "medium"
                              ? "badge-warning"
                              : "badge-info"
                        }`}
                      >
                        {log.details.severity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {log.details.amount && <p>Amount: ₦{log.details.amount.toLocaleString()}</p>}
                      {log.details.count && <p>Count: {log.details.count} transactions</p>}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      <FaClock className="inline mr-1" />
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* All Users List */}
      {isSuperAdmin() && (
        <div className="card bg-white shadow-md border">
          <div className="card-body">
            <h2 className="card-title mb-4">All Users</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Role</th>
                    <th>Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {allUsers.map((user) => (
                    <tr key={user.uid}>
                      <td className="font-mono text-sm">{user.uid}</td>
                      <td>
                        <span
                          className={`badge ${
                            user.role === "superadmin"
                              ? "badge-error"
                              : user.role === "admin"
                                ? "badge-warning"
                                : "badge-info"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
