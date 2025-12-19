import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout.jsx'; 
import Dashboard from './pages/Dashboard.jsx';
import Transactions from './pages/Transactions';
import Signup from './pages/Signup';
import Accounts from './pages/Accounts';
import Investments from './pages/Investments';
import CreditCards from './pages/CreditCards';
import Loans from './pages/Loans';
import Services from './pages/Services';
import MyPrivileges from './pages/MyPrivileges';
import Setting from './pages/Setting';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        
        {/* Dashboard layout routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="investments" element={<Investments />} />
          <Route path="credit-cards" element={<CreditCards />} />
          <Route path="loans" element={<Loans />} />
          <Route path="services" element={<Services />} />
          <Route path="privileges" element={<MyPrivileges />} />
          <Route path="setting" element={<Setting />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;