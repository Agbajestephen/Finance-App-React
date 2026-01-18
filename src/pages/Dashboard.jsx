"use client";

import { useBanking } from "../contexts/BankingContext";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import {
  FaWallet,
  FaPiggyBank,
  FaCreditCard,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaPlus,
  FaChartLine,
} from "react-icons/fa";

const Dashboard = () => {
  const { accounts, getAllUserTransactions, loading } = useBanking();
  const { currentUser } = useAuth();
  const transactions = getAllUserTransactions();

  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  // Get recent transactions (last 5)
  const recentTransactions = transactions.slice(0, 5);

  // Calculate statistics
  const totalIncome = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, t) => sum + t.amount, 0);

  const mainAccount = accounts.find((a) => a.type === "checking");

  const getAccountIcon = (type) => {
    switch (type) {
      case "savings":
        return <FaPiggyBank className="text-green-500" />;
      case "checking":
        return <FaCreditCard className="text-blue-500" />;
      case "wallet":
        return <FaWallet className="text-purple-500" />;
      default:
        return <FaWallet className="text-gray-500" />;
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return <FaArrowDown className="text-green-500" />;
      case "withdrawal":
        return <FaArrowUp className="text-red-500" />;
      case "transfer":
        return <FaExchangeAlt className="text-blue-500" />;
      default:
        return <FaExchangeAlt className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome back,{" "}
            {currentUser?.displayName ||
              currentUser?.email?.split("@")[0] ||
              "User"}
            !
          </h1>
          <p className="text-gray-600 mt-1">Here's your financial overview</p>
        </div>
        <div className="flex gap-3">
          <Link to="/transactions" className="btn btn-primary">
            <FaExchangeAlt /> New Transfer
          </Link>
          <Link to="/accounts" className="btn btn-outline">
            <FaPlus /> Add Account
          </Link>
        </div>
      </div>

      {/* Account Number */}
      {mainAccount && (
        <div className="bg-white border rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Your Account Number</p>
            <p className="text-xl font-mono font-semibold text-gray-800">
              {mainAccount.accountNumber}
            </p>
          </div>

          <button
            className="btn btn-outline btn-sm"
            onClick={() => {
              navigator.clipboard.writeText(mainAccount.accountNumber);
              alert("Account number copied!");
            }}
          >
            Copy
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Balance */}
        <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Balance</p>
                <h2 className="text-3xl font-bold mt-2">
                  ₦{totalBalance.toLocaleString()}
                </h2>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <FaWallet className="text-2xl" />
              </div>
            </div>
          </div>
        </div>

        {/* Accounts */}
        <div className="card bg-white shadow-md border">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Accounts</p>
                <h2 className="text-3xl font-bold mt-2 text-gray-800">
                  {accounts.length}
                </h2>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <FaPiggyBank className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Income */}
        <div className="card bg-white shadow-md border">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Income</p>
                <h2 className="text-3xl font-bold mt-2 text-green-600">
                  ₦{totalIncome.toLocaleString()}
                </h2>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <FaArrowDown className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Expenses */}
        <div className="card bg-white shadow-md border">
          <div className="card-body">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Expenses</p>
                <h2 className="text-3xl font-bold mt-2 text-red-600">
                  ₦{totalExpenses.toLocaleString()}
                </h2>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <FaArrowUp className="text-2xl text-red-600" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Accounts Overview */}
        <div className="lg:col-span-2">
          <div className="card bg-white shadow-md border">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h2 className="card-title text-2xl">Your Accounts</h2>
                <Link to="/accounts" className="btn btn-sm btn-ghost">
                  View All
                </Link>
              </div>

              <div className="space-y-4">
                {accounts.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">No accounts yet</p>
                    <Link to="/accounts" className="btn btn-primary">
                      <FaPlus /> Create Your First Account
                    </Link>
                  </div>
                ) : (
                  accounts.map((account) => (
                    <div
                      key={account.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          {getAccountIcon(account.type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {account.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {account.accountNumber}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-800">
                          ₦{account.balance.toLocaleString()}
                        </p>
                        <span className="text-xs text-gray-500 capitalize">
                          {account.type}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="lg:col-span-1">
          <div className="card bg-white shadow-md border">
            <div className="card-body">
              <div className="flex justify-between items-center mb-6">
                <h2 className="card-title">Recent Activity</h2>
                <Link to="/transactions" className="btn btn-sm btn-ghost">
                  View All
                </Link>
              </div>

              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">No transactions yet</p>
                  </div>
                ) : (
                  recentTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {transaction.description}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-semibold ${
                            transaction.type === "deposit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}₦
                          {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-2xl mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/transactions"
              className="btn bg-white/20 hover:bg-white/30 border-none text-white"
            >
              <FaExchangeAlt /> Transfer
            </Link>
            <Link
              to="/accounts"
              className="btn bg-white/20 hover:bg-white/30 border-none text-white"
            >
              <FaPlus /> New Account
            </Link>
            <Link
              to="/transactions"
              className="btn bg-white/20 hover:bg-white/30 border-none text-white"
            >
              <FaChartLine /> Analytics
            </Link>
            <Link
              to="/setting"
              className="btn bg-white/20 hover:bg-white/30 border-none text-white"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
