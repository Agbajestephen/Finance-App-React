import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Pre-fill email if coming from login
  useState(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    const result = await forgotPassword(email);
    
    if (result.success) {
      setSubmitted(true);
    } else {
      setError(result.error || 'Failed to send reset instructions');
    }
    
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
        <div className="card bg-base-100 shadow-xl w-full max-w-md">
          <div className="card-body text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-full mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h2 className="card-title text-2xl justify-center">Check Your Email</h2>
              <p className="mt-2 text-base-content/70">
                Password reset instructions have been sent to:
              </p>
              <p className="font-medium mt-1">{email}</p>
            </div>
            
            <div className="alert alert-info mb-6">
              <p className="text-sm">
                <strong>Note:</strong> The reset link will expire in 1 hour. 
                If you don't see the email, check your spam folder.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/login')}
                className="btn btn-primary w-full"
              >
                Return to Login
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail('');
                }}
                className="btn btn-ghost w-full"
              >
                Try another email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
      <div className="card bg-base-100 shadow-xl w-full max-w-md">
        <div className="card-body">
          <button
            onClick={() => navigate(-1)}
            className="btn btn-ghost btn-sm mb-4 self-start"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <h2 className="card-title text-2xl">Reset Your Password</h2>
          </div>
          
          <p className="text-base-content/70 mb-6">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
          
          {error && (
            <div className="alert alert-error mb-6">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control">
              <button 
                type="submit" 
                className={`btn btn-primary ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </button>
            </div>
          </form>
          
          <div className="divider my-8">OR</div>
          
          <div className="text-center">
            <p className="mb-4">Remember your password?</p>
            <Link to="/login" className="btn btn-outline btn-primary w-full">
              Back to Sign In
            </Link>
          </div>
          
          <div className="mt-8 p-4 bg-base-200 rounded-lg">
            <p className="text-sm text-base-content/70">
              <strong>Security Tip:</strong> We will never ask for your password via email. 
              Only reset your password through this official page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;