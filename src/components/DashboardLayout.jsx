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

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3">
              {/* Mobile Search */}
              <button className="btn btn-ghost btn-circle lg:hidden">
                <Search size={20} />
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Notifications */}
              <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-circle relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border border-base-100"></span>
                </button>
                <div className="dropdown-content menu p-4 shadow-2xl bg-base-100 rounded-box w-80 mt-2">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Notifications</h3>
                    <span className="badge badge-primary badge-sm">3 new</span>
                  </div>
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-base-200">
                      <p className="text-sm font-medium">Payment Received</p>
                      <p className="text-xs text-base-content/60">From Barrio • $5,756</p>
                    </div>
                    <div className="p-3 rounded-lg bg-base-200">
                      <p className="text-sm font-medium">Card Update</p>
                      <p className="text-xs text-base-content/60">VISA CTRM 12/22 updated</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile */}
              <div className="dropdown dropdown-end">
                <button 
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-base-200 transition-colors"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                    <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">{userProfile.name}</p>
                    <p className="text-xs text-base-content/60">Premium Account</p>
                  </div>
                  <ChevronDown size={16} className="hidden md:block" />
                </button>

                <ul className={`dropdown-content menu p-3 shadow-2xl bg-base-100 rounded-box w-64 mt-2 ${isProfileOpen ? 'block' : 'hidden'}`}>
                  {/* Profile Header */}
                  <div className="p-3 mb-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                        <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center">
                          <User size={20} className="text-primary" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold">{userProfile.name}</h4>
                        <p className="text-sm text-base-content/60">{userProfile.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile Menu Items */}
                  <li>
                    <NavLink to="/profile" className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <User size={16} className="text-primary" />
                      </div>
                      <div>
                        <span className="font-medium">My Profile</span>
                        <p className="text-xs text-base-content/60">Personal information</p>
                      </div>
                    </NavLink>
                  </li>
                  
                  <li>
                    <NavLink to="/cards" className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <CreditCard size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <span className="font-medium">My Cards</span>
                        <p className="text-xs text-base-content/60">View all your cards</p>
                      </div>
                    </NavLink>
                  </li>
                  
                  <li>
                    <NavLink to="/wallet" className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                        <Wallet size={16} className="text-green-500" />
                      </div>
                      <div>
                        <span className="font-medium">Wallet</span>
                        <p className="text-xs text-base-content/60">Manage your wallet</p>
                      </div>
                    </NavLink>
                  </li>

                  <div className="divider my-2"></div>

                  {/* Settings */}
                  <li>
                    <NavLink to="/settings" className="flex items-center gap-3 py-3">
                      <div className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center">
                        <Settings size={16} />
                      </div>
                      <div>
                        <span className="font-medium">Settings</span>
                        <p className="text-xs text-base-content/60">Preferences & privacy</p>
                      </div>
                    </NavLink>
                  </li>

                  {/* Logout */}
                  <li>
                    <a href="/login" className="flex items-center gap-3 py-3 text-error">
                      <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                        <LogOut size={16} />
                      </div>
                      <span className="font-medium">Logout</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
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
            h-[calc(100vh-80px)]
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