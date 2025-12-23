"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useBanking } from "../contexts/BankingContext"
import toast from "react-hot-toast"
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaCalendar, FaEdit, FaCheckCircle } from "react-icons/fa"

export default function Profile() {
  const { currentUser } = useAuth()
  const { accounts, getAllUserTransactions } = useBanking()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)

  const [profile, setProfile] = useState({
    displayName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    accountType: "standard",
    joinDate: "",
  })

  useEffect(() => {
    if (!currentUser) return

    // Load profile from localStorage
    const savedProfile = localStorage.getItem(`user_profile_${currentUser.uid}`)

    if (savedProfile) {
      setProfile(JSON.parse(savedProfile))
    } else {
      // Initialize with Firebase data
      setProfile({
        displayName: currentUser.displayName || "",
        email: currentUser.email || "",
        phone: "",
        address: "",
        dateOfBirth: "",
        accountType: "standard",
        joinDate: currentUser.metadata?.creationTime || new Date().toISOString(),
      })
    }
  }, [currentUser])

  const handleSave = () => {
    setLoading(true)

    try {
      localStorage.setItem(`user_profile_${currentUser.uid}`, JSON.stringify(profile))
      toast.success("Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0)
  const allTransactions = getAllUserTransactions()
  const totalIncome = allTransactions.filter((tx) => tx.type === "deposit").reduce((sum, tx) => sum + tx.amount, 0)
  const totalExpenses = allTransactions.filter((tx) => tx.type === "withdrawal").reduce((sum, tx) => sum + tx.amount, 0)

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-lg">Please log in to view your profile.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="btn btn-primary gap-2">
            <FaEdit /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => setIsEditing(false)} className="btn btn-ghost">
              Cancel
            </button>
            <button onClick={handleSave} className="btn btn-success gap-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : <FaCheckCircle />}
              Save Changes
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
              <div className="avatar mb-4">
                <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL || "/placeholder.svg"} alt={profile.displayName} />
                  ) : (
                    <div className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-5xl text-white font-bold">
                        {(profile.displayName || "U")[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <h2 className="card-title text-2xl">{profile.displayName || "User"}</h2>
              <div className="badge badge-primary badge-lg capitalize">{profile.accountType} Account</div>

              <div className="divider"></div>

              <div className="w-full space-y-3 text-left">
                <div className="flex items-center gap-3">
                  <FaEnvelope className="text-gray-500" />
                  <span className="text-sm">{profile.email}</span>
                </div>

                {profile.phone && (
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-gray-500" />
                    <span className="text-sm">{profile.phone}</span>
                  </div>
                )}

                {profile.address && (
                  <div className="flex items-center gap-3">
                    <FaMapMarkerAlt className="text-gray-500" />
                    <span className="text-sm">{profile.address}</span>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <FaCalendar className="text-gray-500" />
                  <span className="text-sm">Joined {new Date(profile.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Account Statistics */}
          <div className="card bg-base-100 shadow-xl mt-6">
            <div className="card-body">
              <h3 className="card-title text-lg mb-4">Account Statistics</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500">Total Accounts</div>
                  <div className="text-2xl font-bold">{accounts.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Total Transactions</div>
                  <div className="text-2xl font-bold">{allTransactions.length}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Member Since</div>
                  <div className="font-semibold">
                    {new Date(profile.joinDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Details & Accounts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-xl mb-4">Personal Information</h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Full Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={profile.displayName}
                      onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Address</span>
                    </label>
                    <textarea
                      className="textarea textarea-bordered"
                      value={profile.address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      placeholder="Your full address"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Date of Birth</span>
                    </label>
                    <input
                      type="date"
                      className="input input-bordered"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">Account Type</span>
                    </label>
                    <select
                      className="select select-bordered"
                      value={profile.accountType}
                      onChange={(e) => setProfile({ ...profile, accountType: e.target.value })}
                    >
                      <option value="standard">Standard</option>
                      <option value="premium">Premium</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Full Name</div>
                    <div className="font-semibold">{profile.displayName || "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Email</div>
                    <div className="font-semibold">{profile.email}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Phone</div>
                    <div className="font-semibold">{profile.phone || "Not set"}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Date of Birth</div>
                    <div className="font-semibold">
                      {profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "Not set"}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <div className="text-sm text-gray-500 mb-1">Address</div>
                    <div className="font-semibold">{profile.address || "Not set"}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Overview */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-xl mb-4">Financial Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="stat bg-primary/10 rounded-lg">
                  <div className="stat-title">Total Balance</div>
                  <div className="stat-value text-primary">₦{totalBalance.toLocaleString()}</div>
                </div>
                <div className="stat bg-success/10 rounded-lg">
                  <div className="stat-title">Total Income</div>
                  <div className="stat-value text-success text-2xl">₦{totalIncome.toLocaleString()}</div>
                </div>
                <div className="stat bg-error/10 rounded-lg">
                  <div className="stat-title">Total Expenses</div>
                  <div className="stat-value text-error text-2xl">₦{totalExpenses.toLocaleString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Linked Accounts */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-xl mb-4">Linked Bank Accounts</h3>
              <div className="space-y-3">
                {accounts.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No accounts linked yet</p>
                ) : (
                  accounts.map((account) => (
                    <div key={account.id} className="flex justify-between items-center p-4 bg-base-200 rounded-lg">
                      <div>
                        <div className="font-semibold">{account.name}</div>
                        <div className="text-sm text-gray-500">{account.accountNumber}</div>
                        <div className="badge badge-sm capitalize mt-1">{account.type}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">₦{account.balance.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">
                          Created {new Date(account.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-xl mb-4">Recent Transactions</h3>
              <div className="space-y-2">
                {allTransactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                    <div>
                      <div className="font-semibold capitalize">{tx.type}</div>
                      <div className="text-sm text-gray-500">{tx.description}</div>
                      <div className="text-xs text-gray-400">{new Date(tx.date).toLocaleDateString()}</div>
                    </div>
                    <div className={`font-bold ${tx.type === "deposit" ? "text-success" : "text-error"}`}>
                      {tx.type === "deposit" ? "+" : "-"}₦{tx.amount.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
