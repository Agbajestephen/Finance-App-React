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
      {/* A simple navigation bar for demonstration */}
      {/* <nav className="navbar bg-base-300 justify-center px-4">
        <div className="flex space-x-4">
          <Link to="/" className="btn btn-ghost">Welcome</Link>
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/signup" className="btn btn-ghost">Sign Up</Link>
        </div>
      </nav> */}
      <div>
        <ThemeToggle />
      </div>

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
      </Routes>
    </Router>
  );
}

export default App;