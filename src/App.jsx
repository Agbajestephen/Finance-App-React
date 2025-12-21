import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DashboardLayout from "./components/DashboardLayout.jsx";

import Welcome from "./pages/Welcome.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Investment from "./pages/Investment.jsx";
import Accounts from "./pages/Accounts.jsx";
import Transactions from "./pages/Transactions.jsx";
import CreditCards from "./pages/CreditCards.jsx";
import Loans from "./pages/Loans.jsx";
import Services from "./pages/Services.jsx";
import MyPrivileges from "./pages/MyPrivileges.jsx";
import Setting from "./pages/Setting.jsx";
import Signup from "./pages/SignUp.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

         

          {/* DashboardLayout */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="investment" element={<Investment />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="credit-cards" element={<CreditCards />} />
            <Route path="loans" element={<Loans />} />
            <Route path="services" element={<Services />} />
            <Route path="privileges" element={<MyPrivileges />} />
            <Route path="setting" element={<Setting />} />
          </Route>
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
