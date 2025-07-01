import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ServicioService from '../../services/ServicioService';
import { Typography, Card, CardContent, Grid } from '@mui/material';

export function ListServicios({ alojamientoId }) {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      ServicioService.getByAlojamiento(alojamientoId)
        .then((res) => {
          console.log('Servicios recibidos:', res.data); // Para depuración
          setServicios(res.data);
          setLoaded(true);
        })
        .catch((err) => {
          setError(err.message || 'Error al obtener los servicios');
          setLoaded(false);
        });
    }, [alojamientoId]);

  if (!loaded) return null;

  if (error || servicios.length === 0) {
    return <p><em>Este alojamiento no tiene servicios registrados.</em></p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>Servicios Disponibles</Typography>
      <Grid container spacing={2}>
        {servicios.map((s, i) => (
        <Grid item xs={12} sm={6} md={4} key={i}>
          <Card variant="outlined" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {s.Imagen && (
              <img
                src={`${import.meta.env.VITE_BASE_URL}uploads/${s.Imagen}`}
                alt={s.Nombre}
                style={{
                  width: '100%',
                  height: 160,
                  objectFit: 'cover',
                  borderTopLeftRadius: 4,
                  borderTopRightRadius: 4,
                }}
              />
            )}
            <CardContent style={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>{s.Nombre || `Servicio ${i + 1}`}</Typography>
              <Typography variant="body2" style={{ marginBottom: '.5rem' }}>
                {s.Descripcion || 'Sin descripción.'}
              </Typography>
              <Typography variant="body2"><strong>Tipo:</strong> {s.Tipo || '—'}</Typography>
              <Typography variant="body2">
                <strong>Precio:</strong>{' '}
                ₡{Number(s.Precio).toLocaleString('es-CR', { minimumFractionDigits: 3 })}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      </Grid>
    </div>
  );
}

ListServicios.propTypes = {
  alojamientoId: PropTypes.number.isRequired,
};