import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { FaGoogle, FaGithub, FaEnvelope, FaLock } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

// function Login() {
//   const [showPassword, setShowPassword] = useState(false);
//   const [usePhone, setUsePhone] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [formData, setFormData] = useState({ 
//     email: '', 
//     phone: '', 
//     password: '' 
//   });
//   const [validationErrors, setValidationErrors] = useState({});
//   const [logoutMessage, setLogoutMessage] = useState('');
  
//   const { login, loginLoading, error, autoLogin } = useAuth();
//   const navigate = useNavigate();
//   const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card bg-white shadow-2xl">
          <div className="card-body">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
              <p className="text-gray-600 mt-2">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Email</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="input input-bordered w-full pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Password</span>
                  <Link to="/forgot-password" className="label-text-alt link link-primary">
                    Forgot password?
                  </Link>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="input input-bordered w-full pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
    
//     // Clear validation error for this field
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleForgotPassword = () => {
//     navigate('/forgot-password', { 
//       state: { email: formData.email } 
//     });
//   };

//   return (
//     <div className="min-h-[calc(100vh-200px)] flex items-center justify-center p-4">
//       <div className="card bg-base-100 shadow-xl w-full max-w-md">
//         <div className="card-body">
//           {/* Logout message */}
//           {logoutMessage && (
//             <div className="alert alert-info mb-4">
//               <CheckCircle className="h-5 w-5" />
//               <span>{logoutMessage}</span>
//             </div>
//           )}
          
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-2 bg-primary/10 rounded-lg">
//               <LogIn className="h-6 w-6 text-primary" />
//             </div>
//             <h2 className="card-title text-2xl">Secure Sign In</h2>
//           </div>
          
//           {/* Error display */}
//           {error && (
//             <div className="alert alert-error mb-4">
//               <AlertCircle className="h-5 w-5" />
//               <span>{error}</span>
//             </div>
//           )}
          
//           {/* Login method toggle */}
//           <div className="tabs tabs-boxed mb-6">
//             <button
//               className={`tab flex-1 ${!usePhone ? 'tab-active' : ''}`}
//               onClick={() => setUsePhone(false)}
//             >
//               <Mail className="h-4 w-4 mr-2" />
//               Email
//             </button>
//             <button
//               className={`tab flex-1 ${usePhone ? 'tab-active' : ''}`}
//               onClick={() => setUsePhone(true)}
//             >
//               <Smartphone className="h-4 w-4 mr-2" />
//               Phone
//             </button>
//           </div>
          
//           <form onSubmit={handleSubmit}>
//             {/* Email/Phone field */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text font-medium">
//                   {usePhone ? 'Phone Number' : 'Email Address'}
//                 </span>
//               </label>
//               <input
//                 type={usePhone ? "tel" : "email"}
//                 name={usePhone ? "phone" : "email"}
//                 placeholder={usePhone ? "+1 (555) 123-4567" : "you@example.com"}
//                 className={`input input-bordered ${validationErrors.email || validationErrors.phone ? 'input-error' : ''}`}
//                 value={usePhone ? formData.phone : formData.email}
//                 onChange={handleChange}
//                 required
//               />
//               {(validationErrors.email || validationErrors.phone) && (
//                 <label className="label">
//                   <span className="label-text-alt text-error">
//                     {validationErrors.email || validationErrors.phone}
//                   </span>
//                 </label>
//               )}
//             </div>
            
//             {/* Password field */}
//             <div className="form-control mb-4">
//               <label className="label">
//                 <span className="label-text font-medium">Password</span>
//               </label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? "text" : "password"}
//                   name="password"
//                   placeholder="••••••••"
//                   className={`input input-bordered w-full ${validationErrors.password ? 'input-error' : ''}`}
//                   value={formData.password}
//                   onChange={handleChange}
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                   onClick={() => setShowPassword(!showPassword)}
//                   aria-label={showPassword ? "Hide password" : "Show password"}
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {validationErrors.password && (
//                 <label className="label">
//                   <span className="label-text-alt text-error">
//                     {validationErrors.password}
//                   </span>
//                 </label>
//               )}
//             </div>
            
//             {/* Remember me & Forgot password */}
//             <div className="flex items-center justify-between mb-6">
//               <label className="cursor-pointer label">
//                 <div className="flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     className="checkbox checkbox-sm"
//                     checked={rememberMe}
//                     onChange={(e) => setRememberMe(e.target.checked)}
//                   />
//                   <span className="label-text">Remember me</span>
//                 </div>
//               </label>
              
//               <button
//                 type="button"
//                 onClick={handleForgotPassword}
//                 className="text-sm link link-primary"
//               >
//                 Forgot password?
//               </button>
//             </div>
            
//             {/* Submit button */}
//             <div className="form-control mb-4">
//               <button 
//                 type="submit" 
//                 className={`btn btn-primary ${loginLoading ? 'loading' : ''}`}
//                 disabled={loginLoading}
//               >
//                 {loginLoading ? 'Signing in...' : 'Sign In'}
//               </button>
//             </div>
//           </form>
          
//           <div className="divider my-6">OR</div>
          
//           <div className="text-center">
//             <p className="mb-4">Don't have an account?</p>
//             <Link to="/signup" className="btn btn-outline btn-primary w-full">
//               Create Secure Account
//             </Link>
//           </div>
          
//           {/* Security notice */}
//           <div className="mt-8 p-4 bg-base-200 rounded-lg">
//             <div className="flex items-start gap-3">
//               <Lock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
//               <div>
//                 <p className="text-sm font-medium mb-1">Security Notice</p>
//                 <p className="text-xs text-base-content/70">
//                   Your session will automatically expire after 15 minutes of inactivity. 
//                   Never share your login credentials with anyone.
//                 </p>
//               </div>
//             </div>
//           </div>
          
//           {/* Session info */}
//           <div className="mt-4 text-center">
//             <p className="text-xs text-base-content/50">
//               Auto-logout: 15 minutes • Secure connection • Encrypted storage
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;