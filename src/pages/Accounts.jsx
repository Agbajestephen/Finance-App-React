import React from "react";


const Accounts = () => {
  return (
    <>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Accounts</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Account Cards */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Checking Account</h2>
              <p className="text-2xl font-bold">$5,432.10</p>
              <p className="text-sm text-gray-500">Account #: ****1234</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">View Details</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Savings Account</h2>
              <p className="text-2xl font-bold">$12,345.67</p>
              <p className="text-sm text-gray-500">Account #: ****5678</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">View Details</button>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Investment Account</h2>
              <p className="text-2xl font-bold">$45,678.90</p>
              <p className="text-sm text-gray-500">Account #: ****9012</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary btn-sm">View Details</button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Management Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Account Management</h2>
            <button className="btn btn-primary">Add New Account</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>Account Name</th>
                  <th>Type</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Primary Checking</td>
                  <td>Checking</td>
                  <td>$5,432.10</td>
                  <td><span className="badge badge-success">Active</span></td>
                  <td>
                    <button className="btn btn-xs btn-outline mr-2">Edit</button>
                    <button className="btn btn-xs btn-error">Close</button>
                  </td>
                </tr>
                <tr>
                  <td>Emergency Fund</td>
                  <td>Savings</td>
                  <td>$12,345.67</td>
                  <td><span className="badge badge-success">Active</span></td>
                  <td>
                    <button className="btn btn-xs btn-outline mr-2">Edit</button>
                    <button className="btn btn-xs btn-error">Close</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Accounts;