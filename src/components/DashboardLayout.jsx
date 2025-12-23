import React, { useState } from "react";
import { Search, Bell, User, Menu, X, ChevronDown, Settings, LogOut, CreditCard, Wallet, PieChart } from "lucide-react";
import { Outlet, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊", path: "/dashboard" },
    { id: "transactions", label: "Transactions", icon: "💳", path: "/transactions" },
    { id: "accounts", label: "Accounts", icon: "🏦", path: "/accounts" },
    { id: "Profile", label: "Profile", icon: "📈", path: "/profile" },
    { id: "credit-cards", label: "History", icon: "💳", path: "/history" },
    { id: "loans", label: "Loans", icon: "💰", path: "/loans" },
    { id: "services", label: "Services", icon: "⚙️", path: "/services" },
    { id: "privileges", label: "My Privileges", icon: "👑", path: "/privileges" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const userProfile = {
    name: "John Doe",
    email: "john.doe@softbank.com",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 bg-base-100 border-b shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                className="btn btn-ghost btn-square lg:hidden"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                    <span className="text-white font-bold">SB</span>
                  </div>
                  <div className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Softbank
                  </div>
                </div>
                <div className="hidden md:block text-sm font-medium text-base-content/70">| Overview</div>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-4">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-base-content/50" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions, accounts, cards..."
                    className="input input-bordered w-full pl-10 pr-4 py-2 rounded-xl"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>
            </div>

        <div className="navbar-center hidden md:flex">
          <form onSubmit={handleSearch} className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="Search for something..."
                className="input input-bordered w-96"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-square">
                <Search size={20} />
              </button>
            </div>
          </form>
        </div>

        <div className="navbar-end gap-2">
          <ThemeToggle />

          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Bell size={20} />
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </div>

          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full">
                <User size={20} />
              </div>
            </button>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><NavLink to="/setting">Profile</NavLink></li>
              <li><NavLink to="/setting">Settings</NavLink></li>
              <li><a href="/login">Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* SIDEBAR */}
        <div
          className={`
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            lg:translate-x-0
            fixed lg:static 
            inset-y-0 left-0 
            w-64 
            bg-base-200 
            transition-transform duration-300 ease-in-out 
            z-40
            h-[calc(100vh-64px)]
            overflow-y-auto
          `}
        >
          <div className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isActive ? "bg-primary text-white" : "hover:bg-base-300"
                    }`
                  }
                >
                  <div className="text-lg">{item.icon}</div>
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              ))}
            </div>

            <div className="mt-8 p-4 bg-base-100 rounded-lg">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Active Items</div>
                  <div className="stat-value text-primary">{menuItems.length}</div>
                  <div className="stat-desc">Total menu items</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 bg-base-100 text-base-content">
          <Outlet />
        </main>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}

export default DashboardLayout;