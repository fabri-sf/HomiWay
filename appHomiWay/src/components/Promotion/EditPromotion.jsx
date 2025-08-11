// src/components/Promotion/EditPromotion.jsx

import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, Button, TextField, 
  MenuItem, Alert, CircularProgress, Radio, 
  RadioGroup, FormControlLabel, FormControl, FormLabel, Grid
} from '@mui/material';
import ListCategories from './ListCategorias';
import ListAlojamientos from './ListAlojamientos';
import PromocionService from '../../services/PromocionService';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

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

const EditPromotion = ({ open, onClose, promotion, onPromotionUpdated }) => {
  const { t } = useTranslation();
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
  const [validationErrors, setValidationErrors] = useState({});
  const [showCategories, setShowCategories] = useState(false);
  const [showAlojamientos, setShowAlojamientos] = useState(false);
  const [promotionUpdated, setPromotionUpdated] = useState(false);

  // Cargar datos de la promoción cuando se abre el modal
  useEffect(() => {
    if (promotion && open) {
      setFormData({
        Codigo: promotion.Codigo || '',
        Descripcion: promotion.Descripcion || '',
        Tipo: promotion.Tipo || 'porcentaje',
        Valor: promotion.Valor || '',
        Inicio: promotion.Inicio?.split('T')[0] || '',
        Fin: promotion.Fin?.split('T')[0] || '',
        Requisitos: promotion.Requisitos || '',
        TipoAplicacion: 'categoria' 
      });
      setValidationErrors({});
      setError(null);
      setPromotionUpdated(false);
    }
  }, [promotion, open]);

  const validateDates = (inicio, fin) => {
    const errors = {};
    const today = new Date();
    const todayString = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

    if (!inicio) {
      errors.Inicio = t('editPromotion.errorInicioRequired');
    } else if (inicio < todayString) {
      errors.Inicio = t('editPromotion.errorInicioPast');
    }

    if (!fin) {
      errors.Fin = t('editPromotion.errorFinRequired');
    } else if (inicio && fin <= inicio) {
      errors.Fin = t('editPromotion.errorFinAfterStart');
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.Codigo.trim()) {
      errors.Codigo = t('editPromotion.errorCodigoRequired');
    }

    if (!formData.Descripcion.trim()) {
      errors.Descripcion = t('editPromotion.errorDescripcionRequired');
    }

    if (!formData.Valor || formData.Valor <= 0) {
      errors.Valor = t('editPromotion.errorValorPositive');
    } else if (formData.Tipo === 'porcentaje' && formData.Valor > 100) {
      errors.Valor = t('editPromotion.errorValorMax100');
    }

    Object.assign(errors, validateDates(formData.Inicio, formData.Fin));

    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'Inicio' || name === 'Fin') {
      const newForm = { ...formData, [name]: value };
      const dateErr = validateDates(newForm.Inicio, newForm.Fin);
      setValidationErrors(prev => ({
        ...prev,
        Inicio: dateErr.Inicio || '',
        Fin: dateErr.Fin || ''
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
      const updatedData = {
        Codigo: formData.Codigo,
        Descripcion: formData.Descripcion,
        Tipo: formData.Tipo,
        Valor: formData.Valor,
        Inicio: formData.Inicio,
        Fin: formData.Fin,
        Requisitos: formData.Requisitos,
        EliminarAsociaciones: true 
      };

      await PromocionService.updatePromocion(promotion.ID, updatedData);
      setPromotionUpdated(true);

      if (formData.TipoAplicacion === 'categoria') {
        setShowCategories(true);
      } else {
        setShowAlojamientos(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        t('editPromotion.errorUpdate')
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAll = () => {
    setError(null);
    setValidationErrors({});
    setShowCategories(false);
    setShowAlojamientos(false);
    setPromotionUpdated(false);
    onClose();
  };

  const handleCategorySelected = () => {
    onPromotionUpdated();
    handleCloseAll();
  };

  const handleAlojamientoSelected = () => {
    onPromotionUpdated();
    handleCloseAll();
  };

  const handleModalClose = () => {
    if (promotionUpdated) {
      onPromotionUpdated();
    }
    handleCloseAll();
  };

  return (
    <>
      <Modal open={open} onClose={!loading ? handleModalClose : undefined}>
        <Box sx={style}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            {t('editPromotion.title')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {promotionUpdated && (
            <Alert severity="info" sx={{ mb: 3 }}>
              {t('editPromotion.updatedInfo')}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('editPromotion.labelCodigo')}
                  name="Codigo"
                  value={formData.Codigo}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Codigo}
                  helperText={validationErrors.Codigo}
                  disabled={promotionUpdated}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  label={t('editPromotion.labelTipoDescuento')}
                  name="Tipo"
                  value={formData.Tipo}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  disabled={promotionUpdated}
                >
                  <MenuItem value="porcentaje">
                    {t('editPromotion.optionPorcentaje')}
                  </MenuItem>
                  <MenuItem value="monto">
                    {t('editPromotion.optionMonto')}
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={
                    formData.Tipo === 'porcentaje'
                      ? t('editPromotion.labelValorPercent')
                      : t('editPromotion.labelValorAmount')
                  }
                  name="Valor"
                  type="number"
                  value={formData.Valor}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Valor}
                  helperText={validationErrors.Valor}
                  disabled={promotionUpdated}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset" fullWidth sx={{ mt: 2 }}>
                  <FormLabel component="legend">
                    {t('editPromotion.legendApplyTo')}
                  </FormLabel>
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
                      label={t('editPromotion.radioCategoria')}
                      disabled={promotionUpdated}
                    />
                    <FormControlLabel
                      value="alojamiento"
                      control={<Radio size="small" />}
                      label={t('editPromotion.radioAlojamiento')}
                      disabled={promotionUpdated}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('editPromotion.labelInicio')}
                  name="Inicio"
                  type="date"
                  value={formData.Inicio}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Inicio}
                  helperText={validationErrors.Inicio}
                  disabled={promotionUpdated}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('editPromotion.labelFin')}
                  name="Fin"
                  type="date"
                  value={formData.Fin}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Fin}
                  helperText={validationErrors.Fin}
                  disabled={promotionUpdated}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label={t('editPromotion.labelDescripcion')}
                  name="Descripcion"
                  value={formData.Descripcion}
                  onChange={handleChange}
                  multiline
                  rows={2}
                  margin="normal"
                  size="small"
                  error={!!validationErrors.Descripcion}
                  helperText={validationErrors.Descripcion}
                  disabled={promotionUpdated}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label={t('editPromotion.labelRequisitos')}
                  name="Requisitos"
                  value={formData.Requisitos}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                  disabled={promotionUpdated}
                />
              </Grid>
            </Grid>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                mt: 3,
                pt: 2,
                borderTop: '1px solid rgba(0, 0, 0, 0.12)'
              }}
            >
              <Button
                onClick={handleModalClose}
                disabled={loading}
                variant="outlined"
                size="medium"
              >
                {promotionUpdated
                  ? t('editPromotion.btnClose')
                  : t('editPromotion.btnCancel')}
              </Button>

              {!promotionUpdated && (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  size="medium"
                  sx={{ minWidth: 120 }}
                >
                  {loading
                    ? <CircularProgress size={24} />
                    : t('editPromotion.btnNext')}
                </Button>
              )}

              {promotionUpdated && (
                <>
                  <Button
                    onClick={() => setShowCategories(true)}
                    variant="contained"
                    size="medium"
                    sx={{ minWidth: 120 }}
                    disabled={formData.TipoAplicacion !== 'categoria'}
                  >
                    {t('editPromotion.btnSelectCategories')}
                  </Button>
                  <Button
                    onClick={() => setShowAlojamientos(true)}
                    variant="contained"
                    size="medium"
                    sx={{ minWidth: 120 }}
                    disabled={formData.TipoAplicacion !== 'alojamiento'}
                  >
                    {t('editPromotion.btnSelectAlojamientos')}
                  </Button>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Modal>

      {showCategories && promotion && (
        <ListCategories
          open={showCategories}
          onClose={() => setShowCategories(false)}
          promotionId={promotion.ID}
          onSuccess={handleCategorySelected}
        />
      )}

      {showAlojamientos && promotion && (
        <ListAlojamientos
          open={showAlojamientos}
          onClose={() => setShowAlojamientos(false)}
          promotionId={promotion.ID}
          onSuccess={handleAlojamientoSelected}
        />
      )}
    </>
  );
};

EditPromotion.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  promotion: PropTypes.object,
  onPromotionUpdated: PropTypes.func.isRequired
};

export default EditPromotion;