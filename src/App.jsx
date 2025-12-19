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

          {/* Dashboard */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="investment" element={<Investment />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="credit-cards" element={<CreditCards />} />
            <Route path="loans" element={<Loans />} />
            <Route path="services" element={<Services />} />
            <Route path="my-privileges" element={<MyPrivileges />} />
            <Route path="setting" element={<Setting />} />
          </Route>
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

{
  /* A simple navigation bar for demonstration */
}
{
  /* <nav className="navbar bg-base-300 justify-center px-4">
        <div className="flex space-x-4">
          <Link to="/" className="btn btn-ghost">Welcome</Link>
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/signup" className="btn btn-ghost">Sign Up</Link>
        </div>
      </nav> */
}
