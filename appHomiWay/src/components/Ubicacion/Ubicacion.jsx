import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import UbicacionService from '../../services/UbicacionService';

export function GetUbicacion() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    UbicacionService.getUbicacionById(id)
      .then((res) => {
        setData(res.data);
        setError('');
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener ubicación');
        setLoaded(false);
      });
  }, [id]);

  if (!loaded) return <p>Cargando ubicación...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{data.nombre}</h1>
      <p><strong>Provincia:</strong> {data.provincia || 'No disponible'}</p>
      <p><strong>Cantón:</strong> {data.canton || 'No disponible'}</p>
      <p><strong>Distrito:</strong> {data.distrito || 'No disponible'}</p>
      <p><strong>Referencias:</strong> {data.detalles || 'Sin detalles adicionales'}</p>
    </div>
  );
}