// Navbar.js

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../user/AuthContext';
import './Navbar.css';  // Make sure to create this CSS file in the same folder

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate(); // Initialize useNavigate hook
    // console.log("user is",user);

    const handleLogout = () => {
        logout(); // Call the logout function from your auth context
        navigate('/'); // Redirect to the homepage
    };


    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/estimationpage">Estimate</Link>
                {/* <Link to="/estimationpages">Estimates</Link> */}
            </div>
            <div className="nav-user">
                {!user && <Link to="/login">Login</Link>}
                {!user && <Link to="/signup">Signup</Link>}
                {user && (
                    <>
                        <span className="username">Hello, {user.username}</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
