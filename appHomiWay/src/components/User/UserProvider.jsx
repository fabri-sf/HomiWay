import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '../../context/UserContext';

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const saveUser = (user) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const clearUser = () => {
    setUser({});
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  const decodeToken = () => {
    if (user && typeof user === 'string') {
      try {
        return jwtDecode(user);
      } catch {
        return {};
      }
    }
    return {};
  };

  const autorize = ({ requiredRoles }) => {
    const userData = decodeToken();
    return (
      userData &&
      userData.rol &&
      requiredRoles.includes(userData.rol.Rol)
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        saveUser,
        clearUser,
        autorize,
        decodeToken,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};