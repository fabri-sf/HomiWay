import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Button,
  Card,
  CardContent
} from '@mui/material';

const ResumenFacturacion = ({ selectedReservas, total, onProceedToPay, formatCurrency }) => {
  // Solo mostrar el resumen si hay reservas seleccionadas
  if (selectedReservas.length === 0) {
    return null;
  }

  return (
    <Card sx={{ marginBottom: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Resumen de Facturación
        </Typography>
        <Typography>
          Reservas seleccionadas: {selectedReservas.length}
        </Typography>
        <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
          Total: {formatCurrency(total)}
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={onProceedToPay}
          sx={{ marginTop: 2 }}
        >
          Proceder al Pago
        </Button>
      </CardContent>
    </Card>
  );
};

ResumenFacturacion.propTypes = {
  selectedReservas: PropTypes.array.isRequired,
  total: PropTypes.number.isRequired,
  onProceedToPay: PropTypes.func.isRequired,
  formatCurrency: PropTypes.func.isRequired
};

export default ResumenFacturacion;