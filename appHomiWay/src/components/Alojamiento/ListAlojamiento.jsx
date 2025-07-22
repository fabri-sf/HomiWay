import React, { useEffect, useState } from 'react';
import AlojamientoService from '../../services/AlojamientoService';
import { ListCardAlojamientos } from './ListCardAlojamientos';
import {
  Box,
  CircularProgress,
  Typography
} from '@mui/material';

export function ListAlojamiento() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AlojamientoService.getAlojamientos()
      .then((res) => {
        setData(res.data);
        setError('');
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener alojamientos');
        setLoaded(false);
      });
  }, []);

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
        <Typography variant="h6">Cargando alojamientos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ padding: '2rem', backgroundColor: '#fafaf7' }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{ padding: '2rem', backgroundColor: '#fafaf7' }}>
        <Typography>No hay alojamientos para mostrar.</Typography>
      </Box>
    );
  }

  return <ListCardAlojamientos data={data} />;
}