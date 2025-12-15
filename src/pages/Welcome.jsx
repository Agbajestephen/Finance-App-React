function Welcome() {
  return (
    <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-5xl font-bold text-white">Welcome to Soft Bank</h1>
          <p className="py-6 text-white/90">
            Your trusted partner for modern, secure digital banking. Experience financial freedom designed for the future.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/login" className="btn btn-accent">Get Started</a>
            <a href="/signup" className="btn btn-outline btn-accent">Create Account</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;