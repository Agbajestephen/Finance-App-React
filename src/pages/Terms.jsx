import React from "react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="max-w-3xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>

        <p className="text-gray-600 mb-4">
          By creating an account on Softbank, you agree to the following terms.
        </p>

        <ul className="list-disc pl-5 space-y-3 text-gray-700">
          <li>You are responsible for all activities on your account.</li>
          <li>All transactions are final and cannot be reversed.</li>
          <li>Softbank is not responsible for losses caused by user error.</li>
          <li>Your personal data is stored securely.</li>
          <li>Fraudulent activity may result in account suspension.</li>
        </ul>

        <p className="text-gray-500 text-sm mt-6">
          These terms may be updated at any time.
        </p>
      </div>
    </div>
  );
}
