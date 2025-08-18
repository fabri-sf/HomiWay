// File: src/components/Rental/CreateMovieRental.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';

// Export nombrado para que coincida con tu import en main.jsx
export function CreateMovieRental() {
  const navigate = useNavigate();
  const { cart, getTotal, cleanCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Aquí llamarías a tu servicio de Rental (ajusta según tu API)
      // await RentalService.createRental({ items: cart });
      cleanCart();
      navigate('/rental/graph', { replace: true });
    } catch (err) {
      setError(err.message || 'Error al crear el alquiler');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Crear nuevo alquiler</h2>
      <p>Total: &cent;{getTotal(cart)}</p>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button
        onClick={handleSubmit}
        disabled={loading || cart.length === 0}
        className="btn btn-primary"
      >
        {loading ? 'Procesando...' : 'Confirmar alquiler'}
      </button>
    </div>
  );
}