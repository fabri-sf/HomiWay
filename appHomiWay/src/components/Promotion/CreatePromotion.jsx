import React, { useState } from 'react';
import { 
  Modal, Box, Typography, Button, TextField, 
  MenuItem, Alert, CircularProgress, Radio, 
  RadioGroup, FormControlLabel, FormControl, FormLabel, Grid
} from '@mui/material';
import ListCategories from './ListCategorias';
import PromocionService from '../../services/PromocionService';
import PropTypes from 'prop-types';
import ListAlojamientos from './ListAlojamientos';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: '700px' },
  maxWidth: '95vw',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 2,
  overflowY: 'auto'
};

const CreatePromotion = ({ open, onClose, onPromotionCreated }) => {
  const [formData, setFormData] = useState({
    Codigo: '',
    Descripcion: '',
    Tipo: 'porcentaje',
    Valor: '',
    Inicio: '',
    Fin: '',
    Requisitos: '',
    TipoAplicacion: 'categoria'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [createdPromotionId, setCreatedPromotionId] = useState(null);
  const [showAlojamientos, setShowAlojamientos] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateDates = (inicio, fin) => {
    const errors = {};
    
   
    const today = new Date();
    const todayString = today.getFullYear() + '-' + 
      String(today.getMonth() + 1).padStart(2, '0') + '-' + 
      String(today.getDate()).padStart(2, '0');

    if (!inicio) {
      errors.Inicio = 'La fecha de inicio es requerida';
    } else if (inicio < todayString) {
      errors.Inicio = 'La fecha de inicio no puede ser anterior a hoy';
    }

    if (!fin) {
      errors.Fin = 'La fecha de fin es requerida';
    } else if (inicio && fin <= inicio) {
      errors.Fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.Codigo.trim()) {
      errors.Codigo = 'El código es requerido';
    }

    if (!formData.Descripcion.trim()) {
      errors.Descripcion = 'La descripción es requerida';
    }

    if (!formData.Valor || formData.Valor <= 0) {
      errors.Valor = 'El valor debe ser mayor a 0';
    } else if (formData.Tipo === 'porcentaje' && formData.Valor > 100) {
      errors.Valor = 'El porcentaje no puede ser mayor a 100%';
    }

    const dateErrors = validateDates(formData.Inicio, formData.Fin);
    Object.assign(errors, dateErrors);

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores de validación cuando el usuario corrige
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Validar fechas en tiempo real
    if (name === 'Inicio' || name === 'Fin') {
      const newFormData = { ...formData, [name]: value };
      const dateErrors = validateDates(newFormData.Inicio, newFormData.Fin);
      setValidationErrors(prev => ({ 
        ...prev, 
        Inicio: dateErrors.Inicio || '', 
        Fin: dateErrors.Fin || '' 
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError(null);
    setValidationErrors({});

    try {
      const response = await PromocionService.createPromocion({
        Codigo: formData.Codigo,
        Descripcion: formData.Descripcion,
        Tipo: formData.Tipo,
        Valor: formData.Valor,
        Inicio: formData.Inicio,
        Fin: formData.Fin,
        Requisitos: formData.Requisitos
      });

      setCreatedPromotionId(response.data.ID);
      
      if (formData.TipoAplicacion === 'categoria') {
        setShowCategories(true);
      } else {
        setShowAlojamientos(true);
      }

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error al crear promoción');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    setFormData({
      Codigo: '',
      Descripcion: '',
      Tipo: 'porcentaje',
      Valor: '',
      Inicio: '',
      Fin: '',
      Requisitos: '',
      TipoAplicacion: 'categoria'
    });
    setCreatedPromotionId(null);
    setShowCategories(false);
    setShowAlojamientos(false);
    setError(null);
    setValidationErrors({});
    onClose();
  };

  const handleCategorySelected = () => {
    onPromotionCreated();
    handleCloseAll();
    
  };

  return (
    <>
      <Modal open={open} onClose={!loading ? handleCloseAll : undefined}>
        <Box sx={style}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            Crear Nueva Promoción
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Código de Promoción"
                  name="Codigo"
                  value={formData.Codigo}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Codigo}
                  helperText={validationErrors.Codigo}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label="Tipo de Descuento"
                  name="Tipo"
                  value={formData.Tipo}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                >
                  <MenuItem value="porcentaje">Porcentaje (%)</MenuItem>
                  <MenuItem value="monto">Monto fijo (₡)</MenuItem>
                </TextField>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={formData.Tipo === 'porcentaje' ? 'Valor (%)' : 'Monto (₡)'}
                  name="Valor"
                  type="number"
                  value={formData.Valor}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Valor}
                  helperText={validationErrors.Valor}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
                  <FormLabel component="legend">Aplicar a:</FormLabel>
                  <RadioGroup
                    row
                    aria-label="tipo-aplicacion"
                    name="TipoAplicacion"
                    value={formData.TipoAplicacion}
                    onChange={handleChange}
                  >
                    <FormControlLabel 
                      value="categoria" 
                      control={<Radio size="small" />} 
                      label="Categoría" 
                    />
                    <FormControlLabel 
                      value="alojamiento" 
                      control={<Radio size="small" />} 
                      label="Alojamiento"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Fecha de Inicio"
                  name="Inicio"
                  type="date"
                  value={formData.Inicio}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Inicio}
                  helperText={validationErrors.Inicio}
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Fecha de Fin"
                  name="Fin"
                  type="date"
                  value={formData.Fin}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Fin}
                  helperText={validationErrors.Fin}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Descripción"
                  name="Descripcion"
                  value={formData.Descripcion}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Descripcion}
                  helperText={validationErrors.Descripcion}
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Requisitos (Opcional)"
                  name="Requisitos"
                  value={formData.Requisitos}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                />
              </Grid>
            </Grid>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2,
              mt: 3,
              pt: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.12)'
            }}>
              <Button 
                onClick={handleCloseAll} 
                disabled={loading}
                variant="outlined"
                size="medium"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                disabled={loading}
                size="medium"
                sx={{ minWidth: 120 }}
              >
                {loading ? <CircularProgress size={24} /> : 'Siguiente'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {showCategories && createdPromotionId && (
        <ListCategories
          open={showCategories}
          onClose={() => setShowCategories(false)}
          promotionId={createdPromotionId}
          onSuccess={handleCategorySelected}
        />
      )}

      {showAlojamientos && createdPromotionId && (
        <ListAlojamientos
          open={showAlojamientos}
          onClose={() => setShowAlojamientos(false)}
          promotionId={createdPromotionId}
          onSuccess={handleCategorySelected}
        />
      )}
    </>
  );
};

CreatePromotion.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPromotionCreated: PropTypes.func.isRequired
};

export default CreatePromotion;