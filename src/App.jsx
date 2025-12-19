import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout.jsx";
import DashboardLayout from "./components/DashboardLayout.jsx";


import Dashboard from "./pages/Dashboard.jsx";
import Investment from "./pages/Investment.jsx";
import Accounts from "./pages/Accounts.jsx";
import Transactions from "./pages/Transactions.jsx";
import CreditCards from "./pages/CreditCards.jsx";
import Loans from "./pages/Loans.jsx";
import Services from "./pages/Services.jsx";
import MyPrivileges from "./pages/MyPrivileges.jsx";
import Setting from "./pages/Setting.jsx";
import Signup from "./pages/Signup.jsx";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          {/* Public */}
          <Route path="/signup" element={<Signup />} />

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
      </Routes>
    </Router>
  );
}

export default App;