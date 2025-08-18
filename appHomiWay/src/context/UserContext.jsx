import React, { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

export const UserContext = createContext({
  token: null,
  userData: {},
  isAuthenticated: false,
  saveUser: () => {},
  clearUser: () => {},
});

export function UserProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userData, setUserData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]));
          setUserData(payload);
          setIsAuthenticated(true);
          console.log('User authenticated:', payload.id);
        } catch (error) {
          console.error('Token decoding error:', error);
          clearUser();
        }
      }
    };
    checkAuth();
  }, []);

  const saveUser = (newToken) => {
    try {
      localStorage.setItem("token", newToken);
      const payload = JSON.parse(atob(newToken.split('.')[1]));
      setToken(newToken);
      setUserData(payload);
      setIsAuthenticated(true);
      console.log('User logged in:', payload.id);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const clearUser = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUserData({});
    setIsAuthenticated(false);
    console.log('User logged out');
  };

  return (
    <UserContext.Provider
      value={{
        token,
        userData,
        isAuthenticated,
        saveUser,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
//yaaaaaaaaaaaaaa