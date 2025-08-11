// src/components/Promotion/CreatePromotion.jsx

import React, { useState } from 'react';
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

const CreatePromotion = ({
  open = false,
  onClose = () => {},
  onPromotionCreated = () => {}
}) => {
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
  const [showCategories, setShowCategories] = useState(false);
  const [createdPromotionId, setCreatedPromotionId] = useState(null);
  const [showAlojamientos, setShowAlojamientos] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const validateDates = (inicio, fin) => {
    const errors = {};
    const today = new Date();
    const todayString =
      today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0');

    if (!inicio) {
      errors.Inicio = t('createPromotion.errorInicioRequired');
    } else if (inicio < todayString) {
      errors.Inicio = t('createPromotion.errorInicioPast');
    }

    if (!fin) {
      errors.Fin = t('createPromotion.errorFinRequired');
    } else if (inicio && fin <= inicio) {
      errors.Fin = t('createPromotion.errorFinAfterStart');
    }

    return errors;
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.Codigo.trim()) {
      errors.Codigo = t('createPromotion.errorCodigoRequired');
    }

    if (!formData.Descripcion.trim()) {
      errors.Descripcion = t('createPromotion.errorDescripcionRequired');
    }

    if (!formData.Valor || formData.Valor <= 0) {
      errors.Valor = t('createPromotion.errorValorPositive');
    } else if (formData.Tipo === 'porcentaje' && formData.Valor > 100) {
      errors.Valor = t('createPromotion.errorValorMax100');
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
      setError(
        err.response?.data?.message ||
        err.message ||
        t('createPromotion.errorCreate')
      );
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
            {t('createPromotion.title')}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('createPromotion.labelCodigo')}
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
                  label={t('createPromotion.labelTipoDescuento')}
                  name="Tipo"
                  value={formData.Tipo}
                  onChange={handleChange}
                  margin="normal"
                  size="small"
                >
                  <MenuItem value="porcentaje">
                    {t('createPromotion.optionPorcentaje')}
                  </MenuItem>
                  <MenuItem value="monto">
                    {t('createPromotion.optionMonto')}
                  </MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={
                    formData.Tipo === 'porcentaje'
                      ? t('createPromotion.labelValorPercent')
                      : t('createPromotion.labelValorAmount')
                  }
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
                  <FormLabel component="legend">
                    {t('createPromotion.legendApplyTo')}
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
                      label={t('createPromotion.radioCategoria')}
                    />
                    <FormControlLabel
                      value="alojamiento"
                      control={<Radio size="small" />}
                      label={t('createPromotion.radioAlojamiento')}
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('createPromotion.labelInicio')}
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
                  label={t('createPromotion.labelFin')}
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
                  label={t('createPromotion.labelDescripcion')}
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
                  label={t('createPromotion.labelRequisitos')}
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
                {t('createPromotion.btnCancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                size="medium"
                sx={{ minWidth: 120 }}
              >
                {loading
                  ? <CircularProgress size={24} />
                  : t('createPromotion.btnNext')}
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