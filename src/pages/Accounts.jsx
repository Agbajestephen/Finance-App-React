"use client";

import { useState } from "react";
import { useBanking } from "../contexts/BankingContext";
import {
  FaMoneyBillAlt,
  FaCreditCard,
  FaPiggyBank,
  FaWallet,
} from "react-icons/fa";

const Accounts = () => {
  const { accounts, loading, deposit, withdraw } = useBanking();

  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [actionType, setActionType] = useState("");
  const [actionAmount, setActionAmount] = useState("");
  const [actionDescription, setActionDescription] = useState("");

  const handleAction = (account, type) => {
    // ❌ BLOCK SAVINGS ACTIONS
    if (account.type === "savings") return;

    setSelectedAccount(account);
    setActionType(type);
    setShowActionModal(true);
    setActionAmount("");
    setActionDescription("");
  };

  const handleSubmitAction = () => {
    const amount = Number(actionAmount);
    if (!amount || amount <= 0) return;

    if (actionType === "deposit") {
      deposit(selectedAccount.id, amount, actionDescription || "Deposit");
    }

    if (actionType === "withdraw") {
      const success = withdraw(
        selectedAccount.id,
        amount,
        actionDescription || "Withdrawal"
      );
      if (!success) {
        alert("Insufficient balance");
        return;
      }
    }

    setShowActionModal(false);
  };

  const getIcon = (type) => {
    switch (type) {
      case "savings":
        return <FaPiggyBank className="text-green-500" />;
      case "checking":
        return <FaCreditCard className="text-blue-500" />;
      case "wallet":
        return <FaWallet className="text-purple-500" />;
      default:
        return <FaMoneyBillAlt className="text-gray-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Accounts</h1>
        <p className="text-gray-600">
          Savings is view-only. Main account supports transactions.
        </p>
      </div>

      {/* ACCOUNTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="card bg-white shadow-xl border"
          >
            <div className="card-body">
              {/* HEADER */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-gray-100">
                    {getIcon(account.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{account.name}</h3>
                    <p className="text-sm text-gray-500">
                      {account.accountNumber}
                    </p>
                  </div>
                </div>
                <span className="badge badge-outline capitalize">
                  {account.type}
                </span>
              </div>

              {/* BALANCE */}
              <div className="mb-6">
                <p className="text-sm text-gray-500">Balance</p>
                <p className="text-4xl font-bold">
                  ₦{account.balance.toLocaleString()}
                </p>
              </div>

              {/* ACTIONS */}
              {account.type === "checking" ? (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleAction(account, "deposit")}
                    className="btn btn-success btn-sm text-white"
                  >
                    Deposit
                  </button>
                  <button
                    onClick={() => handleAction(account, "withdraw")}
                    className="btn btn-error btn-sm text-white"
                  >
                    Withdraw
                  </button>
                </div>
              ) : (
                <div className="alert alert-info text-sm">
                  Savings account is view-only
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* ACTION MODAL */}
      {showActionModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-xl capitalize mb-4">
              {actionType} – {selectedAccount.name}
            </h3>

            <div className="space-y-4">
              <div className="alert alert-info text-sm">
                Balance: ₦{selectedAccount.balance.toLocaleString()}
              </div>

              <input
                type="number"
                min="1"
                className="input input-bordered w-full"
                placeholder="Amount"
                value={actionAmount}
                onChange={(e) => setActionAmount(e.target.value)}
              />

              <input
                type="text"
                className="input input-bordered w-full"
                placeholder="Description"
                value={actionDescription}
                onChange={(e) => setActionDescription(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowActionModal(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAction}
                className={`btn ${
                  actionType === "deposit"
                    ? "btn-success"
                    : "btn-error"
                } text-white`}
              >
                Confirm
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowActionModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Accounts;
