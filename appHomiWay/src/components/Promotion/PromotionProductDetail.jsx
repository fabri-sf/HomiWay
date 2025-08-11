import React from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Divider,
  useTheme,
  Grid,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const AlojamientoDetailsModal = ({ open, onClose, alojamiento }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!alojamiento) return null;

  // Calcular información de la promoción
  const tienePromocion = !!alojamiento.PromocionID;
  const estadoPromocion = determinarEstadoPromocion(alojamiento.EstadoPromocion);
  const precioInfo = tienePromocion ? obtenerPrecioCalculado(alojamiento) : null;
  const descuentoPorcentaje = precioInfo?.porcentajeDescuento || 0;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="alojamiento-promo-modal"
      aria-describedby="alojamiento-promo-description"
    >
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '80%', md: '700px' },
        bgcolor: 'background.paper',
        boxShadow: 24,
        borderRadius: 2,
        p: 4,
        outline: 'none',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header del Modal */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2" color={theme.palette.primary.main}>
            {t('promo.title')}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Contenido del Modal */}
        <Grid container spacing={3}>
          {/* Columna izquierda - Información del alojamiento */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{
              color: theme.palette.primary.main,
              fontWeight: 'bold'
            }}>
              {alojamiento.AlojamientoNombre || t('promo.noName')}
            </Typography>

            <DetailItem
              label={t('promo.descriptionLabel')}
              value={alojamiento.Descripcion || t('promo.noDescription')}
              multiline
            />

            <Box display="flex" alignItems="center" mb={2}>
              <PersonIcon sx={{ fontSize: 16, color: theme.palette.primary.dark, mr: 1 }} />
              <Typography variant="body1">
                {t('promo.capacity')}: {alojamiento.Capacidad || t('promo.na')} {t('promo.people')}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={2}>
              <CategoryIcon sx={{ fontSize: 16, color: theme.palette.primary.dark, mr: 1 }} />
              <Typography variant="body1">
                {t('promo.category')}: {alojamiento.Categoria || t('promo.noCategory')}
              </Typography>
            </Box>

            {alojamiento.EtiquetaNombre && (
              <DetailItem
                label={t('promo.tagLabel')}
                value={alojamiento.EtiquetaNombre}
              />
            )}

            <DetailItem
              label={t('promo.priceNight')}
              value={formatPrice(alojamiento.PrecioNoche)}
            />
          </Grid>

          {/* Columna derecha - Información de la promoción */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom sx={{
              color: theme.palette.secondary.main,
              fontWeight: 'bold'
            }}>
              {t('promo.infoTitle')}
            </Typography>

            {tienePromocion ? (
              <>
                <Box display="flex" alignItems="center" mb={2}>
                  <Chip
                    label={estadoPromocion.texto}
                    size="medium"
                    sx={{
                      backgroundColor: estadoPromocion.color,
                      color: 'white',
                      fontWeight: 'bold',
                      mr: 2
                    }}
                  />
                  {descuentoPorcentaje > 0 && (
                    <Chip
                      label={`-${descuentoPorcentaje}%`}
                      size="medium"
                      sx={{
                        backgroundColor: theme.palette.success.light,
                        color: theme.palette.success.dark,
                        fontWeight: 'bold'
                      }}
                    />
                  )}
                </Box>

                {alojamiento.Codigo && (
                  <DetailItem
                    label={t('promo.codeLabel')}
                    value={alojamiento.Codigo}
                  />
                )}

                {alojamiento.PromocionDescripcion && (
                  <DetailItem
                    label={t('promo.descLabel')}
                    value={alojamiento.PromocionDescripcion}
                    multiline
                  />
                )}

                <DetailItem
                  label={t('promo.priceDiscountLabel')}
                  value={formatPrice(precioInfo?.precioConDescuento || alojamiento.PrecioConDescuento)}
                />

                <DetailItem
                  label={t('promo.startDateLabel')}
                  value={formatDate(alojamiento.Inicio)}
                />

                <DetailItem
                  label={t('promo.endDateLabel')}
                  value={formatDate(alojamiento.Fin)}
                />

              </>
            ) : (
              <Typography variant="body1" color="text.secondary">
                {t('promo.noActive')}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
};

// Componente auxiliar para mostrar cada campo
const DetailItem = ({ label, value, multiline = false }) => {
  return (
    <Box mb={2}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}:
      </Typography>
      {multiline ? (
        <Typography
          variant="body1"
          sx={{
            whiteSpace: 'pre-line',
            backgroundColor: 'action.hover',
            p: 1,
            borderRadius: 1
          }}
        >
          {value}
        </Typography>
      ) : (
        <Typography variant="body1">
          {value}
        </Typography>
      )}
    </Box>
  );
};

// Funciones auxiliares
const formatPrice = (price) => {
  if (!price) return '₡0';
  return `₡${Number(price).toLocaleString('es-CR')}`;
};

const formatDate = (dateString) => {
  if (!dateString) return t('promo.noDate');
  const date = new Date(dateString);
  return isNaN(date.getTime())
    ? t('promo.invalidDate')
    : date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
};

const obtenerPrecioCalculado = (alojamiento) => {
  if (!alojamiento.PromocionID) return null;
  return {
    precioConDescuento: alojamiento.PrecioConDescuento || alojamiento.PrecioNoche,
    porcentajeDescuento: calcularDescuentoLocal(alojamiento.PrecioNoche, alojamiento.PrecioConDescuento),
    calculadoPorAPI: false
  };
};

const calcularDescuentoLocal = (precioOriginal, precioConDescuento) => {
  if (!precioOriginal || !precioConDescuento) return 0;
  const descuento = ((precioOriginal - precioConDescuento) / precioOriginal) * 100;
  return Math.round(descuento);
};

const determinarEstadoPromocion = (estadoPromocion) => {
  switch (estadoPromocion) {
    case 'Vigente':
      return {
        color: 'success.main',
        texto: 'Vigente'
      };
    case 'Aplicado':
      return {
        color: 'grey.500',
        texto: 'Finalizado'
      };
    case 'Pendiente':
      return {
        color: 'warning.main',
        texto: 'Pendiente'
      };
    default:
      return {
        color: 'grey.500',
        texto: 'Sin promoción'
      };
  }
};

// PropTypes
AlojamientoDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  alojamiento: PropTypes.shape({
    AlojamientoID: PropTypes.number,
    AlojamientoNombre: PropTypes.string,
    Descripcion: PropTypes.string,
    Capacidad: PropTypes.number,
    Categoria: PropTypes.string,
    EtiquetaNombre: PropTypes.string,
    PrecioNoche: PropTypes.number,
    PrecioConDescuento: PropTypes.number,
    PromocionID: PropTypes.number,
    PromocionDescripcion: PropTypes.string,
    Codigo: PropTypes.string,
    EstadoPromocion: PropTypes.string,
    Inicio: PropTypes.string,
    Fin: PropTypes.string
  })
};

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  multiline: PropTypes.bool
};

export default AlojamientoDetailsModal;