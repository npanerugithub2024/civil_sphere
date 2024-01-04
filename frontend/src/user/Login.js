import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';  // Updated import
import './FormStyles.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();  // Updated hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Attempting to login");  // Debugging line
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const { data } = await axios.post('${process.env.REACT_APP_API_BASE_URL}/user_authentication/token', formData);
        console.log("Login successful, received data:", data);  // Debugging line
        login(data); // Update context with user data
        navigate('/'); // Redirect to home page
    } catch (error) {
        console.error("Login failed:", error);
    }
};


  return (
    <div className="form-container">
      <h2>Welcome Back!</h2>
      <p>Please enter your credentials to log in.</p>
      <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
      <p>New here? <a href="/signup">Sign up</a></p>
      <p><a href="/forgot-password">Forgot Password?</a></p>
    </div>
  );
};

export default Login;

