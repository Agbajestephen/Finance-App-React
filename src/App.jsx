import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider } from "./contexts/AuthContext";
import { BankingProvider } from "./contexts/BankingContext";
import DashboardLayout from "./components/DashboardLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import ForgotPassword from "./pages/ForgetPassword.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import History from "./pages/History.jsx";
import Accounts from "./pages/Accounts.jsx";
import Transactions from "./pages/Transactions.jsx";
import Profile from "./pages/Profile.jsx";
import Loans from "./pages/Loans.jsx";
import Services from "./pages/Services.jsx";
import MyPrivileges from "./pages/MyPrivileges.jsx";
import Setting from "./pages/Setting.jsx";
import Signup from "./pages/SignUp.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CurrencyConverter from "./pages/CurrencyConverter.jsx";

import VerifyEmail from "./pages/VerifyEmail.jsx";
import Terms from "./pages/Terms.jsx";

function App() {
  return (
    <Router>
      <AuthProvider>
        <BankingProvider>
          <Toaster position="top-right" />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/terms" element={<Terms />} />

            {/* Admin Routes */}
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Protected Routes */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="history" element={<History />} />
              <Route path="accounts" element={<Accounts />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="profile" element={<Profile />} />
              <Route path="loans" element={<Loans />} />
              <Route path="services" element={<Services />} />
              <Route path="privileges" element={<MyPrivileges />} />
              <Route path="currency-converter" element={<CurrencyConverter />} />
              <Route path="setting" element={<Setting />} />
            </Route>
          </Routes>
        </BankingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
