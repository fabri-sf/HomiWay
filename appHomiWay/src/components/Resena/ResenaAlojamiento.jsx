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
import { useTranslation } from 'react-i18next';
export default function ResenaAlojamientoPage() {
  const { id } = useParams();
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    ResenaService.getByAlojamiento(id)
      .then((res) => {
        setResenas(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || t('reviews.detail.error'));
        setLoading(false);
      });
  }, [id]);
    return (
    <Box sx={{ maxWidth: '900px', margin: '2rem auto', padding: '1rem' }}>
      <Typography variant="h4" gutterBottom>
        {t('reviews.detail.title')}
      </Typography>

      <Button
        component={Link}
        to={`/alojamiento/${id}`}
        variant="outlined"
        sx={{ mb: 3 }}
      >
        {t('reviews.detail.back')}
      </Button>

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <CircularProgress sx={{ color: '#2e7d32' }} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            {t('reviews.detail.loading')}
          </Typography>
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : resenas.length === 0 ? (
        <Typography>{t('reviews.detail.empty')}</Typography>
      ) : (
        <>
          <Divider sx={{ mb: 2 }} />
          {resenas.map((r, i) => (
            <Card key={i} sx={{ mb: 2, backgroundColor: '#f9f9f9' }}>
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary">
                  {r.UsuarioNombre || t('reviews.detail.anonymous')}
                </Typography>
                <Rating value={r.Calificacion} readOnly />
                <Typography variant="body1" sx={{ mt: 1 }}>
                  {r.Comentario}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('reviews.detail.date')}: {new Date(r.Fecha).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </Box>
  );
}