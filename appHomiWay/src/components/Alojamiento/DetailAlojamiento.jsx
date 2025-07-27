import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import AlojamientoService from '../../services/AlojamientoService';

import { ListServicios } from '../Servicios/ListServicio';
import Resena from '../Resena/Resena';
import ResenaAlojamiento from '../Resena/ResenaAlojamiento';

import {
  Button,
  Typography,
  CircularProgress,
  Box
} from '@mui/material';

export function DetailAlojamiento() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [showAll] = useState(false); 
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

  if (!loaded) {
    return (
      <Box
        sx={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fafaf7',
          color: '#2E7D32',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#2E7D32', mb: 2 }} />
        <Typography variant="h6">Cargando datos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: '2rem' }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <h1 className="text-center mb-4">{data.Nombre}</h1>

      {Array.isArray(data.imagenes) && data.imagenes.length > 0 ? (
        <div id="carouselAlojamiento" className="carousel slide mb-4" data-bs-ride="carousel">
          <div className="carousel-indicators">
            {data.imagenes.map((_, i) => (
              <button
                key={i}
                type="button"
                data-bs-target="#carouselAlojamiento"
                data-bs-slide-to={i}
                className={i === 0 ? 'active' : ''}
                aria-current={i === 0 ? 'true' : undefined}
                aria-label={`Slide ${i + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {data.imagenes.map((img, i) => (
              <div key={i} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                <img
                  src={`${BASE_URL}/${img.url}`}
                  className="d-block w-100"
                  alt={`Imagen ${i + 1}`}
                  style={{ height: '400px', objectFit: 'cover', borderRadius: '8px' }}
                />
              </div>
            ))}
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselAlojamiento"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselAlojamiento"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Siguiente</span>
          </button>
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

      <Button
        size="small"
        component={Link}
        to={`/rental/crear`}
        sx={{
          backgroundColor: '#2e7d32',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#1b5e20' },
          marginTop: '1rem',
        }}
      >
        Reservar
      </Button>

      <Resena alojamientoId={parseInt(data.ID)} />

      <Button
        size="small"
        component={Link}
        to={`/resena/crear/${data.ID}`}
        sx={{
          backgroundColor: '#2e7d32',
          color: '#ffffff',
          '&:hover': { backgroundColor: '#1b5e20' },
          margin: '1rem',
        }}
      >
        Valorar Alojamiento
      </Button>

      <Button
      size="small"
      component={Link}
      to={`/resena/alojamiento/${data.ID}`} 
      sx={{
        backgroundColor: '#388e3c',
        color: '#ffffff',
        '&:hover': { backgroundColor: '#2e7d32' },

        margin: '1rem', 
        
      }}
    >
      Ver todas las reseñas
    </Button>

      {showAll && <ResenaAlojamiento alojamientoId={parseInt(data.ID)} />}
    </div>
  );
}