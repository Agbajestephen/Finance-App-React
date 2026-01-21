"use client";

import { useState, useEffect } from "react";
import { useBanking } from "../contexts/BankingContext";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import {
  FaMoneyBillWave,
  FaHome,
  FaCar,
  FaGraduationCap,
  FaBriefcase,
  FaCheckCircle,
  FaInfoCircle,
} from "react-icons/fa";
import { submitLoanApplication } from "../services/loanService";

const Loans = () => {
  const { accounts } = useBanking();
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("apply");
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    loanType: "",
    amount: "",
    purpose: "",
    duration: "12",
    accountId: "",
  });

  const loanTypes = [
    {
      id: "personal",
      name: "Personal Loan",
      icon: FaMoneyBillWave,
      rate: 15,
      max: 5000000,
      min: 50000,
      maxTerm: 60, // 5 years
      description: "For personal needs, emergencies, or lifestyle expenses",
    },
    {
      id: "home",
      name: "Home Loan",
      icon: FaHome,
      rate: 10,
      max: 50000000,
      min: 1000000,
      maxTerm: 360, // 30 years
      description:
        "Purchase, construction, or renovation of residential property",
    },
    {
      id: "car",
      name: "Car Loan",
      icon: FaCar,
      rate: 12,
      max: 20000000,
      min: 500000,
      maxTerm: 84, // 7 years
      description: "Purchase of new or used vehicles",
    },
    {
      id: "education",
      name: "Education Loan",
      icon: FaGraduationCap,
      rate: 8,
      max: 10000000,
      min: 100000,
      maxTerm: 120, // 10 years
      description: "Tuition fees, accommodation, and educational expenses",
    },
    {
      id: "business",
      name: "Business Loan",
      icon: FaBriefcase,
      rate: 20,
      max: 50000000,
      min: 500000,
      maxTerm: 120, // 10 years
      description: "Working capital, equipment purchase, or business expansion",
    },
  ];

  const calculateEMI = (principal, rate, months) => {
    const monthlyRate = rate / 12 / 100;
    const emi =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return emi;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLoanApplication = async (e) => {
    e.preventDefault();

    if (submitting) return; // Prevent double submission

    if (
      !formData.loanType ||
      !formData.amount ||
      !formData.purpose ||
      !formData.accountId
    ) {
      toast.error("Please fill all fields");
      return;
    }

    const selectedLoanType = loanTypes.find(
      (lt) => lt.id === formData.loanType,
    );
    const amount = Number.parseFloat(formData.amount);

    if (amount > selectedLoanType.max) {
      toast.error(
        `Maximum loan amount for ${selectedLoanType.name} is ₦${selectedLoanType.max.toLocaleString()}`,
      );
      return;
    }

    if (amount < selectedLoanType.min) {
      toast.error(
        `Minimum loan amount for ${selectedLoanType.name} is ₦${selectedLoanType.min.toLocaleString()}`,
      );
      return;
    }

    const emi = calculateEMI(
      amount,
      selectedLoanType.rate,
      Number.parseInt(formData.duration),
    );

    const loanData = {
      userId: currentUser.uid,
      loanType: selectedLoanType.name,
      amount,
      purpose: formData.purpose,
      duration: Number.parseInt(formData.duration),
      interestRate: selectedLoanType.rate,
      emi: Math.round(emi),
      totalPayable: Math.round(emi * Number.parseInt(formData.duration)),
      accountId: formData.accountId,
    };

    setSubmitting(true);

    try {
      const result = await submitLoanApplication(loanData);
      toast.success("Loan application submitted successfully!");
      setFormData({
        loanType: "",
        amount: "",
        purpose: "",
        duration: "12",
        accountId: "",
      });
      console.log("Loan submitted with ID:", result);
    } catch (error) {
      toast.error("Failed to submit loan application. Please try again.");
      console.error("Error submitting loan:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Loans & Credit</h1>
        <p className="text-gray-600 mt-1">
          Apply for loans and manage your credit
        </p>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-white shadow-md p-2">
        <button
          className={`tab ${activeTab === "apply" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("apply")}
        >
          Apply for Loan
        </button>
        <button
          className={`tab ${activeTab === "info" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("info")}
        >
          Loan Info
        </button>
      </div>

      {/* Apply for Loan Tab */}
      {activeTab === "apply" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Loan Types */}
          <div className="card bg-white shadow-md border">
            <div className="card-body">
              <h2 className="card-title mb-4">Select Loan Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {loanTypes.map((loan) => {
                  const Icon = loan.icon;
                  return (
                    <div
                      key={loan.id}
                      onClick={() =>
                        setFormData({ ...formData, loanType: loan.id })
                      }
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.loanType === loan.id
                          ? "border-primary bg-primary/10"
                          : "border-gray-200 hover:border-primary/50"
                      }`}
                    >
                      <Icon className="text-3xl text-primary mb-2" />
                      <h3 className="font-semibold text-gray-800">
                        {loan.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Up to ₦{(loan.max / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-primary mt-1">
                        {loan.rate}% interest
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="card bg-white shadow-md border">
            <div className="card-body">
              <h2 className="card-title mb-4">Loan Application</h2>

              <form onSubmit={handleLoanApplication} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Loan Amount (₦)
                    </span>
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount"
                    className="input input-bordered"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Purpose</span>
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="Why do you need this loan?"
                    className="textarea textarea-bordered"
                    rows="3"
                    required
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Loan Duration (Months)
                    </span>
                  </label>
                  <select
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className="select select-bordered"
                  >
                    <option value="6">6 months</option>
                    <option value="12">12 months</option>
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">
                      Credit to Account
                    </span>
                  </label>
                  <select
                    name="accountId"
                    value={formData.accountId}
                    onChange={handleInputChange}
                    className="select select-bordered"
                    required
                  >
                    <option value="">Select account</option>
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} - ₦{acc.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* EMI Calculator */}
                {formData.loanType && formData.amount && (
                  <div className="alert alert-info">
                    <FaInfoCircle />
                    <div>
                      <p className="font-semibold">
                        Estimated Monthly Payment (EMI)
                      </p>
                      <p className="text-lg font-bold">
                        ₦
                        {calculateEMI(
                          Number.parseFloat(formData.amount || 0),
                          loanTypes.find((lt) => lt.id === formData.loanType)
                            ?.rate || 0,
                          Number.parseInt(formData.duration),
                        ).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </p>
                    </div>
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-full">
                  Submit Application
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Loan Info Tab */}
      {activeTab === "info" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="card bg-white shadow-md border">
            <div className="card-body">
              <h2 className="card-title mb-4">Interest Rates</h2>
              <div className="space-y-4">
                {loanTypes.map((loan) => {
                  const Icon = loan.icon;
                  return (
                    <div
                      key={loan.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="text-2xl text-primary" />
                        <div>
                          <p className="font-semibold">{loan.name}</p>
                          <p className="text-sm text-gray-500">
                            Up to ₦{(loan.max / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {loan.rate}%
                        </p>
                        <p className="text-xs text-gray-500">per annum</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="card bg-white shadow-md border">
            <div className="card-body">
              <h2 className="card-title mb-4">Eligibility Criteria</h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold">Age Requirement</p>
                    <p className="text-sm text-gray-600">
                      Must be 21-65 years old
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold">Active Account</p>
                    <p className="text-sm text-gray-600">
                      Must have an active Softbank account
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold">Credit Score</p>
                    <p className="text-sm text-gray-600">
                      Good credit history preferred
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <div>
                    <p className="font-semibold">Income Proof</p>
                    <p className="text-sm text-gray-600">
                      Regular source of income required
                    </p>
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <h3 className="font-semibold mb-3">Important Notes</h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside">
                <li>Processing time: 1-3 business days</li>
                <li>Early repayment allowed with no charges</li>
                <li>Late payment penalties apply</li>
                <li>Loan amount credited directly to your account</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Loans;
