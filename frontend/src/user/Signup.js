// Signup.js


import React, { useState } from 'react';
import axios from 'axios';
import './FormStyles.css';  // Ensure consistent styling

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/user_authentication/signup/`, { username, password, email });
      // Redirect to login or do something upon successful signup
    } catch (error) {
      console.error("Signup failed:", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Join Us!</h2>
      <p>Create an account to get started.</p>
      <form onSubmit={handleSubmit}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
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
      <button type="submit">Signup</button>
    </form>
      <p>Already have an account? <a href="/login">Log in</a></p>
    </div>
  );
};

export default Signup;



