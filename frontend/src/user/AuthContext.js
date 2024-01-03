// AuthContext.js
// import React, { useState, useEffect, useRef } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    // In AuthContext.js or in a useEffect hook in your AuthProvider

    useEffect(() => {
        const rehydrateUser = async () => {
            const token = localStorage.getItem('access_token');
            const tokenType = localStorage.getItem('token_type') || 'Bearer'; // 'Bearer' as default
        
            console.log("Retrieved token:", token); // Debugging line
            if (token) {
                try {
                    const { data } = await axios.get('http://localhost:8010/user_authentication/validateToken', {
                        headers: {
                            Authorization: `${tokenType} ${token}`,
                        },
                    });
                    // Update context with user data and include token information from local storage
                    login({...data, access_token: token, token_type: tokenType});  
                    console.log("Rehydrating user with data:", data);
                } catch (error) {
                    console.error("Failed to rehydrate user:", error);
                    // Consider also removing the token and token type from local storage here
                }
            } else {
                console.log("No token found in local storage"); // Debugging line
            }
        };
        
    
    rehydrateUser();
  }, []);
  
  const login = (userData) => {
    // Assuming userData includes access_token and token_type
    localStorage.setItem('access_token', userData.access_token);
    localStorage.setItem('token_type', userData.token_type || 'Bearer'); // 'Bearer' as default

    setUser(userData);
};

    const logout = () => {
        localStorage.removeItem('access_token');  // Clear the token from storage
        setUser(null);
        };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
