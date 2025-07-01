import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ServicioService from '../../services/ServicioService';
import { ListServicios } from './ListServicio';

export function DetailServicio() {
  const { id } = useParams();
  const [servicio, setServicio] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ServicioService.getById(id)
      .then((res) => {
        setServicio(res.data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener el servicio');
        setLoaded(false);
      });
  }, [id]);

  if (!loaded) return <p>Cargando servicio...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h1>{servicio.nombre}</h1>
      {servicio.imagenes?.length > 0 && (
        <img
          src={`${import.meta.env.VITE_REACT_APP_BASE_URL || ''}/${servicio.imagenes[0].url}`}
          alt={servicio.nombre}
          style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
        />
      )}
      <p><strong>Ubicación:</strong> {servicio.ubicacion?.nombre || 'No disponible'}</p>
      <p><strong>Precio:</strong> ₡{servicio.precio}</p>
      <p><strong>Descripción:</strong> {servicio.descripcion || '—'}</p>
      {/* */}
      <ListServicios alojamientoId={servicio.id} />
    </div>
  );
}