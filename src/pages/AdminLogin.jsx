import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { FaUser, FaLock } from "react-icons/fa";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (email !== "admin@financeapp.com") {
      toast.error("Access denied. Only the designated admin email is allowed.");
      return;
    }

    try {
      setLoading(true);
      const userCredential = await login(email, password);

      // Check user role directly from Firestore
      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === "admin") {
          toast.success("Admin login successful!");
          navigate("/admin-dashboard");
        } else {
          toast.error("Access denied. Admin privileges required.");
        }
      } else {
        toast.error("User profile not found. Please contact support.");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
      <div className="w-full max-w-md">
        <div className="card bg-white shadow-xl">
          <div className="card-body p-8">
            <h2 className="text-3xl font-bold text-center mb-2">Admin Login</h2>
            <p className="text-center text-gray-500 mb-6">
              Secure admin access
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <Input
                icon={<FaUser />}
                type="email"
                placeholder="Admin Email"
                value={email}
                onChange={setEmail}
              />

              {/* Password */}
              <Input
                icon={<FaLock />}
                type="password"
                placeholder="Password"
                value={password}
                onChange={setPassword}
              />

              <button
                type="submit"
                className="btn btn-error w-full mt-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Login as Admin"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable Input Component */
function Input({ icon, type = "text", placeholder, value, onChange }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        className="input input-bordered w-full pl-10"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
    </div>
  );
}
