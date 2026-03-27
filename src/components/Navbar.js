import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMenu, FiX, FiLogOut, FiUser, FiGrid, FiBookOpen, FiPlusCircle } from 'react-icons/fi';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M21 12c0 4.97-4.03 9-9 9S3 16.97 3 12 7.03 3 12 3s9 4.03 9 9z"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="logo-text">QuizMaster</span>
          <span className="logo-dot">Pro</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links">
          {isAuthenticated() ? (
            <>
              <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                <FiGrid size={16} /> Dashboard
              </Link>
              <Link to="/quizzes" className={`nav-link ${isActive('/quizzes') ? 'active' : ''}`}>
                <FiBookOpen size={16} /> Quizzes
              </Link>
              <Link to="/quizzes/create" className={`nav-link ${isActive('/quizzes/create') ? 'active' : ''}`}>
                <FiPlusCircle size={16} /> Create
              </Link>
              <div className="nav-user">
                <div className="nav-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                <span className="nav-username">{user?.name?.split(' ')[0]}</span>
              </div>
              <button onClick={handleLogout} className="nav-logout-btn">
                <FiLogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>Home</Link>
              <Link to="/login" className="nav-btn-outline">Login</Link>
              <Link to="/signup" className="nav-btn-solid">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {isAuthenticated() ? (
          <>
            <div className="mobile-user">
              <div className="nav-avatar large">{user?.name?.charAt(0).toUpperCase()}</div>
              <div>
                <p className="mobile-user-name">{user?.name}</p>
                <p className="mobile-user-email">{user?.email}</p>
              </div>
            </div>
            <Link to="/dashboard" className="mobile-link"><FiGrid /> Dashboard</Link>
            <Link to="/quizzes" className="mobile-link"><FiBookOpen /> Quizzes</Link>
            <Link to="/quizzes/create" className="mobile-link"><FiPlusCircle /> Create Quiz</Link>
            <button onClick={handleLogout} className="mobile-logout"><FiLogOut /> Logout</button>
          </>
        ) : (
          <>
            <Link to="/" className="mobile-link">Home</Link>
            <Link to="/login" className="mobile-link"><FiUser /> Login</Link>
            <Link to="/signup" className="mobile-link mobile-signup">Get Started Free</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;