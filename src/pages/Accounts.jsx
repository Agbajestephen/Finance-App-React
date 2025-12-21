// src/pages/Accounts.jsx
import React, { useState } from "react";
import DashboardLayout from "../components/DashboardLayout.jsx";
import { 
  Plus,
  MoreVertical,
  Download,
  Filter,
  Search,
  CreditCard,
  Building,
  Wallet,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  ChevronRight,
  History,
  BarChart3,
  PiggyBank,
  Shield
} from "lucide-react";

const Accounts = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Account Types Data
  const accountTypes = [
    {
      id: 1,
      type: "Checking",
      count: 3,
      total: "$8,450.00",
      color: "from-blue-500 to-blue-600",
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      id: 2,
      type: "Savings",
      count: 2,
      total: "$15,280.50",
      color: "from-emerald-500 to-emerald-600",
      icon: <PiggyBank className="w-6 h-6" />
    },
    {
      id: 3,
      type: "Investment",
      count: 1,
      total: "$32,450.00",
      color: "from-purple-500 to-purple-600",
      icon: <TrendingUp className="w-6 h-6" />
    },
    {
      id: 4,
      type: "Credit",
      count: 2,
      total: "$4,250.00",
      color: "from-amber-500 to-amber-600",
      icon: <Wallet className="w-6 h-6" />
    }
  ];

  // Accounts List Data
  const accounts = [
    {
      id: 1,
      name: "Primary Checking",
      type: "Checking",
      bank: "SoftBank",
      accountNumber: "**** 4832",
      balance: "$5,432.10",
      status: "Active",
      lastTransaction: "2 hours ago",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      trend: "+2.5%"
    },
    {
      id: 2,
      name: "Emergency Fund",
      type: "Savings",
      bank: "SoftBank",
      accountNumber: "**** 5678",
      balance: "$12,345.67",
      status: "Active",
      lastTransaction: "1 day ago",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      trend: "+5.2%"
    },
    {
      id: 3,
      name: "Investment Portfolio",
      type: "Investment",
      bank: "SoftBank Wealth",
      accountNumber: "**** 9012",
      balance: "$45,678.90",
      status: "Active",
      lastTransaction: "3 hours ago",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      trend: "+12.8%"
    },
    {
      id: 4,
      name: "Business Account",
      type: "Checking",
      bank: "SoftBank Business",
      accountNumber: "**** 3456",
      balance: "$28,900.00",
      status: "Active",
      lastTransaction: "5 hours ago",
      color: "bg-gradient-to-br from-blue-400 to-cyan-500",
      trend: "+8.3%"
    },
    {
      id: 5,
      name: "Vacation Savings",
      type: "Savings",
      bank: "SoftBank",
      accountNumber: "**** 7890",
      balance: "$2,934.50",
      status: "Active",
      lastTransaction: "2 days ago",
      color: "bg-gradient-to-br from-emerald-400 to-teal-500",
      trend: "+3.7%"
    },
    {
      id: 6,
      name: "Credit Card",
      type: "Credit",
      bank: "SoftBank Platinum",
      accountNumber: "**** 2345",
      balance: "$1,250.00",
      status: "Balance Due",
      lastTransaction: "Just now",
      color: "bg-gradient-to-br from-amber-500 to-orange-600",
      trend: "-$250.00"
    }
  ];

  // Recent Transactions
  const recentTransactions = [
    {
      id: 1,
      account: "Primary Checking",
      description: "Spotify Subscription",
      date: "25 Jan 2021",
      type: "Service",
      amount: "-$150",
      status: "Pending",
      icon: <TrendingDown className="w-5 h-5 text-rose-500" />
    },
    {
      id: 2,
      account: "Emergency Fund",
      description: "Mobile Service",
      date: "25 Jan 2021",
      type: "Service",
      amount: "-$340",
      status: "Completed",
      icon: <TrendingDown className="w-5 h-5 text-rose-500" />
    },
    {
      id: 3,
      account: "Investment Portfolio",
      description: "Emily Wilson",
      date: "25 Jan 2021",
      type: "Transfer",
      amount: "+$780",
      status: "Completed",
      icon: <TrendingUp className="w-5 h-5 text-emerald-500" />
    },
    {
      id: 4,
      account: "Business Account",
      description: "Shopping",
      date: "25 Jan 2021",
      type: "Shopping",
      amount: "-$420",
      status: "Completed",
      icon: <TrendingDown className="w-5 h-5 text-rose-500" />
    }
  ];

  // Account Stats
  const accountStats = [
    { label: "Total Balance", value: "$12,750", change: "+2.5%", positive: true },
    { label: "Total Income", value: "$5,600", change: "+12.5%", positive: true },
    { label: "Total Expense", value: "$3,460", change: "-3.5%", positive: false },
    { label: "Total Saving", value: "$7,920", change: "+8.2%", positive: true }
  ];

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
            <p className="text-gray-600">Manage all your financial accounts in one place</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg flex items-center space-x-2 hover:bg-gray-50">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center space-x-2 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              <span>Add Account</span>
            </button>
          </div>
        </div>

        {/* Account Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {accountStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    {stat.positive ? (
                      <ArrowUpRight className="w-4 h-4 text-emerald-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-rose-500 mr-1" />
                    )}
                    <span className={`text-sm ${stat.positive ? 'text-emerald-600' : 'text-rose-600'}`}>
                      {stat.change} from last month
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.positive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                  {stat.positive ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <TrendingDown className="w-6 h-6" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Account Types Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Account Types Overview</h2>
            <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View All →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accountTypes.map((type) => (
              <div key={type.id} className={`bg-gradient-to-br ${type.color} rounded-2xl p-6 text-white`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white/80 text-sm mb-1">{type.type}</p>
                    <p className="text-2xl font-bold">{type.total}</p>
                    <p className="text-white/80 text-sm mt-2">{type.count} Accounts</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-xl">
                    {type.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Accounts List */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">All Accounts</h2>
                <p className="text-gray-600">Total 6 accounts • $98,540.17 combined</p>
              </div>
              <div className="flex space-x-2">
                {["all", "checking", "savings", "investment", "credit"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                      activeTab === tab
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {accounts.map((account) => (
                <div key={account.id} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${account.color} text-white`}>
                      <Building className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">{account.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          account.status === "Active"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {account.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {account.bank} • {account.accountNumber} • {account.type}
                      </p>
                      <p className="text-xs text-gray-500">Last transaction: {account.lastTransaction}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{account.balance}</p>
                      <p className={`text-sm ${account.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {account.trend}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="View Details">
                        <Eye className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="Edit">
                        <Edit className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg" title="More">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <button className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-gray-400 hover:text-gray-800 transition-colors flex items-center justify-center space-x-2">
                <Plus className="w-5 h-5" />
                <span>Add New Account</span>
              </button>
            </div>
          </div>

          {/* Recent Transactions & Quick Stats */}
          <div className="space-y-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  See All →
                </button>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        {transaction.icon}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.date} • {transaction.account}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.amount.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {transaction.amount}
                      </p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {transaction.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Plus className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-900">Add New Account</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <History className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">Transaction History</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">Financial Reports</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
                
                <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors group">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Shield className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-900">Security Settings</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Performance */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Account Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-800 font-medium mb-1">Active Accounts</p>
                  <p className="text-2xl font-bold text-blue-900">6</p>
                </div>
                <Building className="w-10 h-10 text-blue-600" />
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-800 font-medium mb-1">Monthly Growth</p>
                  <p className="text-2xl font-bold text-emerald-900">+8.5%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-emerald-600" />
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-800 font-medium mb-1">Due Payments</p>
                  <p className="text-2xl font-bold text-amber-900">$1,250</p>
                </div>
                <CreditCard className="w-10 h-10 text-amber-600" />
              </div>
            </div>
            
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-800 font-medium mb-1">Interest Earned</p>
                  <p className="text-2xl font-bold text-purple-900">$342.50</p>
                </div>
                <PiggyBank className="w-10 h-10 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Accounts;