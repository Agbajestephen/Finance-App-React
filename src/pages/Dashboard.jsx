function Dashboard() {
  return (
    <DashboardLayout>
      {/* Dashboard content */}
      <div>
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
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;