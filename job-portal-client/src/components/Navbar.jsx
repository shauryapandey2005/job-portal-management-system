import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null; // Don't show navbar on login/register pages

  return (
    <nav className="glass-nav">
      <div className="nav-brand">
        <h2><Link to="/">🚀 JobPortal</Link></h2>
      </div>
      <div className="nav-links">
        <Link to="/">Dashboard</Link>
        <Link to="/post-job">Post a Job</Link>
        {/* We will build this 'My Applications' page next if you want! */}
        <Link to="/applications">My Applications</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
