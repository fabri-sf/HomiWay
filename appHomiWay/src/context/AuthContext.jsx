import React, { createContext, useState, useEffect, useContext } from 'react';

/**
 * Decodifica el payload de un JWT (sin verificar la firma)
 * @param {string} token — el JWT en formato header.payload.signature
 * @returns {object} — el objeto del payload (p. ej. { id, correo, rol, iat, exp })
 */
function decodeJwtPayload(token) {
  const [, rawPayload] = token.split('.');
  const base64 = rawPayload
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(rawPayload.length / 4) * 4, '=');
  const json = atob(base64);
  return JSON.parse(
    decodeURIComponent(
      json
        .split('')
        .map(c =>
          '%' + c.charCodeAt(0).toString(16).padStart(2, '0')
        )
        .join('')
    )
  );
}

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  loaded: false,
  login: () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Al montar, leer el token y decodificar
  useEffect(() => {
    const token = localStorage.getItem('user');
    if (token) {
      try {
        const payload = decodeJwtPayload(token);
        setUser({ id: payload.id, correo: payload.correo, rol: payload.rol });
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoaded(true);
  }, []);

  // Función para guardar token al hacer login
  const login = token => {
    localStorage.setItem('user', token);
    const payload = decodeJwtPayload(token);
    setUser({ id: payload.id, correo: payload.correo, rol: payload.rol });
    setIsAuthenticated(true);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loaded, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para consumir el AuthContext
export function useAuth() {
  return useContext(AuthContext);
}