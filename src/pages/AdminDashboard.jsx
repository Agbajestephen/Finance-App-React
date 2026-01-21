import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import {
  getAllUsers,
  getAllUserTransactions,
  getFraudLogs,
  getUserLoginLogs,
} from "../services/adminService";
import {
  getAllLoanApplications,
  approveLoanApplication,
  rejectLoanApplication,
} from "../services/loanService";
import {
  FaUsers,
  FaExchangeAlt,
  FaExclamationTriangle,
  FaClock,
  FaSignOutAlt,
  FaMoneyBillWave,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";

export default function AdminDashboard() {
  const { userRole, logout, currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [fraudLogs, setFraudLogs] = useState([]);
  const [loginLogs, setLoginLogs] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userRole !== "admin") return;

    const fetchData = async () => {
      try {
        const [usersData, transactionsData, fraudData, logsData, loansData] =
          await Promise.all([
            getAllUsers(),
            getAllUserTransactions(),
            getFraudLogs(),
            getUserLoginLogs(),
            getAllLoanApplications(),
          ]);

        setUsers(usersData);
        setTransactions(transactionsData);
        setFraudLogs(fraudData);
        setLoginLogs(logsData);
        setLoans(loansData);
      } catch (error) {
        console.error("Error fetching admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userRole]);

  if (userRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <FaExclamationTriangle className="text-6xl text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-700">Access Denied</h2>
          <p className="text-red-600 mb-4">Admin privileges required</p>
          <button
            onClick={() => (window.location.href = "/admin-login")}
            className="btn btn-primary"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  const handleApproveLoan = async (loanId) => {
    try {
      await approveLoanApplication(loanId, currentUser.uid);
      // Refresh loans data
      const loansData = await getAllLoanApplications();
      setLoans(loansData);
      alert("Loan approved successfully!");
    } catch (error) {
      console.error("Error approving loan:", error);
      alert("Failed to approve loan. Please try again.");
    }
  };

  const handleRejectLoan = async (loanId) => {
    const reason = prompt("Enter rejection reason (optional):");
    try {
      await rejectLoanApplication(loanId, currentUser.uid, reason);
      // Refresh loans data
      const loansData = await getAllLoanApplications();
      setLoans(loansData);
      alert("Loan rejected successfully!");
    } catch (error) {
      console.error("Error rejecting loan:", error);
      alert("Failed to reject loan. Please try again.");
    }
  };

  const stats = [
    {
      title: "Total Users",
      value: users.length,
      icon: <FaUsers className="text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Total Transactions",
      value: transactions.length,
      icon: <FaExchangeAlt className="text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Fraud Alerts",
      value: fraudLogs.filter((log) => log.status === "flagged").length,
      icon: <FaExclamationTriangle className="text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      title: "Active Sessions",
      value: loginLogs.filter((log) => log.action === "login").length,
      icon: <FaClock className="text-blue-500" />,
      color: "bg-blue-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <button onClick={logout} className="btn btn-outline btn-error">
            <FaSignOutAlt className="mr-2" />
            Logout
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card bg-white shadow-lg">
              <div className="card-body p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stat.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Transactions */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.slice(0, 5).map((txn, index) => (
                      <tr key={`${txn.id}_${index}`}>
                        <td>{txn.userId || "Unknown"}</td>
                        <td>{txn.type}</td>
                        <td>₦{txn.amount}</td>
                        <td>{new Date(txn.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Fraud Logs */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Fraud Detection Logs</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>User</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fraudLogs.slice(0, 5).map((log) => (
                      <tr key={log.id}>
                        <td>{log.type}</td>
                        <td>{log.userId}</td>
                        <td>₦{log.amount}</td>
                        <td>
                          <span
                            className={`badge ${
                              log.status === "flagged"
                                ? "badge-error"
                                : "badge-success"
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Loan Applications */}
          <div className="card bg-white shadow-lg">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">Loan Applications</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loans.slice(0, 5).map((loan) => (
                      <tr key={loan.id}>
                        <td>{loan.userId || "Unknown"}</td>
                        <td>{loan.loanType}</td>
                        <td>₦{loan.amount.toLocaleString()}</td>
                        <td>
                          <span
                            className={`badge ${
                              loan.status === "approved"
                                ? "badge-success"
                                : loan.status === "rejected"
                                  ? "badge-error"
                                  : "badge-warning"
                            }`}
                          >
                            {loan.status}
                          </span>
                        </td>
                        <td>
                          {loan.status === "pending" && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleApproveLoan(loan.id)}
                                className="btn btn-success btn-xs"
                              >
                                <FaCheckCircle className="mr-1" />
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectLoan(loan.id)}
                                className="btn btn-error btn-xs"
                              >
                                <FaTimesCircle className="mr-1" />
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* User Login Logs */}
          <div className="card bg-white shadow-lg lg:col-span-2">
            <div className="card-body">
              <h2 className="card-title text-xl mb-4">User Login Activity</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Action</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loginLogs.slice(0, 10).map((log) => (
                      <tr key={log.id}>
                        <td>{log.userId || log.email || "Unknown"}</td>
                        <td>{log.action}</td>
                        <td>
                          {log.timestamp
                            ? new Date(
                                log.timestamp.seconds * 1000,
                              ).toLocaleString()
                            : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
