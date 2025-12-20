function Login() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Login logic would run here!');
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Sign In to Your Account</h1>
          <p className="py-4">Access your Soft Bank dashboard securely.</p>
        </div>
        <div className="card w-full max-w-md shadow-2xl bg-base-100">
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email or Username</span>
              </label>
              <input type="text" placeholder="you@example.com" className="input input-bordered" required />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input type="password" placeholder="••••••••" className="input input-bordered" required />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">Forgot password?</a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary">Login</button>
            </div>
            <p className="text-center mt-4">
              Don't have an account? <a href="/signup" className="link link-primary">Sign up now</a>.
            </p>
          </form>
        </div>
      </div>
    </div> 
  );
}

export default Login;