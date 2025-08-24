// src/hooks/useAuth.js

import { useState, useEffect } from 'react';

/**
 * Decodifica el payload de un JWT (sin verificar firma).
 * @param {string} token — el JWT completo: header.payload.signature
 * @returns {object} el JSON del payload, p. ej. { id, correo, rol, iat, exp }
 */
function decodeJwtPayload(token) {
  try {
    // 1) Separa las tres partes y toma la del medio
    const [, rawPayload] = token.split('.');
    if (!rawPayload) throw new Error('Formato de JWT inválido');

    // 2) Base64URL → Base64 estándar
    const base64 = rawPayload
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      // Padding si faltara
      .padEnd(Math.ceil(rawPayload.length / 4) * 4, '=');

    // 3) atob → string UTF-8
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(char => {
          // cada byte a %XX
          const hex = char.charCodeAt(0).toString(16).padStart(2, '0');
          return `%${hex}`;
        })
        .join('')
    );

    // 4) parse JSON
    return JSON.parse(jsonPayload);
  } catch (err) {
    throw new Error(`decodeJwtPayload error: ${err.message}`);
  }
}

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('user');

    if (!token) {
      // sin token → guest
      setUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      // decodificamos el payload
      const decoded = decodeJwtPayload(token);
      // esperamos { id, correo, rol, iat, exp }
      setUser({ id: decoded.id, correo: decoded.correo, rol: decoded.rol });
      setIsAuthenticated(true);
    } catch (error) {
      console.error('[useAuth] Error al decodificar token:', error);
      setUser(null);
      setIsAuthenticated(false);
    }
  }, []);

  // Logging para depuración
  useEffect(() => {
    console.log('[useAuth] User data (decoded):', user);
    console.log('[useAuth] Is authenticated:', isAuthenticated);
  }, [user, isAuthenticated]);

  return { user, isAuthenticated };
}