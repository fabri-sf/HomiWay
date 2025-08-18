import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import FacturaService from '../../services/FacturaService';
import {
  Typography,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  FormControlLabel,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import toast from 'react-hot-toast';

// Validación Luhn para números de tarjeta
const validarNumeroTarjeta = (numero) => {
  const digits = numero.replace(/\D/g, '');
  let sum = 0;
  let shouldDouble = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  return sum % 10 === 0;
};

const MetodoPagoFacturacion = ({ 
  open, 
  onClose, 
  total, 
  selectedReservas, 
  idUsuario, 
  onPaymentSuccess, 
  formatCurrency, 
  toNumber 
}) => {
  const [metodoPago, setMetodoPago] = useState('tarjeta');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [vuelto, setVuelto] = useState(0);

  // Schema de validación para pago con tarjeta
  const schemaTargeta = yup.object({
    numeroTarjeta: yup
      .string()
      .required('Número de tarjeta requerido')
      .matches(/^\d{16}$/, 'El número debe tener 16 dígitos')
      .test('luhn', 'Número de tarjeta inválido', validarNumeroTarjeta),
    fechaExpiracion: yup
      .string()
      .required('Fecha de expiración requerida')
      .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato MM/AA')
      .test('future-date', 'La fecha debe ser futura', function(value) {
        if (!value) return false;
        const [month, year] = value.split('/');
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
        const now = new Date();
        return expiry > now;
      }),
    cvv: yup
      .string()
      .required('CVV requerido')
      .matches(/^\d{3,4}$/, 'CVV debe tener 3 o 4 dígitos'),
    nombreTitular: yup
      .string()
      .required('Nombre del titular requerido')
      .min(3, 'Mínimo 3 caracteres')
  });

  // Schema de validación para pago en efectivo
  const schemaEfectivo = yup.object({
    montoPago: yup
      .number()
      .typeError('Debe ser un número')
      .required('Monto de pago requerido')
      .positive('Debe ser positivo')
      .min(total, `Mínimo ₡${formatCurrency(total)}`)
  });

  const currentSchema = metodoPago === 'tarjeta' ? schemaTargeta : schemaEfectivo;

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: metodoPago === 'tarjeta' 
      ? {
          numeroTarjeta: '',
          fechaExpiracion: '',
          cvv: '',
          nombreTitular: ''
        }
      : {
          montoPago: ''
        },
    resolver: yupResolver(currentSchema)
  });

  const montoPago = watch('montoPago');

  // Calcular vuelto
  useEffect(() => {
    if (metodoPago === 'efectivo' && montoPago && total) {
      const vueltoCalculado = toNumber(montoPago) - toNumber(total);
      setVuelto(vueltoCalculado > 0 ? vueltoCalculado : 0);
    } else {
      setVuelto(0);
    }
  }, [montoPago, total, metodoPago, toNumber]);

  // Cambiar método de pago
  const handleMetodoPagoChange = (event) => {
    const newMetodo = event.target.value;
    setMetodoPago(newMetodo);
    reset(); // Limpiar formulario al cambiar método
  };

  // Procesar pago
  const onSubmit = async (dataForm) => {
    setProcessingPayment(true);
    
    try {
      // 1. Crear la factura
      const detallesFactura = selectedReservas.map(reserva => {
        const subtotal = toNumber(reserva.TotalAlojamiento);
        const impuesto = toNumber(subtotal * 0.13);
        const totalItem = toNumber(subtotal + impuesto);
        
        return {
          ID_Alojamiento: reserva.ID_Alojamiento,
          Cantidad: 1,
          PrecioUnitario: toNumber(reserva.PrecioNoche),
          Subtotal: subtotal,
          Impuesto: impuesto,
          Total: totalItem
        };
      });

      const facturaData = {
        ID_Usuario: idUsuario,
        Total: total,
        Detalles: detallesFactura
      };

      const facturaResponse = await FacturaService.createFactura(facturaData);
      const idFactura = facturaResponse.data.ID;

      // 2. Registrar el pago
      const pagoData = {
        ID_Factura: idFactura,
        Monto: total,
        MetodoPago: metodoPago === 'tarjeta' ? 'Tarjeta' : 'Efectivo'
      };

      if (metodoPago === 'tarjeta') {
        pagoData.Ultimos4_Digitos = dataForm.numeroTarjeta.slice(-4);
        pagoData.Fecha_Exp = `20${dataForm.fechaExpiracion.split('/')[1]}-${dataForm.fechaExpiracion.split('/')[0]}-01`;
        pagoData.Banco = 'Simulado';
      }

      await FacturaService.registrarPago(pagoData);

      // Éxito
      toast.success('Pago procesado exitosamente');
      onClose();
      onPaymentSuccess();
      
    } catch (error) {
      toast.error('Error procesando el pago');
      console.error('Error procesando pago:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  const onError = () => {
    toast.error('Por favor complete todos los campos requeridos');
  };

  // Reset form cuando se cierre el dialog
  const handleClose = () => {
    reset();
    setMetodoPago('tarjeta');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Procesar Pago</DialogTitle>
      
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <DialogContent>
          <Box sx={{ marginBottom: 3 }}>
            <Typography variant="h6" gutterBottom>
              Total a pagar: {formatCurrency(total)}
            </Typography>
          </Box>

          <FormControl component="fieldset" sx={{ marginBottom: 3 }}>
            <FormLabel component="legend">
              Método de Pago
            </FormLabel>
            <RadioGroup
              value={metodoPago}
              onChange={handleMetodoPagoChange}
            >
              <FormControlLabel
                value="tarjeta"
                control={<Radio />}
                label="Tarjeta de Crédito/Débito"
              />
              <FormControlLabel
                value="efectivo"
                control={<Radio />}
                label="Efectivo"
              />
            </RadioGroup>
          </FormControl>

          {metodoPago === 'tarjeta' ? (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="numeroTarjeta"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Número de Tarjeta"
                      placeholder="1234567890123456"
                      error={!!errors.numeroTarjeta}
                      helperText={errors.numeroTarjeta?.message}
                      inputProps={{ maxLength: 16 }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="nombreTitular"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Nombre del Titular"
                      error={!!errors.nombreTitular}
                      helperText={errors.nombreTitular?.message}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="fechaExpiracion"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Fecha de Expiración"
                      placeholder="MM/AA"
                      error={!!errors.fechaExpiracion}
                      helperText={errors.fechaExpiracion?.message}
                      inputProps={{ maxLength: 5 }}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          value = value.substring(0, 2) + '/' + value.substring(2, 4);
                        }
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <Controller
                  name="cvv"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="CVV"
                      placeholder="123"
                      error={!!errors.cvv}
                      helperText={errors.cvv?.message}
                      inputProps={{ maxLength: 4 }}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="montoPago"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type="number"
                      label="Monto con el que paga"
                      error={!!errors.montoPago}
                      helperText={errors.montoPago?.message}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  )}
                />
              </Grid>
              
              {vuelto > 0 && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    <Typography variant="h6">
                      Vuelto: {formatCurrency(vuelto)}
                    </Typography>
                  </Alert>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>

        <DialogActions>
          <Button 
            onClick={handleClose}
            disabled={processingPayment}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={processingPayment}
            startIcon={processingPayment && <CircularProgress size={20} />}
          >
            {processingPayment 
              ? 'Procesando...' 
              : 'Confirmar Pago'
            }
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

MetodoPagoFacturacion.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  total: PropTypes.number.isRequired,
  selectedReservas: PropTypes.array.isRequired,
  idUsuario: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onPaymentSuccess: PropTypes.func.isRequired,
  formatCurrency: PropTypes.func.isRequired,
  toNumber: PropTypes.func.isRequired
};

export default MetodoPagoFacturacion;