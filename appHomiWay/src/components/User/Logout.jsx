// src/components/User/Logout.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';

export function Logout() {
  const { logout } = useAuth();
  logout(); // limpia token

  return <Navigate to="/user/login" replace />;
}

export default Logout;