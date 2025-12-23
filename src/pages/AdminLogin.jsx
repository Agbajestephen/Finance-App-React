"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import toast from "react-hot-toast"
import { FaShieldAlt, FaLock, FaEnvelope, FaEye, FaEyeSlash } from "react-icons/fa"

const AdminLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAdmin, isSuperAdmin } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)

      // Check if user has admin privileges
      setTimeout(() => {
        if (isAdmin() || isSuperAdmin()) {
          toast.success("Admin login successful!")
          navigate("/admin/dashboard")
        } else {
          toast.error("Access denied. Admin privileges required.")
          navigate("/login")
        }
      }, 500)
    } catch (error) {
      toast.error("Failed to login: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-4">
            <FaShieldAlt className="text-4xl text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-purple-200">Softbank Administration</p>
        </div>

        {/* Login Card */}
        <div className="card bg-base-100 shadow-2xl">
          <div className="card-body">
            <div className="alert alert-warning mb-4">
              <FaLock />
              <span className="text-sm">Restricted area. Authorized personnel only.</span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Admin Email</span>
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    placeholder="admin@softbank.com"
                    className="input input-bordered w-full pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Password</span>
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password"
                    className="input input-bordered w-full pl-10 pr-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Login as Admin"}
              </button>
            </form>

            <div className="divider">OR</div>

            <div className="text-center space-y-2">
              <Link to="/login" className="link link-primary text-sm">
                User Login
              </Link>
              <br />
              <Link to="/" className="link link-secondary text-sm">
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Admin Access Information */}
        <div className="mt-6 p-4 bg-base-100/50 rounded-lg border border-purple-500/30">
          <p className="text-sm text-center text-gray-300 mb-3 font-semibold">Admin Access Information</p>
          <div className="space-y-2 text-xs text-gray-400">
            <div className="flex items-center justify-between p-2 bg-purple-900/20 rounded">
              <span>Super Admin:</span>
              <span className="font-mono">superadmin@softbank.com</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-900/20 rounded">
              <span>Admin 1:</span>
              <span className="font-mono">admin1@softbank.com</span>
            </div>
            <div className="flex items-center justify-between p-2 bg-purple-900/20 rounded">
              <span>Admin 2:</span>
              <span className="font-mono">admin2@softbank.com</span>
            </div>
          </div>
          <p className="text-xs text-center text-gray-500 mt-3">Contact system administrator for credentials</p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
