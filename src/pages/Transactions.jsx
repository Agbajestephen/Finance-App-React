import DashboardLayout from '../components/DashboardLayout';

function Transactions() {
  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2024-01-15</td>
                <td>Amazon Purchase</td>
                <td>$129.99</td>
                <td><span className="badge badge-success">Completed</span></td>
              </tr>
              {/* More rows */}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Transactions;