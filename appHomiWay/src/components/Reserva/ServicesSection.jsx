import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography, Grid, Card, CardContent, Box, Avatar, Chip, 
  FormControlLabel, Checkbox, TextField, Alert, Divider
} from '@mui/material';
import { useTranslation } from 'react-i18next';

const ServicesSection = ({
  servicios,
  formData,
  validationErrors,
  onServiceSelection,
  onServiceDateChange
}) => {
  const { t } = useTranslation();

  if (!servicios || servicios.length === 0) {
    return null;
  }

  return (
    <>
      <Divider sx={{ my: 3 }} />
      
      <Typography variant="h6" gutterBottom>
        {t('reserva.availableServices')} <Chip label={t('reserva.optional')} size="small" color="primary" />
      </Typography>
      
      {validationErrors.servicios && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {validationErrors.servicios}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {servicios.map((servicio) => {
          const isSelected = formData.serviciosSeleccionados.some(s => s.ID_Servicio === servicio.ID);
          const servicioSeleccionado = formData.serviciosSeleccionados.find(s => s.ID_Servicio === servicio.ID);

          return (
            <Grid item xs={12} key={servicio.ID}>
              <Card 
                variant="outlined" 
                sx={{ 
                  border: isSelected ? '2px solid #2e7d32' : '1px solid rgba(0, 0, 0, 0.12)',
                  bgcolor: isSelected ? '#f1f8e9' : 'white'
                }}
              >
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar sx={{ bgcolor: '#2e7d32', width: 32, height: 32, mr: 2, fontSize: 14 }}>
                          {servicio.Tipo?.charAt(0).toUpperCase() || 'S'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="bold">
                            {servicio.Nombre}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {servicio.Descripcion}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={servicio.Tipo} size="small" variant="outlined" />
                        <Chip label={`₡${servicio.Precio}`} size="small" color="primary" />
                        {servicio.Valoracion && (
                          <Chip 
                            label={`⭐ ${servicio.Valoracion}`} 
                            size="small" 
                            variant="outlined" 
                          />
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={4}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => onServiceSelection(servicio, e.target.checked)}
                            disabled={!formData.Fecha_Inicio || !formData.Fecha_Fin}
                          />
                        }
                        label={t('reserva.selectService')}
                      />
                      
                      {isSelected && (
                        <TextField
                          fullWidth
                          label={t('reserva.fechaServicio')}
                          type="date"
                          value={servicioSeleccionado?.Fecha_Inicio || ''}
                          onChange={(e) => onServiceDateChange(servicio.ID, e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{
                            min: formData.Fecha_Inicio,
                            max: formData.Fecha_Fin
                          }}
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      )}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};

// PropTypes
ServicesSection.propTypes = {
  servicios: PropTypes.arrayOf(
    PropTypes.shape({
      ID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      Nombre: PropTypes.string.isRequired,
      Descripcion: PropTypes.string,
      Tipo: PropTypes.string,
      Precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      Valoracion: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ),
  formData: PropTypes.shape({
    Fecha_Inicio: PropTypes.string,
    Fecha_Fin: PropTypes.string,
    serviciosSeleccionados: PropTypes.arrayOf(
      PropTypes.shape({
        ID_Servicio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        Fecha_Inicio: PropTypes.string,
        NombreServicio: PropTypes.string,
        Precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      })
    )
  }).isRequired,
  validationErrors: PropTypes.shape({
    servicios: PropTypes.string
  }),
  onServiceSelection: PropTypes.func.isRequired,
  onServiceDateChange: PropTypes.func.isRequired
};

// Default props
ServicesSection.defaultProps = {
  servicios: [],
  validationErrors: {}
};

export default ServicesSection;