import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import Rating from '@mui/material/Rating';
import { Link } from 'react-router-dom';
import ResenaService from '../../services/ResenaService';

ListCardAlojamientos.propTypes = {
  data: PropTypes.array.isRequired,
};

export function ListCardAlojamientos({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads/';
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    data.forEach(item => {
      ResenaService.getByAlojamiento(item.id)
        .then(res => {
          const list = res.data;
          const avg = list.length
            ? +(list.reduce((sum, r) => sum + Number(r.Calificacion), 0) / list.length).toFixed(1)
            : 0;
          setRatings(prev => ({ ...prev, [item.id]: avg }));
        })
        .catch(() => {
          setRatings(prev => ({ ...prev, [item.id]: 0 }));
        });
    });
  }, [data]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        padding: 16,
      }}
    >
      {data.map((item) => {
        const tieneImagenes =
          Array.isArray(item.imagenes) && item.imagenes.length > 0;
        const idCarousel = `carousel-${item.id}`;
        const avg = ratings[item.id];

        return (
          <Card
            key={item.id}
            sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            {/* Carrusel Bootstrap embebido */}
            {tieneImagenes ? (
              <div
                id={idCarousel}
                className="carousel slide"
                data-bs-ride="carousel"
              >
                <div className="carousel-inner">
                  {item.imagenes.map((img, index) => (
                    <div
                      key={index}
                      className={`carousel-item ${
                        index === 0 ? 'active' : ''
                      }`}
                    >
                      <img
                        src={`${BASE_URL}${img.url}`}
                        className="d-block w-100"
                        alt={`Imagen ${index + 1}`}
                        style={{ height: 140, objectFit: 'cover' }}
                      />
                    </div>
                  ))}
                </div>
                {item.imagenes.length > 1 && (
                  <>
                    <button
                      className="carousel-control-prev"
                      type="button"
                      data-bs-target={`#${idCarousel}`}
                      data-bs-slide="prev"
                    >
                      <span
                        className="carousel-control-prev-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Anterior</span>
                    </button>
                    <button
                      className="carousel-control-next"
                      type="button"
                      data-bs-target={`#${idCarousel}`}
                      data-bs-slide="next"
                    >
                      <span
                        className="carousel-control-next-icon"
                        aria-hidden="true"
                      />
                      <span className="visually-hidden">Siguiente</span>
                    </button>
                  </>
                )}
              </div>
            ) : (
              <img
                src="/monteVerde.jpg"
                alt="Imagen predeterminada"
                style={{ height: 140, width: '100%', objectFit: 'cover' }}
              />
            )}

            <CardHeader
              title={item.nombre}
              subheader={
                avg == null ? (
                  <Box display="flex" alignItems="center">
                    <CircularProgress size={16} />
                    <Typography variant="body2" ml={1}>
                      cargando…
                    </Typography>
                  </Box>
                ) : (
                  <Box display="flex" alignItems="center">
                    <Rating value={avg} readOnly precision={0.1} size="small" />
                    <Typography variant="body2" ml={1}>
                      {avg} / 5
                    </Typography>
                  </Box>
                )
              }
            />

            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap>
                {item.descripcion}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                component={Link}
                to={`/alojamiento/${item.id}`}
                sx={{
                  backgroundColor: '#2e7d32',
                  color: '#ffffff',
                  '&:hover': { backgroundColor: '#1b5e20' },
                }}
              >
                Ver más
              </Button>
            </CardActions>
          </Card>
        );
      })}
    </div>
  );
}