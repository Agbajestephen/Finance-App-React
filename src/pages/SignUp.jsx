import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import toast from "react-hot-toast";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import zxcvbn from "zxcvbn";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const strength = zxcvbn(password);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!agree) {
      toast.error("You must accept the terms & conditions");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      await signup(email, password, name);

      toast.success("Account created! Verify your email.");
      navigate("/verify-email");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="card bg-white shadow-xl">
          <div className="card-body p-8">
            <h2 className="text-3xl font-bold text-center mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Secure banking starts here
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <Input
                icon={<FaUser />}
                placeholder="Full Name"
                value={name}
                onChange={setName}
              />

              {/* Email */}
              <Input
                icon={<FaEnvelope />}
                type="email"
                placeholder="Email"
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
                showPassword={showPassword}
                onTogglePassword={() => setShowPassword(!showPassword)}
              />

              {/* Strength Meter */}
              <div>
                <div className="h-2 w-full bg-gray-200 rounded">
                  <div
                    className={`h-2 rounded transition-all ${
                      [
                        "w-1/4 bg-red-500",
                        "w-2/4 bg-yellow-500",
                        "w-3/4 bg-blue-500",
                        "w-full bg-green-500",
                      ][strength.score]
                    }`}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Strength:{" "}
                  {
                    ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][
                      strength.score
                    ]
                  }
                </p>
              </div>

              {/* Confirm Password */}
              <Input
                icon={<FaLock />}
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={setConfirmPassword}
                showPassword={showConfirmPassword}
                onTogglePassword={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              />

              {/* Terms */}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={agree}
                  onChange={() => setAgree(!agree)}
                />
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="text-primary font-semibold hover:underline"
                >
                  Terms & Conditions
                </Link>
              </label>

              <button
                type="submit"
                className="btn btn-primary w-full mt-4"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Create Account"
                )}
              </button>
            </form>

            <p className="text-center text-sm mt-4">
              Already have an account?{" "}
              <Link to="/login" className="text-primary font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* Reusable Input Component */
function Input({
  icon,
  type = "text",
  placeholder,
  value,
  onChange,
  showPassword,
  onTogglePassword,
}) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>
      <input
        type={
          showPassword !== undefined
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        placeholder={placeholder}
        className={`input input-bordered w-full pl-10 ${onTogglePassword ? "pr-10" : ""}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
      />
      {onTogglePassword && (
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          onClick={onTogglePassword}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
}
