import { useAuth } from "../contexts/AuthContext";

export default function VerifyEmail() {
  const { currentUser, resendEmailVerification } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-xl p-8 text-center max-w-md w-full">
        <h2 className="text-2xl font-bold mb-3">Verify your email</h2>

        <p className="text-gray-600 mb-4">
          A verification link has been sent to:
        </p>

        <p className="font-semibold mb-6">
          {currentUser?.email}
        </p>

        <button
          onClick={resendEmailVerification}
          className="btn btn-primary w-full"
        >
          Resend verification email
        </button>
      </div>
    </div>
  );
}
