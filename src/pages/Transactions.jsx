"use client";

import { useState } from "react";
import { FaExchangeAlt, FaCheckCircle } from "react-icons/fa";
import { transferByAccountNumber } from "../services/transferService";
import { findUserByAccountNumber } from "../services/findUser";
import { useAuth } from "../contexts/AuthContext";
import { useBanking } from "../contexts/BankingContext";

const Transactions = () => {
  const { currentUser } = useAuth();
  const { transferBetweenBalances, accounts } = useBanking();

  const [transferType, setTransferType] = useState("external");
  const [formData, setFormData] = useState({
    receiverAccountNumber: "",
    amount: "",
    description: "",
    direction: "main_to_savings",
  });

  const [receiverName, setReceiverName] = useState("");
  const [receiverUid, setReceiverUid] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const main = accounts.find(a => a.type === "checking");
  const savings = accounts.find(a => a.type === "savings");

  const lookupReceiver = async (value) => {
    setFormData({ ...formData, receiverAccountNumber: value });
    setError("");
    setReceiverName("");
    setReceiverUid(null);

    if (value.length < 6) return;

    const user = await findUserByAccountNumber(value);
    if (!user) {
      setError("Receiver account not found");
      return;
    }

    setReceiverName(user.displayName || "Account Holder");
    setReceiverUid(user.uid);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const amount = Number(formData.amount);
    if (amount <= 0) return setError("Invalid amount");

    try {
      setLoading(true);

      if (transferType === "internal") {
        await transferBetweenBalances({
          from: formData.direction === "main_to_savings" ? "main" : "savings",
          to: formData.direction === "main_to_savings" ? "savings" : "main",
          amount,
        });
      }

      if (transferType === "external") {
        if (!receiverUid) throw new Error("Verify receiver first");

        await transferByAccountNumber({
          senderUid: currentUser.uid,
          receiverAccountNumber: formData.receiverAccountNumber,
          amount,
          note: formData.description || "Transfer",
        });
      }

      setSuccess(true);
      setFormData({
        receiverAccountNumber: "",
        amount: "",
        description: "",
        direction: "main_to_savings",
      });
      setReceiverName("");
      setReceiverUid(null);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-4">Transactions</h1>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-blue-50 rounded">
            Main Balance ₦{main?.balance || 0}
          </div>
          <div className="p-4 bg-green-50 rounded">
            Savings Balance ₦{savings?.balance || 0}
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <select
            className="select select-bordered w-full"
            value={transferType}
            onChange={(e) => setTransferType(e.target.value)}
          >
            <option value="external">Send to another account</option>
            <option value="internal">Move between Main & Savings</option>
          </select>

          {transferType === "external" && (
            <>
              <input
                className="input input-bordered w-full"
                placeholder="Receiver Account Number"
                value={formData.receiverAccountNumber}
                onChange={(e) => lookupReceiver(e.target.value)}
              />
              {receiverName && (
                <p className="text-green-600">Receiver: {receiverName}</p>
              )}
            </>
          )}

          <input
            className="input input-bordered w-full"
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />

          <input
            className="input input-bordered w-full"
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

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

        {error && <div className="alert alert-error mt-4">{error}</div>}
      </div>
    </div>
  );
};

export default Transactions;
