import React from 'react';  
import DashboardLayout from '../components/DashboardLayout';
function Loans() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-4">Loans</h1>
      <div className="alert alert-info">
        <div>
          <span>No active loans at the moment.</span>
        </div>
      </div>
      <button className="btn btn-primary mt-4">Apply for Loan</button>
    </DashboardLayout>
  );
}

export default Loans;