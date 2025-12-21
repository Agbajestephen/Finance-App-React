import React from 'react';  
import DashboardLayout from '../components/DashboardLayout';

function Investments() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Investments</h1>
      <p className="mb-4">Your investment portfolio management.</p>
      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Portfolio</div>
          <div className="stat-value">$89,123.45</div>
          <div className="stat-desc">↗︎ 12.5% this month</div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Investments;