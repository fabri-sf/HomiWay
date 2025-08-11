import React, { useEffect, useState } from 'react';
import AlojamientoService from '../../services/AlojamientoService';
import { ListCardAlojamientos } from './ListCardAlojamientos';
import {
  Box,
  CircularProgress,
  Typography,
  Button
} from '@mui/material';
import { useTranslation } from 'react-i18next';

export function ListAlojamiento() {
  const { t } = useTranslation();
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
        setError(err.message || t('alojamientos.list.errorFetch'));
        setLoaded(false);
      });
  }, [t]);

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
          color: '#2E7D32'
        }}
      >
        <CircularProgress size={60} sx={{ color: '#2E7D32', mb: 2 }} />
        <Typography variant="h6">
          {t('alojamientos.list.loading')}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, backgroundColor: '#fafaf7' }}>
        <Typography color="error">
          {t('alojamientos.list.error')}: {error}
        </Typography>
      </Box>
    );
  }

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Box sx={{ p: 4, backgroundColor: '#fafaf7' }}>
        <Typography>
          {t('alojamientos.list.empty')}
        </Typography>
      </Box>
    );
  }

  return <ListCardAlojamientos data={data} />;
}