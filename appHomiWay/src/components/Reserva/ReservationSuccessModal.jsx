import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Dialog, DialogContent, DialogTitle, Typography, Button, Card
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import ReceiptIcon from '@mui/icons-material/Receipt'; // Nuevo icono para facturación

const ReservationSuccessModal = ({ 
  open, 
  onClose, 
  reservaCreada 
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleFacturarReserva = () => {
    if (reservaCreada && reservaCreada.id) {
      // Redirige a la pantalla de facturación con el ID de la reserva
      navigate(`/facturar-reserva/${reservaCreada.id}`);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <CheckCircle sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
        <Typography variant="h5" component="div" color="success.main">
          {t('reserva.success.title')}
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          {t('reserva.success.message')}
        </Typography>
        
        {reservaCreada && (
          <Card sx={{ bgcolor: '#f1f8e9', p: 2, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              <strong>{t('reserva.success.details')}</strong>
            </Typography>
            <Typography variant="body2">
              <strong>{t('reserva.success.reservationId')}:</strong> #{reservaCreada.id}
            </Typography>
            <Typography variant="body2">
              <strong>{t('reserva.accommodation')}:</strong> {reservaCreada.alojamiento}
            </Typography>
            <Typography variant="body2">
              <strong>{t('reserva.dates')}:</strong> {reservaCreada.fechaInicio} - {reservaCreada.fechaFin}
            </Typography>
            <Typography variant="body2">
              <strong>Total:</strong> ₡{reservaCreada.precioTotal?.toLocaleString()}
            </Typography>
            {reservaCreada.servicios.length > 0 && (
              <>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  <strong>{t('reserva.selectedServices')}:</strong>
                </Typography>
                {reservaCreada.servicios.map((servicio, index) => (
                  <Typography variant="body2" key={index} sx={{ ml: 1 }}>
                    • {servicio.NombreServicio} (₡{servicio.Precio?.toLocaleString()})
                  </Typography>
                ))}
              </>
            )}
          </Card>
        )}
        
        <Button
          onClick={handleFacturarReserva}
          variant="contained"
          size="large"
          startIcon={<ReceiptIcon />}
          sx={{ 
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' },
            mt: 2
          }}
        >
          {t('reserva.success.generateInvoice')}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

ReservationSuccessModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  reservaCreada: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    alojamiento: PropTypes.string,
    fechaInicio: PropTypes.string,
    fechaFin: PropTypes.string,
    precioTotal: PropTypes.number,
    servicios: PropTypes.arrayOf(
      PropTypes.shape({
        NombreServicio: PropTypes.string,
        Precio: PropTypes.number
      })
    )
  })
};

ReservationSuccessModal.defaultProps = {
  reservaCreada: null
};

export default ReservationSuccessModal;