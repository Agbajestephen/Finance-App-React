"use client"

import { useState, useMemo } from "react"
import { useBanking } from "../contexts/BankingContext"
import { FaSearch, FaDownload, FaFilter, FaHistory, FaClock } from "react-icons/fa"
import toast from "react-hot-toast"

export default function History() {
  const { getAllUserTransactions } = useBanking()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [filterDate, setFilterDate] = useState("all")
  const [sortOrder, setSortOrder] = useState("newest")

  const allTransactions = getAllUserTransactions()

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let filtered = allTransactions

    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter((tx) => tx.type === filterType)
    }

    // Filter by date
    const now = new Date()
    if (filterDate !== "all") {
      filtered = filtered.filter((tx) => {
        const txDate = new Date(tx.date)
        const diffDays = Math.floor((now - txDate) / (1000 * 60 * 60 * 24))

        switch (filterDate) {
          case "today":
            return diffDays === 0
          case "week":
            return diffDays <= 7
          case "month":
            return diffDays <= 30
          case "3months":
            return diffDays <= 90
          default:
            return true
        }
      })
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (tx) =>
          tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.fromAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.toAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
          tx.id.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort
    if (sortOrder === "newest") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (sortOrder === "oldest") {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date))
    } else if (sortOrder === "highest") {
      filtered.sort((a, b) => b.amount - a.amount)
    } else if (sortOrder === "lowest") {
      filtered.sort((a, b) => a.amount - b.amount)
    }

    return filtered
  }, [allTransactions, searchTerm, filterType, filterDate, sortOrder])

  // Calculate statistics
  const stats = useMemo(() => {
    const deposits = allTransactions.filter((tx) => tx.type === "deposit")
    const withdrawals = allTransactions.filter((tx) => tx.type === "withdrawal")
    const transfers = allTransactions.filter((tx) => tx.type === "transfer")

    return {
      totalTransactions: allTransactions.length,
      totalDeposits: deposits.reduce((sum, tx) => sum + tx.amount, 0),
      totalWithdrawals: withdrawals.reduce((sum, tx) => sum + tx.amount, 0),
      totalTransfers: transfers.reduce((sum, tx) => sum + tx.amount, 0),
      depositsCount: deposits.length,
      withdrawalsCount: withdrawals.length,
      transfersCount: transfers.length,
    }
  }, [allTransactions])

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) {
      toast.error("No transactions to export")
      return
    }

    const headers = ["Date", "Type", "Description", "From", "To", "Amount", "Status", "Transaction ID"]
    const csvData = filteredTransactions.map((tx) => [
      new Date(tx.date).toLocaleString(),
      tx.type,
      tx.description,
      tx.fromAccount,
      tx.toAccount,
      tx.amount,
      tx.status,
      tx.id,
    ])

    const csv = [headers.join(","), ...csvData.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `transaction-history-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success("Transaction history exported!")
  }

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return "💰"
      case "withdrawal":
        return "💸"
      case "transfer":
        return "🔄"
      default:
        return "📝"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FaHistory className="text-primary" />
            Transaction History
          </h1>
          <p className="text-sm text-gray-500 mt-1">View and manage all your transaction records</p>
        </div>
        <button onClick={exportToCSV} className="btn btn-primary gap-2">
          <FaDownload />
          Export CSV
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Transactions</div>
          <div className="stat-value text-primary">{stats.totalTransactions}</div>
          <div className="stat-desc">All time</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Deposits</div>
          <div className="stat-value text-success text-2xl">₦{stats.totalDeposits.toLocaleString()}</div>
          <div className="stat-desc">{stats.depositsCount} transactions</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Withdrawals</div>
          <div className="stat-value text-error text-2xl">₦{stats.totalWithdrawals.toLocaleString()}</div>
          <div className="stat-desc">{stats.withdrawalsCount} transactions</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Transfers</div>
          <div className="stat-value text-warning text-2xl">₦{stats.totalTransfers.toLocaleString()}</div>
          <div className="stat-desc">{stats.transfersCount} transactions</div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="flex items-center gap-2 mb-4">
            <FaFilter className="text-primary" />
            <h2 className="card-title">Filters & Search</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="input input-bordered w-full pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Type Filter */}
            <div className="form-control">
              <select
                className="select select-bordered w-full"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="deposit">Deposits</option>
                <option value="withdrawal">Withdrawals</option>
                <option value="transfer">Transfers</option>
              </select>
            </div>

            {/* Date Filter */}
            <div className="form-control">
              <select
                className="select select-bordered w-full"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">Last 7 Days</option>
                <option value="month">Last 30 Days</option>
                <option value="3months">Last 3 Months</option>
              </select>
            </div>

            {/* Sort */}
            <div className="form-control">
              <select
                className="select select-bordered w-full"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Highest Amount</option>
                <option value="lowest">Lowest Amount</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(searchTerm || filterType !== "all" || filterDate !== "all") && (
            <div className="flex items-center gap-2 mt-4">
              <span className="text-sm font-semibold">Active Filters:</span>
              {searchTerm && (
                <div className="badge badge-primary gap-2">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm("")}>✕</button>
                </div>
              )}
              {filterType !== "all" && (
                <div className="badge badge-secondary gap-2">
                  Type: {filterType}
                  <button onClick={() => setFilterType("all")}>✕</button>
                </div>
              )}
              {filterDate !== "all" && (
                <div className="badge badge-accent gap-2">
                  Date: {filterDate}
                  <button onClick={() => setFilterDate("all")}>✕</button>
                </div>
              )}
              <button
                onClick={() => {
                  setSearchTerm("")
                  setFilterType("all")
                  setFilterDate("all")
                }}
                className="btn btn-ghost btn-xs"
              >
                Clear All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Transaction List */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Transactions ({filteredTransactions.length})</h2>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <FaClock className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-500 text-lg">No transactions found</p>
              <p className="text-gray-400 text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>From</th>
                    <th>To</th>
                    <th className="text-right">Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover">
                      <td>
                        <div className="text-sm">{new Date(tx.date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-500">{new Date(tx.date).toLocaleTimeString()}</div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getTransactionIcon(tx.type)}</span>
                          <span className="capitalize font-medium">{tx.type}</span>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium">{tx.description}</div>
                        <div className="text-xs text-gray-500">{tx.id}</div>
                      </td>
                      <td className="font-mono text-sm">{tx.fromAccount}</td>
                      <td className="font-mono text-sm">{tx.toAccount}</td>
                      <td className="text-right">
                        <div
                          className={`font-bold ${
                            tx.type === "deposit"
                              ? "text-success"
                              : tx.type === "withdrawal"
                                ? "text-error"
                                : "text-warning"
                          }`}
                        >
                          {tx.type === "deposit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <span
                          className={`badge ${
                            tx.status === "completed"
                              ? "badge-success"
                              : tx.status === "pending"
                                ? "badge-warning"
                                : "badge-error"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
