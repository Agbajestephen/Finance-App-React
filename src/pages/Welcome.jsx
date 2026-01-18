import React from "react";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center px-4">
      <div className="max-w-6xl w-full bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">
        
        {/* LEFT CONTENT */}
        <div className="p-10 md:p-14 flex flex-col justify-center">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm">
            Secure Digital Banking
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
            Welcome to <span className="text-indigo-600">Softbank</span>
          </h1>

          <p className="text-lg text-gray-600 mb-8 max-w-md">
            A smarter way to manage your money. Send, receive, save, and track your finances with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/login"
              className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl text-center hover:bg-indigo-700 transition shadow-lg"
            >
              Sign In
            </Link>

            <Link
              to="/signup"
              className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-semibold rounded-xl text-center hover:bg-indigo-50 transition shadow-lg"
            >
              Create Account
            </Link>
          </div>

          <p className="mt-6 text-sm text-gray-500">
            Trusted by thousands. Your money stays secure.
          </p>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hidden md:flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 relative">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,_white,_transparent_60%)]"></div>

          <div className="relative z-10 text-center px-8">
            <div className="text-white text-6xl font-black mb-4">
              ₦
            </div>
            <h2 className="text-white text-3xl font-bold mb-4">
              Bank Smarter
            </h2>
            <p className="text-indigo-100 max-w-sm">
              Real time transfers, savings accounts, and transaction tracking designed for modern banking.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Welcome;
