import React from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Divider,
  Grid,
  useTheme
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const PromotionDetailsModal = ({
  open = false,
  onClose = () => {},
  promotion = null
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  if (!promotion) return null;

  const formatDate = (dateString) => {
    if (!dateString) return t('promotionDetail.noDate');
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return t('promotionDetail.invalidDate');
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatValue = (tipo, valor) => {
    if (valor == null) return t('promotionDetail.noValue');
    if (tipo === 'porcentaje') {
      return `${valor}% ${t('promotionDetail.off')}`;
    }
    if (tipo === 'monto') {
      return `${t('currency.symbol')}${Number(valor).toLocaleString()}`;
    }
    return `${valor}`;
  };

  const calcularEstadoDinamico = (inicio, fin) => {
    if (!inicio || !fin) {
      return { estado: t('states.noDates') };
    }
    const now = new Date();
    const start = new Date(inicio);
    const end = new Date(fin);
    if (isNaN(start) || isNaN(end)) {
      return { estado: t('states.invalidDates') };
    }
    end.setHours(23, 59, 59, 999);

    if (now < start) return { estado: t('states.pending') };
    if (now >= start && now <= end) return { estado: t('states.active') };
    return { estado: t('states.applied') };
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="promotion-details-modal"
      aria-describedby="promotion-details-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '600px' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          p: 4,
          outline: 'none'
        }}
      >
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2" color={theme.palette.primary.main}>
            {t('promotionDetail.title')}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Contenido */}
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto', p: 1 }}>
          <Grid container spacing={2}>
            {/* Izquierda */}
            <Grid item xs={12} md={6}>
              <DetailItem
                label={t('promotionDetail.code')}
                value={promotion.Codigo || t('promotionDetail.notAvailable')}
              />
              <DetailItem
                label={t('promotionDetail.description')}
                value={promotion.Descripcion || t('promotionDetail.noDescription')}
              />
              <DetailItem
                label={t('promotionDetail.discountType')}
                value={
                  promotion.Tipo === 'porcentaje'
                    ? t('promotionDetail.percentage')
                    : t('promotionDetail.fixedAmount')
                }
              />
              <DetailItem
                label={t('promotionDetail.value')}
                value={formatValue(promotion.Tipo, promotion.Valor)}
              />
            </Grid>

            {/* Derecha */}
            <Grid item xs={12} md={6}>
              <DetailItem
                label={t('promotionDetail.validFrom')}
                value={formatDate(promotion.Inicio)}
              />
              <DetailItem
                label={t('promotionDetail.validUntil')}
                value={formatDate(promotion.Fin)}
              />
              <DetailItem
                label={t('promotionDetail.status')}
                value={calcularEstadoDinamico(promotion.Inicio, promotion.Fin).estado}
              />
              {promotion.Requisitos && (
                <DetailItem
                  label={t('promotionDetail.requirements')}
                  value={promotion.Requisitos}
                  multiline
                />
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

const DetailItem = ({ label, value, multiline = false }) => (
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
      <Typography variant="body1">{value}</Typography>
    )}
  </Box>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  multiline: PropTypes.bool
};

PromotionDetailsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  promotion: PropTypes.shape({
    Codigo: PropTypes.string,
    Descripcion: PropTypes.string,
    Tipo: PropTypes.string,
    Valor: PropTypes.number,
    Inicio: PropTypes.string,
    Fin: PropTypes.string,
    Requisitos: PropTypes.string
  })
};

export default PromotionDetailsModal;