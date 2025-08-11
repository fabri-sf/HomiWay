import React, { useEffect, useState } from 'react';
import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid2';
import ResenaService from '../../services/ResenaService';
import { jwtDecode } from 'jwt-decode';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
export default function ListResena() {
  const [resenas, setResenas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
  const userData = token ? jwtDecode(token) : null;
  const { t } = useTranslation();

  const fetchResenas = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await ResenaService.getAll();
      setResenas(res.data);
    } catch (err) {
      setError(err.message || t('reviews.list.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResenas();
  }, []);
    const handleDelete = async (id) => {
    await toast.promise(
      ResenaService.deleteLogicoResena(id),
      {
        loading: t('reviews.list.toast.delete.loading'),
        success: t('reviews.list.toast.delete.success'),
        error: t('reviews.list.toast.delete.error')
      },
      { position: 'bottom-center' }
    );
    fetchResenas();
  };

  if (loading) {
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
        <Typography variant="h6">{t('reviews.list.loading')}</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          padding: '2rem',
          backgroundColor: '#fafaf7',
        }}
      >
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }
    return (
    <Box sx={{ maxWidth: 1200, m: '2rem auto', px: 2 }}>

      <Typography variant="h5" gutterBottom>
        {t('reviews.list.title')}
      </Typography>

      <Grid container justifyContent="left" mb={2}>
        <Button
          variant="contained"
          component={Link}
          to="/resena/crear/1"
          color="primary"
        >
          {t('reviews.list.buttons.create')}
        </Button>
      </Grid>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('reviews.list.table.user')}</TableCell>
              <TableCell>{t('reviews.list.table.date')}</TableCell>
              <TableCell>{t('reviews.list.table.comment')}</TableCell>
              <TableCell>{t('reviews.list.table.rating')}</TableCell>
              <TableCell>{t('reviews.list.table.id')}</TableCell>
              <TableCell align="center">{t('reviews.list.table.action')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resenas.map((r) => (
              <TableRow key={r.ID} hover>
                <TableCell>{r.UsuarioNombre || `ID ${r.ID_Usuario}`}</TableCell>
                <TableCell>
                  {new Date(r.Fecha).toLocaleDateString('es-CR')}
                </TableCell>
                <TableCell>{r.Comentario || '—'}</TableCell>
                <TableCell>
                  <Rating
                    value={Number(r.Calificacion)}
                    readOnly
                    precision={0.5}
                  />
                </TableCell>
                <TableCell align="center">{r.ID_Alojamiento}</TableCell>
                <TableCell align="center">
                  <Button
                    size="small"
                    onClick={() => handleDelete(r.ID)}
                    sx={{
                      minWidth: 'initial',
                      color: 'black',
                      fontSize: '1rem',
                      lineHeight: 1,
                      p: 1,
                    }}
                  >
                    x
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}