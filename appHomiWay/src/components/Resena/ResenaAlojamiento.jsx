import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ResenaService from '../../services/ResenaService';
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Divider,
  Rating,
  Button
} from '@mui/material';

export default function ResenaAlojamientoPage() {
  const { id } = useParams();
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    ResenaService.getByAlojamiento(id)
      .then((res) => {
        setResenas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Error al cargar reseñas');
        setLoading(false);
      });
  }, [id]);

  return (
    <Box sx={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <Typography variant="h4" gutterBottom>
        Reseñas del alojamiento
      </Typography>

      <Button
        component={Link}
        to={`/alojamiento/${id}`}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        ← Volver al detalle
      </Button>

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <CircularProgress sx={{ color: '#2e7d32' }} />
          <Typography variant="body1" sx={{ mt: 2 }}>Cargando reseñas...</Typography>
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : resenas.length === 0 ? (
        <Typography>No hay reseñas disponibles para este alojamiento.</Typography>
      ) : (
        <>
          <Divider sx={{ mb: 2 }} />
          {resenas.map((r, i) => (
            <Card key={i} sx={{ mb: 2, backgroundColor: '#f9f9f9' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {r.UsuarioNombre || 'Usuario anónimo'}
                </Typography>
                <Rating value={r.Calificacion} readOnly />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {r.Comentario}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Fecha: {new Date(r.Fecha).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
}