"use client";

import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useBanking } from "../contexts/BankingContext";
import toast from "react-hot-toast";
import { useState } from "react";
import {
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  Settings,
  LogOut,
  PieChart,
} from "lucide-react";
import ThemeToggle from "../components/ThemeToggle.jsx";

export default function DashboardLayout() {
  const { currentUser, logout } = useAuth();
  const { accounts, getAllUserTransactions } = useBanking();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", path: "/dashboard" },
    { id: "transactions", label: "Transactions", path: "/transactions" },
    { id: "accounts", label: "Accounts", path: "/accounts" },
    { id: "profile", label: "Profile", path: "/profile" },
    { id: "history", label: "History", path: "/history" },
    { id: "loans", label: "Loans", path: "/loans" },
    { id: "services", label: "Services", path: "/services" },
    {
      id: "currency-converter",
      label: "Currency Converter",
      path: "/currency-converter",
    },
    { id: "privileges", label: "My Privileges", path: "/privileges" },
  ];

  const getPageTitle = () => {
    const currentPath = location.pathname;
    const currentItem = menuItems.find((item) => item.path === currentPath);
    return currentItem ? currentItem.label : "Overview";
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setShowSearchResults(false);
      return;
    }

    const query = searchQuery.toLowerCase();
    const transactions = getAllUserTransactions();

    const matchingTransactions = transactions.filter(
      (t) =>
        t.description.toLowerCase().includes(query) ||
        t.fromAccount.toLowerCase().includes(query) ||
        t.toAccount.toLowerCase().includes(query) ||
        t.type.toLowerCase().includes(query) ||
        t.amount.toString().includes(query),
    );

    const matchingAccounts = accounts.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.accountNumber.toLowerCase().includes(query) ||
        a.type.toLowerCase().includes(query),
    );

    setSearchResults({
      transactions: matchingTransactions.slice(0, 5),
      accounts: matchingAccounts,
    });
    setShowSearchResults(true);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setShowSearchResults(false);
    }
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  const recentTransactions = getAllUserTransactions().slice(0, 2);

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
                <div className="hidden md:flex items-center ml-6">
                  <div className="w-px h-6 bg-base-300 mr-6"></div>
                  <div className="text-sm font-medium text-base-content/70">
                    {getPageTitle()}
                  </div>
                </div>
              </div>
            </div>

            {/* Center Section - Search */}
            <div className="hidden lg:flex flex-1 max-w-xl mx-4 relative">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-base-content/50" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search transactions, accounts, amounts..."
                    className="input input-bordered w-full pl-10 pr-4 py-2 rounded-xl"
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={() => searchQuery && setShowSearchResults(true)}
                  />
                </div>
              </form>

              {showSearchResults && (
                <div className="absolute top-full mt-2 w-full bg-base-100 shadow-2xl rounded-xl border p-4 max-h-96 overflow-y-auto z-50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Search Results</h3>
                    <button
                      onClick={() => setShowSearchResults(false)}
                      className="btn btn-ghost btn-xs btn-circle"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {searchResults.accounts?.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-semibold text-base-content/50 uppercase mb-2">
                        Accounts
                      </h4>
                      {searchResults.accounts.map((acc) => (
                        <Link
                          key={acc.id}
                          to="/accounts"
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{acc.name}</p>
                            <p className="text-xs text-base-content/60">
                              {acc.accountNumber}
                            </p>
                          </div>
                          <p className="font-bold">
                            ₦{acc.balance.toLocaleString()}
                          </p>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.transactions?.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-base-content/50 uppercase mb-2">
                        Transactions
                      </h4>
                      {searchResults.transactions.map((txn) => (
                        <Link
                          key={txn.id}
                          to="/history"
                          onClick={() => setShowSearchResults(false)}
                          className="flex items-center justify-between p-3 hover:bg-base-200 rounded-lg"
                        >
                          <div>
                            <p className="font-medium text-sm">
                              {txn.description}
                            </p>
                            <p className="text-xs text-base-content/60">
                              {txn.fromAccount} → {txn.toAccount}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-sm">
                              ₦{txn.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-base-content/60">
                              {new Date(txn.date).toLocaleDateString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  {searchResults.accounts?.length === 0 &&
                    searchResults.transactions?.length === 0 && (
                      <p className="text-center text-base-content/60 py-4">
                        No results found for "{searchQuery}"
                      </p>
                    )}
                </div>
              )}
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
                      <p className="text-xs text-base-content/60">
                        From Barrio • $5,756
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-base-200">
                      <p className="text-sm font-medium">Card Update</p>
                      <p className="text-xs text-base-content/60">
                        VISA CTRM 12/22 updated
                      </p>
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
                  {currentUser?.photoURL ? (
                    <img
                      src={currentUser.photoURL || "/placeholder.svg"}
                      alt={currentUser.displayName || currentUser.email}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                      <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {(currentUser?.displayName ||
                            currentUser?.email)?.[0]?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold">
                      {currentUser?.displayName || currentUser?.email}
                    </p>
                    <p className="text-xs text-base-content/60">
                      Premium Account
                    </p>
                  </div>
                  <ChevronDown size={16} className="hidden md:block" />
                </button>

                <ul
                  className={`dropdown-content menu p-3 shadow-2xl bg-base-100 rounded-box w-64 mt-2 ${
                    isProfileOpen ? "block" : "hidden"
                  }`}
                >
                  <div className="p-3 mb-2 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10">
                    <div className="flex items-center gap-3">
                      {currentUser?.photoURL ? (
                        <img
                          src={currentUser.photoURL || "/placeholder.svg"}
                          alt={currentUser.displayName || currentUser.email}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary p-0.5">
                          <div className="w-full h-full rounded-full bg-base-100 flex items-center justify-center">
                            <span className="text-primary font-semibold text-lg">
                              {(currentUser?.displayName ||
                                currentUser?.email)?.[0]?.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold">
                          {currentUser?.displayName ||
                            currentUser?.email?.split("@")[0]}
                        </h4>
                        <p className="text-sm text-base-content/60">
                          {currentUser?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <li>
                    <Link
                      to="/setting"
                      className="flex items-center gap-3 py-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center">
                        <Settings size={16} />
                      </div>
                      <div>
                        <span className="font-medium">Settings</span>
                        <p className="text-xs text-base-content/60">
                          Preferences & privacy
                        </p>
                      </div>
                    </Link>
                  </li>

                  <li>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 py-3 text-error w-full"
                    >
                      <div className="w-8 h-8 rounded-lg bg-error/10 flex items-center justify-center">
                        <LogOut size={16} />
                      </div>
                      <span className="font-medium">Logout</span>
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* SIDEBAR */}
        <aside
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
            border-r
            flex flex-col
          `}
        >
          {/* Sidebar Content */}
          <div className="p-4 flex-1">
            {/* Quick Stats */}
            <div className="mb-6 p-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Total Balance</span>
                <PieChart size={16} className="text-primary" />
              </div>
              <div className="text-2xl font-bold">
                ₦{totalBalance.toLocaleString()}
              </div>
              <div className="text-xs text-base-content/60 mt-1">
                Across {accounts.length} accounts
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Main Menu
              </div>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center gap-3 p-3 rounded-xl transition-all group ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                        : "hover:bg-base-300 hover:shadow"
                    }`}
                  >
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Divider */}
            <div className="my-6 border-t"></div>

            {/* Recent Activity */}
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-base-content/50 uppercase tracking-wider">
                Recent Activity
              </div>
              <div className="space-y-3">
                {recentTransactions.length === 0 ? (
                  <div className="p-3 rounded-lg bg-base-100 text-center">
                    <p className="text-xs text-base-content/60">
                      No recent activity
                    </p>
                  </div>
                ) : (
                  recentTransactions.map((txn) => (
                    <div key={txn.id} className="p-3 rounded-lg bg-base-100">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">
                          {txn.description}
                        </span>
                        <span
                          className={`text-sm font-bold ${
                            txn.type === "deposit"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {txn.type === "deposit" ? "+" : "-"}₦
                          {txn.amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="text-xs text-base-content/60">
                        {txn.fromAccount} → {txn.toAccount}
                      </div>
                      <div className="text-xs text-base-content/60 mt-1">
                        {new Date(txn.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link
              to="/setting"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-base-300 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-base-300 flex items-center justify-center">
                <Settings size={16} />
              </div>
              <div>
                <span className="font-medium">Settings</span>
                <p className="text-xs text-base-content/60">App preferences</p>
              </div>
            </Link>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-4 lg:p-6 bg-base-100 text-base-content overflow-auto">
          <Outlet />
        </main>
      </div>

      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
