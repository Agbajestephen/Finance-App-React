"use client"

import { useState } from "react"
import { useBanking } from "../contexts/BankingContext"
import { FaPlus, FaMoneyBillAlt, FaCreditCard, FaPiggyBank, FaWallet } from "react-icons/fa"

const Accounts = () => {
  const { accounts, loading, createAccount, deposit, withdraw } = useBanking()
  const [showModal, setShowModal] = useState(false)
  const [showActionModal, setShowActionModal] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState(null)
  const [actionType, setActionType] = useState("")
  const [actionAmount, setActionAmount] = useState("")
  const [actionDescription, setActionDescription] = useState("")

  const [formData, setFormData] = useState({
    name: "",
    type: "savings",
  })

  const handleCreateAccount = () => {
    if (!formData.name.trim()) return

    createAccount(formData)
    setFormData({ name: "", type: "savings" })
    setShowModal(false)
  }

  const handleAction = (account, type) => {
    setSelectedAccount(account)
    setActionType(type)
    setShowActionModal(true)
    setActionAmount("")
    setActionDescription("")
  }

  const handleSubmitAction = () => {
    const amount = Number.parseFloat(actionAmount)
    if (!amount || amount <= 0) return

    if (actionType === "deposit") {
      deposit(selectedAccount.id, amount, actionDescription || "Deposit")
    } else if (actionType === "withdraw") {
      const success = withdraw(selectedAccount.id, amount, actionDescription || "Withdrawal")
      if (!success) {
        alert("Insufficient balance!")
        return
      }
    }

    setShowActionModal(false)
    setActionAmount("")
    setActionDescription("")
  }

  const getIcon = (type) => {
    switch (type) {
      case "savings":
        return <FaPiggyBank className="text-green-500" />
      case "checking":
        return <FaCreditCard className="text-blue-500" />
      case "wallet":
        return <FaWallet className="text-purple-500" />
      default:
        return <FaMoneyBillAlt className="text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Bank Accounts</h1>
          <p className="text-gray-600">Manage all your financial accounts</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary gap-2">
          <FaPlus /> Open New Account
        </button>
      </div>

      {/* Accounts Grid */}
      {accounts.length === 0 ? (
        <div className="card bg-white shadow-md border">
          <div className="card-body text-center py-16">
            <FaWallet className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No accounts yet</h3>
            <p className="text-gray-600 mb-6">Create your first account to get started</p>
            <button onClick={() => setShowModal(true)} className="btn btn-primary mx-auto">
              <FaPlus /> Open Your First Account
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accounts.map((account) => (
            <div key={account.id} className="card bg-white shadow-xl border hover:shadow-2xl transition-shadow">
              <div className="card-body">
                {/* Account Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gray-100">{getIcon(account.type)}</div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{account.name}</h3>
                      <p className="text-sm text-gray-500">{account.accountNumber}</p>
                    </div>
                  </div>
                  <span className="badge badge-outline capitalize">{account.type}</span>
                </div>

                {/* Balance */}
                <div className="mb-6">
                  <p className="text-gray-500 text-sm">Current Balance</p>
                  <p className="text-4xl font-bold text-gray-800 mt-1">₦{account.balance.toLocaleString()}</p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAction(account, "deposit")}
                    className="btn btn-success btn-sm text-white"
                  >
                    Deposit
                  </button>
                  <button onClick={() => handleAction(account, "withdraw")} className="btn btn-error btn-sm text-white">
                    Withdraw
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Account Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-6">Open New Account</h3>

            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Account Name *</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Account Type *</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="select select-bordered"
                >
                  <option value="savings">Savings Account</option>
                  <option value="checking">Checking Account</option>
                  <option value="wallet">Digital Wallet</option>
                  <option value="investment">Investment Account</option>
                </select>
              </div>
            </div>

            <div className="modal-action">
              <button onClick={() => setShowModal(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button onClick={handleCreateAccount} className="btn btn-primary">
                Create Account
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowModal(false)}></div>
        </div>
      )}

      {/* Deposit/Withdraw Modal */}
      {showActionModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-2xl mb-6 capitalize">
              {actionType} - {selectedAccount?.name}
            </h3>

            <div className="space-y-4">
              <div className="alert alert-info">
                <span className="text-sm">Current Balance: ₦{selectedAccount?.balance.toLocaleString()}</span>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Amount (₦) *</span>
                </label>
                <input
                  type="number"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(e.target.value)}
                  placeholder="0.00"
                  min="1"
                  step="0.01"
                  className="input input-bordered"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Description (Optional)</span>
                </label>
                <input
                  type="text"
                  value={actionDescription}
                  onChange={(e) => setActionDescription(e.target.value)}
                  placeholder={`e.g., ${actionType === "deposit" ? "Salary" : "Cash withdrawal"}`}
                  className="input input-bordered"
                />
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Quick Amounts</span>
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1000, 5000, 10000, 50000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setActionAmount(amt.toString())}
                      className="btn btn-outline btn-sm"
                    >
                      ₦{amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button onClick={() => setShowActionModal(false)} className="btn btn-ghost">
                Cancel
              </button>
              <button
                onClick={handleSubmitAction}
                className={`btn ${actionType === "deposit" ? "btn-success" : "btn-error"} text-white`}
              >
                {actionType === "deposit" ? "Deposit" : "Withdraw"}
              </button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setShowActionModal(false)}></div>
        </div>
      )}
    </div>
  )
}

export default Accounts
