import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AlojamientoService from '../../services/AlojamientoService';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { ListServicios } from '../Servicios/ListServicio';
import Resena from '../Resena/Resena';;


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
        setLoaded(true);
        setError('');
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener alojamiento');
        setLoaded(false);
      });
  }, [id]);

  if (!loaded) return <p style={{ padding: '2rem' }}>Cargando alojamiento...</p>;
  if (error) return <p style={{ padding: '2rem' }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <h1 style={{ marginBottom: '1rem' }}>{data.Nombre}</h1>

      {Array.isArray(data.imagenes) && data.imagenes.length > 0 ? (
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '1rem',
            marginBottom: '2rem',
            scrollSnapType: 'x mandatory',
          }}
        >
          {data.imagenes.map((img, i) => (
            <img
              key={i}
              src={`${BASE_URL}/${img.url}`}
              alt={`Imagen ${i + 1}`}
              style={{
                height: 240,
                borderRadius: 8,
                scrollSnapAlign: 'start',
                flexShrink: 0,
              }}
            />
          ))}
        </div>
      ) : (
        <p><em>No hay imágenes disponibles para este alojamiento.</em></p>
      )}

      <div style={{ lineHeight: 1.8 }}>
        <p><strong>Precio por noche:</strong> ₡{data.PrecioNoche}</p>
        <p><strong>Capacidad:</strong> {data.Capacidad} personas</p>
        <p><strong>Categoría:</strong> {data.Categoria || '—'}</p>
        <p><strong>Características:</strong> {data.Caracteristicas || '—'}</p>
        <p><strong>Ubicación:</strong> {data.ubicacion
          ? `${data.ubicacion.Direccion}, ${data.ubicacion.Distrito}, ${data.ubicacion.Canton}, ${data.ubicacion.Provincia}`
          : 'No disponible'}
        </p>
        <p><strong>Código Postal:</strong> {data.ubicacion?.CodigoPostal || '—'}</p>
        <p><strong>Descripción:</strong></p>
        <p style={{ textAlign: 'justify' }}>{data.Descripcion}</p>

      </div>
          
        <hr style={{ margin: '2rem 0' }} />
        <ListServicios alojamientoId={parseInt(data.ID)} />

        <Resena alojamientoId={parseInt(data.ID)} />
    </div>

    
  );
}