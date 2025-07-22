import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ResenaService from '../../services/ResenaService';
import { Typography, Grid, Card, CardContent, Rating } from '@mui/material';

export default function Resena({ alojamientoId }) {
  const [resenas, setResenas] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    ResenaService.getByAlojamiento(alojamientoId)
      .then((res) => {
        const ordenadas = res.data.sort((a, b) => new Date(b.Fecha) - new Date(a.Fecha));
        setResenas(ordenadas.slice(0, 5));
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message || 'Error al cargar reseñas');
        setLoaded(false);
      });

}, [alojamientoId]);
  if (!loaded) return null;
  if (error || resenas.length === 0) {
    return <p><em>No hay reseñas para este alojamiento.</em></p>;
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>Reseñas</Typography>
      <Grid container spacing={2}>
        {resenas.map((r, i) => (
          <Grid item xs={12} md={6} key={i}>
            <Card variant="outlined">
              <CardContent>
               <Typography variant="subtitle1">
                {r.UsuarioNombre}
              </Typography>
                <Rating value={Number(r.Calificacion)} readOnly precision={0.5} />
                <Typography variant="body2" color="textSecondary">
                  {new Date(r.Fecha).toLocaleDateString('es-CR')}
                </Typography>
                <Typography variant="body1" style={{ marginTop: '.5rem' }}>
                  {r.Comentario || '—'}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

Resena.propTypes = {
  alojamientoId: PropTypes.number.isRequired,
};