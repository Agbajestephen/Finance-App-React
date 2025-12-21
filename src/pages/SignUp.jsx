
import React from 'react';
function SignUp() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('SignUp logic would run here!');
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Create a New Account</h1>
          <p className="py-4">Join Soft Bank today. It's quick and easy.</p>
        </div>
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input type="text" placeholder="John Doe" className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input type="email" placeholder="you@example.com" className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="••••••••" className="input input-bordered" required />
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Create Account</button>
            </div>
            <p className="text-center mt-4">
              Already have an account? <a href="/login" className="link link-primary">log in here</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;