// src/pages/Transfers.jsx
import React, { useState } from 'react';
import { useBanking } from '../components/BankingContext';
import { FaExchangeAlt, FaCheckCircle } from 'react-icons/fa';

const Transfers = () => {
  const { accounts, transfer } = useBanking();
  const [formData, setFormData] = useState({
    fromAccount: '',
    toAccount: '',
    amount: '',
    description: ''
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleTransfer = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.fromAccount === formData.toAccount) {
      setError('Cannot transfer to the same account');
      return;
    }

    const amount = parseFloat(formData.amount);
    if (amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    const result = transfer(
      formData.fromAccount,
      formData.toAccount,
      amount,
      formData.description || 'Transfer'
    );

    if (result) {
      setSuccess(true);
      setFormData({
        fromAccount: '',
        toAccount: '',
        amount: '',
        description: ''
      });
      
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError('Transfer failed. Check account balance.');
    }
  };

  const handleQuickTransfer = (amount) => {
    if (accounts.length >= 2) {
      setFormData({
        fromAccount: accounts[0].id,
        toAccount: accounts[1].id,
        amount: amount.toString(),
        description: 'Quick transfer'
      });
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Transfer Money</h1>
        <p className="text-gray-600">Send money between your accounts instantly</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-fade-in">
          <FaCheckCircle className="text-green-600 text-xl flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">Transfer successful!</p>
            <p className="text-sm text-green-700">The amount has been transferred between accounts.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Transfer Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FaExchangeAlt className="text-blue-600 text-xl" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Make a Transfer</h2>
                <p className="text-gray-500 text-sm">Fill in the transfer details</p>
              </div>
            </div>

            <form onSubmit={handleTransfer} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">From Account *</label>
                <select
                  value={formData.fromAccount}
                  onChange={(e) => setFormData({...formData, fromAccount: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select source account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} - ₦{acc.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">To Account *</label>
                <select
                  value={formData.toAccount}
                  onChange={(e) => setFormData({...formData, toAccount: e.target.value})}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select destination account</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} - ₦{acc.balance.toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Amount (₦) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">₦</span>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    className="w-full p-3 pl-8 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="e.g., Rent payment, Gift to friend"
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors"
              >
                Transfer Money
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions & Info */}
        <div className="space-y-6">
          {/* Quick Transfers */}
          <div className="bg-white rounded-xl shadow-md border p-6">
            <h3 className="font-semibold mb-4">Quick Transfers</h3>
            <p className="text-sm text-gray-500 mb-4">One-click transfers between your first two accounts</p>
            <div className="space-y-3">
              {[1000, 5000, 10000, 50000].map(amount => (
                <button
                  key={amount}
                  onClick={() => handleQuickTransfer(amount)}
                  className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">₦{amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Quick transfer</p>
                    </div>
                    <FaExchangeAlt className="text-gray-400" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Transfer Limits */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-blue-800 mb-3">Transfer Information</h4>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                <span><strong>Instant:</strong> Transfers happen immediately</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                <span><strong>No fees:</strong> Free transfers between your accounts</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                <span><strong>Secure:</strong> All transfers are encrypted</span>
              </li>
              <li className="flex items-start">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-1.5 mr-2"></span>
                <span><strong>Daily limit:</strong> ₦5,000,000 per day</span>
              </li>
            </ul>
          </div>

          {/* Account Balances */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h4 className="font-semibold mb-3">Your Account Balances</h4>
            <div className="space-y-3">
              {accounts.slice(0, 3).map(acc => (
                <div key={acc.id} className="flex justify-between items-center p-2">
                  <div>
                    <p className="font-medium text-sm">{acc.name}</p>
                    <p className="text-xs text-gray-500">{acc.accountNumber.slice(0, 4)}...{acc.accountNumber.slice(-4)}</p>
                  </div>
                  <p className="font-semibold">₦{acc.balance.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transfers;