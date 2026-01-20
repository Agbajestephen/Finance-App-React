import { useState } from "react";
import { FaExchangeAlt, FaCheckCircle } from "react-icons/fa";
import { transferByAccountNumber } from "../services/transferService";
import { findUserByAccountNumber } from "../services/findUserByAccount";
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

  const main = accounts.find((a) => a.type === "checking");
  const savings = accounts.find((a) => a.type === "savings");

  const lookupReceiver = async (value) => {
    setFormData({ ...formData, receiverAccountNumber: value });
    setError("");
    setReceiverName("");
    setReceiverUid(null);

    if (value.length < 6) return;

    try {
      const user = await findUserByAccountNumber(value);
      if (!user) {
        setError("Account not found");
        return;
      }

      setReceiverName(user.displayName || user.name || "Account Holder");
      setReceiverUid(user.uid);
    } catch (err) {
      console.error("Lookup error:", err);
      setError("Error looking up account");
    }
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
        if (!receiverUid) {
          setError("Please verify receiver account first");
          setLoading(false);
          return;
        }

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
      console.error("Transfer error:", err);
      setError(err.message || "Transfer failed");
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
            <p className="text-sm text-gray-600">Main Balance</p>
            <p className="text-xl font-bold">₦{(main?.balance || 0).toLocaleString()}</p>
          </div>
          <div className="p-4 bg-green-50 rounded">
            <p className="text-sm text-gray-600">Savings Balance</p>
            <p className="text-xl font-bold">₦{(savings?.balance || 0).toLocaleString()}</p>
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
                placeholder="Receiver Account Number (e.g., SB-5369001880)"
                value={formData.receiverAccountNumber}
                onChange={(e) => lookupReceiver(e.target.value)}
              />
              {receiverName && (
                <p className="text-green-600 text-sm flex items-center gap-2">
                  <FaCheckCircle /> Receiver: {receiverName}
                </p>
              )}
            </>
          )}

          {transferType === "internal" && (
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
          )}

          <input
            className="input input-bordered w-full"
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            min="1"
            step="0.01"
          />

          <input
            className="input input-bordered w-full"
            placeholder="Description (optional)"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <button 
            className="btn btn-primary w-full" 
            disabled={loading || (transferType === "external" && !receiverUid)}
          >
            <FaExchangeAlt />
            {loading ? "Processing..." : "Submit"}
          </button>
        </form>

        {success && (
          <div className="alert alert-success mt-4">
            <FaCheckCircle /> Transfer successful!
          </div>
        )}

        {error && (
          <div className="alert alert-error mt-4">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;