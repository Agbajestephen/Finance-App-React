import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Import AuthProvider
import { AuthProvider } from "./contexts/AuthContext";
import DashboardLayout from "./components/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { BankingProvider } from "./components/BankingContext.jsx"; // 👈 MOVE TO contexts folder

import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import Accounts from "./pages/Accounts.jsx";
import Transactions from "./pages/Transactions.jsx";
import Transfers from "./pages/Transfers.jsx";
import Profile from "./pages/Profile.jsx";
import Loans from "./pages/Loans.jsx";
import Services from "./pages/Services.jsx";
import MyPrivileges from "./pages/MyPrivileges.jsx";
import Setting from "./pages/Setting.jsx";
import Signup from "./pages/SignUp.jsx";

function App() {
  return (
    <Router>
      {/* STEP 1: Wrap everything with AuthProvider */}
      <AuthProvider>
        {/* STEP 2: Wrap with BankingProvider for local storage banking */}
        <BankingProvider>
          <Toaster position="top-right" />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* DashboardLayout - Protected */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* All these routes inside DashboardLayout are protected */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="history" element={<History />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="transfers" element={<Transfers />} /> {/* 👈 ADD THIS LINE */}
              <Route path="profile" element={<Profile />} />
              <Route path="loans" element={<Loans />} />
              <Route path="services" element={<Services />} />
              <Route path="privileges" element={<MyPrivileges />} />
              <Route path="setting" element={<Setting />} />
            </Route>
          </Routes>
        </BankingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;