"use client"

import { useState } from "react"
import { useBanking } from "../contexts/BankingContext"
import { FaExchangeAlt, FaCheckCircle, FaUsers, FaUniversity, FaMobileAlt } from "react-icons/fa"

const Transactions = () => {
  const { accounts, transfer, getAccountById } = useBanking()

  const [formData, setFormData] = useState({
    fromAccount: "",
    toAccount: "",
    amount: "",
    description: "",
  })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleTransfer = (e) => {
    e.preventDefault()
    setError("")

    if (!formData.fromAccount || !formData.toAccount || !formData.amount) {
      setError("Please fill all required fields")
      return
    }

    if (formData.fromAccount === formData.toAccount) {
      setError("Cannot transfer to the same account")
      return
    }

    const amount = Number.parseFloat(formData.amount)
    if (amount <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    const sourceAccount = getAccountById(formData.fromAccount)
    if (sourceAccount && sourceAccount.balance < amount) {
      setError(`Insufficient balance in ${sourceAccount.name}. Available: ₦${sourceAccount.balance.toLocaleString()}`)
      return
    }

    const result = transfer(formData.fromAccount, formData.toAccount, amount, formData.description || "Transfer")

    if (result) {
      setSuccess(true)
      setFormData({
        fromAccount: "",
        toAccount: "",
        amount: "",
        description: "",
      })

      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } else {
      setError("Transfer failed. Check account balance.")
    }
  }

  const handleQuickTransfer = (amount) => {
    if (accounts.length >= 2) {
      setFormData({
        fromAccount: accounts[0].id,
        toAccount: accounts[1].id,
        amount: amount.toString(),
        description: "Quick transfer",
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Transfer Money</h1>
          <p className="text-gray-600 mt-2">Send money between your accounts instantly</p>
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
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">From Account *</span>
                  </label>
                  <select
                    value={formData.fromAccount}
                    onChange={(e) => setFormData({ ...formData, fromAccount: e.target.value })}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select source account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} - ₦{acc.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">To Account *</span>
                  </label>
                  <select
                    value={formData.toAccount}
                    onChange={(e) => setFormData({ ...formData, toAccount: e.target.value })}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select destination account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} - ₦{acc.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Amount (₦) *</span>
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="0.00"
                    min="1"
                    step="0.01"
                    className="input input-bordered w-full"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Description (Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="e.g., Rent payment, Gift to friend"
                    className="input input-bordered w-full"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full">
                  <FaExchangeAlt className="mr-2" />
                  Transfer Money
                </button>
              </form>
            </div>

            {/* Transfer Types Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white rounded-xl shadow-md border p-4 flex items-start gap-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FaUsers className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Between Accounts</h3>
                  <p className="text-xs text-gray-500 mt-1">Transfer between your accounts</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border p-4 flex items-start gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FaUniversity className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">To Other Banks</h3>
                  <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-md border p-4 flex items-start gap-3">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FaMobileAlt className="text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Mobile Money</h3>
                  <p className="text-xs text-gray-500 mt-1">Coming soon</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Transfers */}
            <div className="bg-white rounded-xl shadow-md border p-6">
              <h3 className="font-semibold mb-4">Quick Transfers</h3>
              <p className="text-sm text-gray-500 mb-4">One-click transfers between your first two accounts</p>
              <div className="space-y-3">
                {[1000, 5000, 10000, 50000].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickTransfer(amount)}
                    className="btn btn-outline w-full"
                    disabled={accounts.length < 2}
                  >
                    ₦{amount.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* Transfer Info */}
            <div className="alert alert-info">
              <div>
                <h4 className="font-semibold mb-2">Transfer Information</h4>
                <ul className="text-sm space-y-1">
                  <li>• Instant transfers</li>
                  <li>• No fees between accounts</li>
                  <li>• Secure & encrypted</li>
                  <li>• Daily limit: ₦5,000,000</li>
                </ul>
              </div>
            </div>

            {/* Your Accounts Summary */}
            <div className="bg-white rounded-xl shadow-md border p-6">
              <h3 className="font-semibold mb-4">Your Accounts</h3>
              <div className="space-y-3">
                {accounts.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">No accounts available</p>
                ) : (
                  accounts.map((acc) => (
                    <div key={acc.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{acc.name}</p>
                          <p className="text-xs text-gray-500">{acc.accountNumber}</p>
                        </div>
                        <p className="font-bold text-sm">₦{acc.balance.toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Transactions
