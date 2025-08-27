import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { UserContext } from '../../context/UserContext';
import CarritoService from '../../services/CarritoService';
import ImageService from '../../services/ImageService';

import {
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Chip,
  Stack,
  CircularProgress
} from '@mui/material';

import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon       from '@mui/icons-material/Delete';
import LocalOfferIcon   from '@mui/icons-material/LocalOffer';
import ArrowBackIcon    from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

export default function Carrito() {
  const { user: rawToken, decodeToken } = useContext(UserContext);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const token = typeof rawToken === 'string'
    ? rawToken.replace(/^"|"$/g, '')
    : '';
  const payload = decodeToken ? decodeToken(token) : {};
  const userId = payload?.id;

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendBase = `${window.location.protocol}//${window.location.hostname}:81`;
  const apiSegment = '/apihomiway';

  useEffect(() => {
    if (!userId) {
      setItems([]);
      setLoading(false);
      window.dispatchEvent(new CustomEvent('cartCountUpdated', { detail: 0 }));
      return;
    }

    setLoading(true);
    CarritoService.getCarritoByUsuario(userId)
      .then(async ({ data }) => {
        const enriched = await Promise.all(data.map(async item => {
          let fotoUrl = null;
          try {
            const respImg = await ImageService.getFirst(item.alojamiento_id);
            const file = respImg.data?.url;
            if (file) {
              fotoUrl = `${backendBase}${apiSegment}/uploads/${file}`;
            }
          } catch (err) {
            console.error('Error ImageService.getFirst:', err);
          }

          let nombre = '—';
          let descripcion = '—';
          let price = 0;
          try {
            const url = `${backendBase}${apiSegment}/alojamiento/${item.alojamiento_id}`;
            const resp = await axios.get(url, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const d = resp.data.data || resp.data;
            nombre      = d.nombre      ?? d.Nombre      ?? nombre;
            descripcion = d.descripcion ?? d.Descripcion ?? descripcion;
            price       = d.precio      ?? d.Precio      ?? price;
          } catch (err) {
            console.error('Error fetch alojamiento detalles:', err.response?.data || err);
          }

          return {
            ...item,
            foto:       fotoUrl,
            nombre,
            descripcion,
            price,
            servicios:  item.servicios || []
          };
        }));

        setItems(enriched);
        window.dispatchEvent(new CustomEvent('cartCountUpdated', { detail: enriched.length }));
      })
      .catch(err => {
        console.error('Error cargando carrito:', err);
        setItems([]);
        window.dispatchEvent(new CustomEvent('cartCountUpdated', { detail: 0 }));
      })
      .finally(() => setLoading(false));
  }, [userId, token]);

  const handleEliminar = carritoId => {
    CarritoService.deleteCarrito(carritoId)
      .then(() => {
        setItems(prev => {
          const next = prev.filter(i => i.carrito_id !== carritoId);
          window.dispatchEvent(new CustomEvent('cartCountUpdated', { detail: next.length }));
          toast.success(t('carrito.toast.delete'));
          return next;
        });
      })
      .catch(err => {
        console.error('Error eliminando ítem:', err);
        toast.error(t('carrito.toast.error'));
      });
  };

  const handleLimpiar = () => {
    CarritoService.clearCarrito(userId)
      .then(() => {
        setItems([]);
        window.dispatchEvent(new CustomEvent('cartCountUpdated', { detail: 0 }));
        toast.success(t('carrito.toast.clear'));
      })
      .catch(err => {
        console.error('Error vaciando carrito:', err);
        toast.error(t('carrito.toast.error'));
      });
  };

  const handleReservarTodos = () => {
    console.log('Reservar todos:', items);
    toast.success(t('carrito.toast.reserveAll'));
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <CircularProgress color="secondary" size={48} />
        <Typography mt={2}>{t('carrito.loading')}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Toaster position="bottom-center" />

      <IconButton onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        <ArrowBackIcon />
        <Typography variant="button" sx={{ ml: 1 }}>
          {t('carrito.back')}
        </Typography>
      </IconButton>

      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ShoppingCartIcon fontSize="large" /> {t('carrito.title')}
        </Typography>
        {items.length > 0 && (
          <Stack direction="row" spacing={1}>
            <Button variant="contained" color="primary" onClick={handleReservarTodos}>
              {t('carrito.buttons.reserveAll')}
            </Button>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleLimpiar}
            >
              {t('carrito.buttons.clear')}
            </Button>
          </Stack>
        )}
      </Stack>

      {items.length === 0 ? (
        <Typography align="center" color="text.secondary">
          {t('carrito.empty')}
        </Typography>
      ) : (
        <Stack spacing={3}>
          {items.map(item => (
            <Card key={item.carrito_id} elevation={3} sx={{ display: 'flex', borderRadius: 2 }}>
              <CardActionArea sx={{ display: 'flex', width: '100%' }}>
                {item.foto && (
                  <CardMedia
                    component="img"
                    sx={{ width: 160, objectFit: 'cover' }}
                    image={item.foto}
                    alt={item.nombre}
                  />
                )}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', paddingTop: 4 }}>
                  <CardContent>
                    <Typography variant="h6" noWrap>
                      {item.nombre}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.descripcion}
                    </Typography>

                    {Array.isArray(item.servicios) && item.servicios.length > 0 && (
                      <Stack direction="row" spacing={0.5} mt={1}>
                        {item.servicios.map(s => (
                          <Chip
                            key={s.ID}
                            size="small"
                            icon={<LocalOfferIcon />}
                            label={s.Nombre}
                            color="secondary"
                          />
                        ))}
                      </Stack>
                    )}
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <Button
                      variant="contained"
                      color="secondary"
                      onClick={() => {
                        console.log('Reservar:', item);
                        toast.success(t('carrito.toast.reserve'));
                      }}
                    >
                      {t('carrito.buttons.reserve')}
                    </Button>
                    <IconButton
                      color="error"
                      onClick={() => handleEliminar(item.carrito_id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Box>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}
