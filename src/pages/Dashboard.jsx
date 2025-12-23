// src/pages/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useBanking } from '../components/BankingContext';
import { 
  FaMoneyBillWave, FaExchangeAlt, FaHistory, 
  FaUserCircle, FaCreditCard, FaChartLine
} from 'react-icons/fa';


const Dashboard = () => {
  const { currentUser } = useAuth();
  const { accounts, transactions, loading } = useBanking();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = transactions.slice(0, 5);

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {currentUser?.displayName || currentUser?.email?.split('@')[0]}!
        </h1>
        <p className="text-gray-600">Here's your financial overview</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Balance</p>
              <p className="text-3xl font-bold text-gray-800">₦{totalBalance.toLocaleString()}</p>
            </div>
            <FaMoneyBillWave className="text-4xl text-green-500" />
          </div>
          <p className="text-sm text-gray-500 mt-2">Across {accounts.length} accounts</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Total Accounts</p>
              <p className="text-3xl font-bold text-gray-800">{accounts.length}</p>
            </div>
            <FaCreditCard className="text-4xl text-blue-500" />
          </div>
          <Link to="/accounts" className="text-blue-600 text-sm mt-2 inline-block">
            View all accounts →
          </Link>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">Recent Transactions</p>
              <p className="text-3xl font-bold text-gray-800">{transactions.length}</p>
            </div>
            <FaHistory className="text-4xl text-purple-500" />
          </div>
          <Link to="/transactions" className="text-blue-600 text-sm mt-2 inline-block">
            View all transactions →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/transfers"
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl flex flex-col items-center justify-center transition-colors"
          >
            <FaExchangeAlt className="text-2xl mb-2" />
            <span>Transfer Money</span>
          </Link>

          <button
            onClick={() => {/* Add deposit functionality */}}
            className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl flex flex-col items-center justify-center transition-colors"
          >
            <FaMoneyBillWave className="text-2xl mb-2" />
            <span>Deposit</span>
          </button>

          <Link
            to="/accounts"
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl flex flex-col items-center justify-center transition-colors"
          >
            <FaCreditCard className="text-2xl mb-2" />
            <span>Open Account</span>
          </Link>

          <Link
            to="/profile"
            className="bg-gray-700 hover:bg-gray-800 text-white p-4 rounded-xl flex flex-col items-center justify-center transition-colors"
          >
            <FaUserCircle className="text-2xl mb-2" />
            <span>My Profile</span>
          </Link>
        </div>
      </div>

      {/* Recent Accounts */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Accounts</h2>
          <Link to="/accounts" className="text-blue-600 hover:text-blue-800">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.slice(0, 3).map(account => (
            <div key={account.id} className="bg-white p-4 rounded-xl shadow-sm border">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{account.name}</h3>
                  <p className="text-sm text-gray-500">{account.accountNumber}</p>
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  {account.type}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                ₦{account.balance.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Transactions</h2>
          <Link to="/transactions" className="text-blue-600 hover:text-blue-800">
            View All →
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          {recentTransactions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <FaHistory className="text-4xl mx-auto mb-4 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Date</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map(tx => (
                  <tr key={tx.id} className="border-t">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{tx.description}</p>
                        <p className="text-sm text-gray-500">
                          {tx.fromAccount} → {tx.toAccount}
                        </p>
                      </div>
                    </td>
                    <td className={`p-4 font-semibold ${
                      tx.type === 'deposit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'deposit' ? '+' : '-'}₦{tx.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-gray-600">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;