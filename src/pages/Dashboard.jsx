function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-gray-800">
        <h1 className="text-xl font-bold">Softbank</h1>
        <button className="bg-gray-700 px-3 py-1 rounded">Toggle Theme</button>
      </header>

      {/* Sidebar + Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-4">
          <ul>
            <li>Dashboard</li>
            <li>Transactions</li>
            <li>Accounts</li>
            {/* ... */}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard Overview</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="stat bg-primary/10 rounded-lg p-4">
              <div className="stat-title">Total Balance</div>
              <div className="stat-value">$45,678</div>
            </div>
            <div className="stat bg-success/10 rounded-lg p-4">
              <div className="stat-title">This Month</div>
              <div className="stat-value">+$2,345</div>
            </div>
            <div className="stat bg-warning/10 rounded-lg p-4">
              <div className="stat-title">Pending</div>
              <div className="stat-value">$1,234</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;