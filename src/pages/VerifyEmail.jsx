import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const { currentUser, resendVerification } = useAuth();
  const navigate = useNavigate();

  async function handleResend() {
    try {
      await resendVerification();
      toast.success("Verification email sent");
    } catch {
      toast.error("Failed to resend email");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Verify your email</h2>
        <p className="text-gray-600 mb-6">
          We sent a verification link to:
          <br />
          <span className="font-semibold">{currentUser?.email}</span>
        </p>

        <button
          onClick={handleResend}
          className="btn btn-primary w-full mb-4"
        >
          Resend Email
        </button>

        <button
          onClick={() => navigate("/login")}
          className="btn btn-outline w-full"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
