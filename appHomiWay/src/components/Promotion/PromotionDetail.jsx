import React from 'react';
import {
  Box,
  Typography,
  Modal,
  IconButton,
  Divider,
  useTheme,
    Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';


const PromotionDetailsModal = ({ open, onClose, promotion }) => {
  const theme = useTheme();

  if (!promotion) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="promotion-details-modal"
      aria-describedby="promotion-details-description"
    >
      <Box sx={{
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
      }}>
        {/* Header del Modal */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2" color={theme.palette.primary.main}>
            Detalles de la Promoción
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Contenido del Modal */}
        <Box sx={{ maxHeight: '70vh', overflowY: 'auto', p: 1 }}>
          <Grid container spacing={2}>
            {/* Columna izquierda - Datos principales */}
            <Grid item xs={12} md={6}>
              <DetailItem label="Código" value={promotion.Codigo || 'N/A'} />
              <DetailItem label="Descripción" value={promotion.Descripcion || 'Sin descripción'} />
              <DetailItem 
                label="Tipo de descuento" 
                value={promotion.Tipo === 'porcentaje' ? 'Porcentaje' : 'Monto fijo'} 
              />
              <DetailItem 
                label="Valor" 
                value={formatValue(promotion.Tipo, promotion.Valor)} 
              />
            </Grid>

            {/* Columna derecha - Fechas y estado */}
            <Grid item xs={12} md={6}>
              <DetailItem label="Fecha de inicio" value={formatDate(promotion.Inicio)} />
              <DetailItem label="Fecha de fin" value={formatDate(promotion.Fin)} />
              <DetailItem 
                label="Estado" 
                value={calcularEstadoDinamico(promotion.Inicio, promotion.Fin).estado} 
              />
              {promotion.Requisitos && (
                <DetailItem 
                  label="Requisitos" 
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

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  multiline: PropTypes.bool
};

// Funciones auxiliares (también podrían importarse de un archivo de utilidades)
const formatDate = (dateString) => {
  if (!dateString) return 'No especificada';
  const date = new Date(dateString);
  return isNaN(date.getTime()) 
    ? 'Fecha inválida' 
    : date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
};

const formatValue = (tipo, valor) => {
  if (!valor) return 'No especificado';
  return tipo === 'porcentaje' 
    ? `${valor}% OFF` 
    : tipo === 'monto' 
      ? `₡${Number(valor).toLocaleString()}` 
      : valor;
};

const calcularEstadoDinamico = (inicio, fin) => {
  if (!inicio || !fin) return { estado: 'Sin fechas', color: 'default' };
  
  const now = new Date();
  const fechaInicio = new Date(inicio);
  const fechaFin = new Date(fin);
  
  if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
    return { estado: 'Fechas inválidas', color: 'default' };
  }
  
  fechaFin.setHours(23, 59, 59, 999);
  
  if (now < fechaInicio) return { estado: 'Pendiente', color: 'warning' };
  if (now >= fechaInicio && now <= fechaFin) return { estado: 'Vigente', color: 'success' };
  return { estado: 'Aplicado', color: 'default' };
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
    Requisitos: PropTypes.string,
    
  })
};


export default PromotionDetailsModal;