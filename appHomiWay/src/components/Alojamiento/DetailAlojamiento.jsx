import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlojamientoService from '../../services/AlojamientoService';

export function DetailAlojamiento() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  useEffect(() => {
    AlojamientoService.getAlojamientoById(id)
      .then((res) => {
        setData(res.data);
        setError('');
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener alojamiento');
        setLoaded(false);
      });
  }, [id]);

  if (!loaded) return <p>Cargando detalle...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {data && (
        <>
          <h1>{data.nombre}</h1>
          {data.imagenes && data.imagenes.length > 0 && (
            <img
              src={`${BASE_URL}/${data.imagenes[0].image}`}
              alt={data.nombre}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
          <p>Ubicación: {data.ubicacion?.nombre || 'No disponible'}</p>
          <p>Precio: ₡{data.precio}</p>
          <p>Descripción: {data.descripcion}</p>
          {/* Puedes mostrar más datos como etiquetas, servicios, propietario, etc. */}
        </>
      )}
    </div>
  );
}
