// ForgotPassword.js

import React, { useState } from 'react';
import axios from 'axios';
import './FormStyles.css';  // Consistent styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Implement logic to handle password reset
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>
      <p>Enter your email to receive reset instructions.</p>
      <form onSubmit={handleSubmit} className="form">
        {/* Email field and submit button */}
      </form>
      <p>Remembered your password? <a href="/login">Log in</a></p>
    </div>
  );
};

export default ForgotPassword;
