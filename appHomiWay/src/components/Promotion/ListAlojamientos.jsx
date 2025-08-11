import React, { useState, useEffect } from 'react';
import {
  Modal, Box, Typography, Button, CircularProgress, Alert,
  Card, CardContent, CardActions
} from '@mui/material';
import AlojamientoService from '../../services/AlojamientoService';
import EtiquetaService from '../../services/EtiquetaService';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 900,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflowY: 'auto'
};

const ListAlojamientos = ({
  open,
  onClose,
  promotionId,
  onSuccess,
  promotionName,
  promotionDescription
}) => {
  const { t } = useTranslation();
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(null);
  const [success, setSuccess] = useState(null);
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads/';

  useEffect(() => {
    if (open) {
      loadAlojamientos();
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  const loadAlojamientos = async () => {
    try {
      setLoading(true);
      const response = await AlojamientoService.getAlojamientos();
      setAlojamientos(response.data);
    } catch (err) {
      console.error('Error al cargar alojamientos:', err);
      setError(err.message || t('listAlojamientos.errorLoad'));
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromotion = async (alojamientoId, alojamientoNombre) => {
    try {
      setApplying(alojamientoId);
      setError(null);

      const etiquetaData = {
        ID_Alojamiento: alojamientoId,
        Nombre: promotionName || t('listAlojamientos.defaultPromotionName'),
        Descripcion:
          promotionDescription || t('listAlojamientos.defaultPromotionDesc'),
        ID_Promocion: promotionId
      };

      await EtiquetaService.createPromocionAlojamientos(etiquetaData);

      setSuccess(
        t('listAlojamientos.successApply', { nombre: alojamientoNombre })
      );

      onSuccess();

      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
    } catch (err) {
      console.error('Error al aplicar promoción:', err);
      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        t('listAlojamientos.errorApply')
      );
    } finally {
      setApplying(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          {t('listAlojamientos.title')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: 16,
              marginTop: 16,
            }}
          >
            {alojamientos.map((item) => {
              const tieneImagenes =
                Array.isArray(item.imagenes) && item.imagenes.length > 0;
              const idCarousel = `carousel-modal-${item.id}`;
              const alojamientoId = item.ID || item.id;
              const nombre = item.Nombre || item.nombre;

              return (
                <Card
                  key={alojamientoId}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 4
                    }
                  }}
                >
                  {/* Carrusel Bootstrap */}
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
                              alt={t('alojamientos.cards.imageAlt', {
                                num: index + 1
                              })}
                              style={{ height: 200, objectFit: 'cover' }}
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
                            <span className="visually-hidden">
                              {t('listAlojamientos.previous')}
                            </span>
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
                            <span className="visually-hidden">
                              {t('listAlojamientos.next')}
                            </span>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <img
                      src="/monteVerde.jpg"
                      alt={t('listAlojamientos.defaultImageAlt')}
                      style={{ height: 200, width: '100%', objectFit: 'cover' }}
                    />
                  )}

                  <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                    <Typography variant="h6" component="div" noWrap>
                      {nombre}
                    </Typography>
                  </CardContent>

                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      onClick={() =>
                        handleApplyPromotion(alojamientoId, nombre)
                      }
                      disabled={applying === alojamientoId || success}
                      sx={{
                        backgroundColor: '#2e7d32',
                        '&:hover': { backgroundColor: '#1b5e20' }
                      }}
                    >
                      {applying === alojamientoId ? (
                        <CircularProgress size={24} color="inherit" />
                      ) : (
                        t('listAlojamientos.applyPromotion')
                      )}
                    </Button>
                  </CardActions>
                </Card>
              );
            })}
          </div>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={applying}>
            {t('listAlojamientos.cancel')}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

ListAlojamientos.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  promotionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onSuccess: PropTypes.func.isRequired,
  promotionName: PropTypes.string,
  promotionDescription: PropTypes.string
};

export default ListAlojamientos;