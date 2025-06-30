import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ServicioService from '../../services/ServicioService';
import { ListServicios } from '../Servicios/ListServicios';

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
      <p><strong>Descripción:</strong> {servicio.descripcion || '—'}</p>
    </div>

    {data && (
  <>
    <h1>{data.nombre}</h1>
    {data.imagenes?.length > 0 && (
      <img
        src={`${BASE_URL}/${data.imagenes[0].url}`}
        alt={data.nombre}
        style={{ maxWidth: '100%', height: 'auto', borderRadius: 8 }}
      />
    )}

    <p><strong>Ubicación:</strong> {data.ubicacion?.nombre || 'No disponible'}</p>
    <p><strong>Precio:</strong> ₡{data.precio}</p>
    <p><strong>Descripción:</strong> {data.descripcion}</p>

    {/* */}
    <ListServicios alojamientoId={data.id} />
  </>
)}
}