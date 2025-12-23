// src/pages/Accounts.jsx (Update to use BankingContext)
import React, { useState } from 'react';
import { useBanking } from '../components/BankingContext';
import { 
  FaPlus, FaEdit, FaTrash, FaUser, FaMoneyBillAlt, 
  FaCreditCard, FaPiggyBank, FaWallet 
} from 'react-icons/fa';

const Accounts = () => {
  const { accounts, loading, createAccount, deposit, withdraw } = useBanking();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'savings'
  });

  const handleCreateAccount = () => {
    if (!formData.name.trim()) return;
    
    createAccount(formData);
    setFormData({ name: '', type: 'savings' });
    setShowModal(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case 'savings': return <FaPiggyBank className="text-green-500" />;
      case 'checking': return <FaCreditCard className="text-blue-500" />;
      case 'wallet': return <FaWallet className="text-purple-500" />;
      default: return <FaMoneyBillAlt className="text-gray-500" />;
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bank Accounts</h1>
          <p className="text-gray-600">Manage all your financial accounts</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
        >
          <FaPlus /> Open New Account
        </button>
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="bg-white rounded-xl shadow-md border p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-gray-100">
                  {getIcon(account.type)}
                </div>
                <div>
                  <h3 className="font-semibold">{account.name}</h3>
                  <p className="text-sm text-gray-500">{account.accountNumber}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                {account.type}
              </span>
            </div>

            <div className="mb-6">
              <p className="text-gray-500 text-sm">Current Balance</p>
              <p className="text-3xl font-bold text-gray-800">
                ₦{account.balance.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => deposit(account.id, 1000, 'Quick deposit')}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg"
              >
                + ₦1,000
              </button>
              <button
                onClick={() => withdraw(account.id, 1000, 'Quick withdrawal')}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg"
              >
                - ₦1,000
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Account Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-6">Open New Account</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Account Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g., Emergency Fund"
                  className="w-full p-3 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Account Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full p-3 border rounded-lg"
                >
                  <option value="savings">Savings Account</option>
                  <option value="checking">Checking Account</option>
                  <option value="wallet">Digital Wallet</option>
                  <option value="investment">Investment Account</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 border rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAccount}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Accounts;