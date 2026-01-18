"use client"

import { useState } from "react"
import { FaExchangeAlt, FaCheckCircle, FaUniversity } from "react-icons/fa"
import { transferByAccountNumber } from "../services/transferService"
import { useAuth } from "../contexts/AuthContext"
import { useBanking } from "../contexts/BankingContext"


const Transactions = () => {
  const { currentUser } = useAuth()
  const { transferBetweenBalances, accounts } = useBanking()

  const [transferType, setTransferType] = useState("external") // external | internal

  const [formData, setFormData] = useState({
    receiverAccountNumber: "",
    amount: "",
    description: "",
    direction: "main_to_savings", // internal only
  })

  const verifyRecipient = async () => {
  const user = await findUserByAccountNumber(accountNumber);
  if (!user) {
    setError("Account not found");
  } else {
    setRecipient(user.name);
  }
};

  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const mainAccount = accounts.find(a => a.type === "checking")
  const savingsAccount = accounts.find(a => a.type === "savings")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    const amount = Number(formData.amount)
    if (amount <= 0) {
      setError("Amount must be greater than 0")
      return
    }

    try {
      setLoading(true)

      // 🔵 INTERNAL TRANSFER
      if (transferType === "internal") {
        await transferBetweenBalances({
          accountId: mainAccount.id,
          from: formData.direction === "main_to_savings" ? "main" : "savings",
          to: formData.direction === "main_to_savings" ? "savings" : "main",
          amount,
        })
      }

      // 🟢 EXTERNAL TRANSFER
      if (transferType === "external") {
        if (!formData.receiverAccountNumber) {
          throw new Error("Receiver account number is required")
        }

        await transferByAccountNumber({
          senderUid: currentUser.uid,
          receiverAccountNumber: formData.receiverAccountNumber.trim(),
          amount,
          note: formData.description || "Transfer",
        })
      }

      setSuccess(true)
      setFormData({
        receiverAccountNumber: "",
        amount: "",
        description: "",
        direction: "main_to_savings",
      })

      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || "Transfer failed")
    } finally {
      setLoading(false)
    }
  }
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
  <div className="bg-blue-50 border p-4 rounded-xl">
    <p className="text-sm text-gray-600">Main Balance</p>
    <p className="text-2xl font-bold text-blue-700">
      ₦{mainAccount?.balances?.main?.toLocaleString() || 0}
    </p>
  </div>

  <div className="bg-green-50 border p-4 rounded-xl">
    <p className="text-sm text-gray-600">Savings Balance</p>
    <p className="text-2xl font-bold text-green-700">
      ₦{savingsAccount?.balances?.savings?.toLocaleString() || 0}
    </p>
  </div>
</div>


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4">Transactions</h1>

        {/* TRANSFER TYPE */}
        <div className="mb-6">
          <label className="label font-medium">Transfer Type</label>
          <select
            className="select select-bordered w-full"
            value={transferType}
            onChange={(e) => setTransferType(e.target.value)}
          >
            <option value="external">Send to another account</option>
            <option value="internal">Move between Main & Savings</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* INTERNAL TRANSFER */}
          {transferType === "internal" && (
            <div>
              <label className="label font-medium">Direction</label>
              <select
                className="select select-bordered w-full"
                value={formData.direction}
                onChange={(e) =>
                  setFormData({ ...formData, direction: e.target.value })
                }
              >
                <option value="main_to_savings">Main → Savings</option>
                <option value="savings_to_main">Savings → Main</option>
              </select>
            </div>
          )}

          {/* EXTERNAL TRANSFER */}
          {transferType === "external" && (
            <div>
              <label className="label font-medium">
                Receiver Account Number
              </label>
              <input
                className="input input-bordered w-full"
                value={formData.receiverAccountNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    receiverAccountNumber: e.target.value,
                  })
                }
                placeholder="SB-1002456789"
              />
            </div>
          )}

          {/* AMOUNT */}
          <div>
            <label className="label font-medium">Amount (₦)</label>
            <input
              type="number"
              min="1"
              className="input input-bordered w-full"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="label font-medium">Description</label>
            <input
              className="input input-bordered w-full"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <button className="btn btn-primary w-full" disabled={loading}>
            <FaExchangeAlt className="mr-2" />
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>

        {success && (
          <div className="alert alert-success mt-4">
            <FaCheckCircle /> Transfer successful
          </div>
        )}

        {error && (
          <div className="alert alert-error mt-4">{error}</div>
        )}
      </div>
    </div>
  )
}

export default Transactions
