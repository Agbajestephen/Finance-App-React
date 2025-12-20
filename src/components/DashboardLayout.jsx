import React, { useState } from "react";
import { Search, Bell, User, Menu, X } from "lucide-react";
import { Outlet, Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle.jsx";
function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const menuItems = [
    { id: 'credit-cards', label: 'Credit Cards', icon: '💳', path: '/credit-cards' },
    { id: 'loans', label: 'Loans', icon: '💰', path: '/loans' },
    { id: 'services', label: 'Services', icon: '⚙️', path: '/services' },
    { id: 'privileges', label: 'My Privileges', icon: '👑', path: '/privileges' },
    { id: 'setting', label: 'Setting', icon: '⚙️', path: '/setting' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Top Navigation Bar */}
      <div className="navbar bg-base-100 shadow-sm border-b sticky top-0 z-50">
        <div className="navbar-start">
          {/* Mobile Menu Toggle */}
          <button 
            className="btn btn-ghost btn-circle lg:hidden"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 ml-2">
            <div className="text-2xl font-bold text-primary">softbank</div>
            <div className="hidden md:block text-lg font-semibold text-base-content">
              Overview
            </div>
          </div>
        </div>

        <div className="navbar-center hidden md:flex">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="form-control">
            <div className="input-group">
              <input
                type="text"
                placeholder="searchforsomething..."
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
          {/* Mobile Search Button */}
          <button className="btn btn-ghost btn-circle md:hidden">
            <Search size={20} />
          </button>
          
          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Bell size={20} />
                <span className="badge badge-xs badge-primary indicator-item"></span>
              </div>
            </button>
          </div>
          
          {/* User Profile */}
          <div className="dropdown dropdown-end">
            <button className="btn btn-ghost btn-circle avatar">
              <div className="w-8 rounded-full">
                <User size={20} />
              </div>
            </button>
            <ul className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><Link to="/setting">Profile</Link></li>
              <li><Link to="/setting">Settings</Link></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar Menu */}
        <div className={`
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0
          fixed lg:static 
          inset-y-0 left-0 
          w-64 
          bg-base-200 
          transition-transform duration-300 ease-in-out 
          z-40
          h-[calc(100vh-64px)]
          overflow-y-auto
        `}>
          <div className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.id}
                  to={item.path}
                  className={`
                    flex items-center gap-3 p-3 rounded-lg transition-all
                    hover:bg-base-300
                  `}
                >
                  <div className="text-lg">{item.icon}</div>
                  <span className="font-medium text-base-content">
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
            
            {/* Stats/Info Section */}
            <div className="mt-8 p-4 bg-base-100 rounded-lg">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Active Items</div>
                  <div className="stat-value text-primary">
                    {menuItems.length}
                  </div>
                  <div className="stat-desc">Total menu items</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 p-6">
          {/* Content from child pages goes here */}
          <Outlet />
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
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