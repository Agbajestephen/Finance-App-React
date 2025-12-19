import Login from './pages/Login.jsx';
import SignUp from './pages/SignUp.jsx';
import ThemeToggle from './component/ThemeToggle.jsx';


function App() {
  return (
    <Router>
      {/* A simple navigation bar for demonstration */}
      {/* <nav className="navbar bg-base-300 justify-center px-4">
        <div className="flex space-x-4">
          <Link to="/" className="btn btn-ghost">Welcome</Link>
          <Link to="/login" className="btn btn-ghost">Login</Link>
          <Link to="/signup" className="btn btn-ghost">Sign Up</Link>
        </div>
      </nav> */}
      <div>
        <ThemeToggle />
      </div>

      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
      </Routes>
    </Router>
  );
}

export default App;