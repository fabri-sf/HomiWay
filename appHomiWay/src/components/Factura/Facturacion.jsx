import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import FacturaService from '../../services/FacturaService';
import {
  Typography,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Alert,
  CircularProgress,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Tooltip
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import ResumenFacturacion from './ResumenFacturacion';
import MetodoPagoFacturacion from './MetodoPagoFacturacion';

// Función para formatear números con 2 decimales y separadores de miles
const formatCurrency = (amount, t) => {
  const num = parseFloat(amount || 0);
  const currency = t('currency.symbol', '₡'); // Fallback al símbolo por defecto
  return new Intl.NumberFormat('es-CR', {
    style: 'currency',
    currency: 'CRC',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num).replace('CRC', currency);
};

// Función para convertir string a número con precisión
const toNumber = (value) => {
  return parseFloat(parseFloat(value || 0).toFixed(2));
};

export function Facturacion() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReservas, setSelectedReservas] = useState([]);
  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [total, setTotal] = useState(0);

  const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
  const userData = token ? jwtDecode(token) : null;
  const idUsuario = userData?.id || userData?.ID;
  const { t } = useTranslation();

  // Función para calcular totales con promoción aplicada
  const calcularTotalesConPromocion = (reserva) => {
    let precioAlojamiento = toNumber(reserva.PrecioNoche) * toNumber(reserva.Noches);
    let descuentoAplicado = 0;
    let tienePromocion = false;

    // Verificar si tiene promoción aplicada
    if (reserva.promocionAplicada) {
      tienePromocion = true;
      const promocion = reserva.promocionAplicada;
      
      if (promocion.tipo === 'Porcentaje') {
        descuentoAplicado = precioAlojamiento * (promocion.valor / 100);
      } else if (promocion.tipo === 'Monto') {
        descuentoAplicado = promocion.valor;
      }
      
      precioAlojamiento = Math.max(0, precioAlojamiento - descuentoAplicado);
    }

    const precioServicios = toNumber(reserva.TotalServicios || 0);
    const subtotal = precioAlojamiento + precioServicios;
    const impuesto = toNumber(subtotal * 0.13);
    const total = toNumber(subtotal + impuesto);

    return {
      precioAlojamiento: toNumber(precioAlojamiento),
      precioServicios: toNumber(precioServicios),
      subtotal: toNumber(subtotal),
      impuesto: toNumber(impuesto),
      total: toNumber(total),
      tienePromocion,
      descuentoAplicado: toNumber(descuentoAplicado),
      precioOriginal: toNumber(reserva.PrecioNoche) * toNumber(reserva.Noches)
    };
  };

  // Cargar reservas facturables
  useEffect(() => {
    const loadReservas = async () => {
      try {
        const response = await FacturaService.getReservasFacturables();
        console.log('Reservas cargadas:', response.data);
        
        // Procesar reservas para estructurar correctamente las promociones
        const reservasProcesadas = response.data?.map(reserva => {
          // Si tiene datos de promoción, estructurarlos correctamente
          if (reserva.PromocionID) {
            reserva.promocionAplicada = {
              id: reserva.PromocionID,
              tipo: reserva.PromocionTipo,
              valor: parseFloat(reserva.PromocionValor),
              codigo: reserva.PromocionCodigo,
              descripcion: reserva.PromocionDescripcion
            };
          }
          return reserva;
        }) || [];

        setReservas(reservasProcesadas);
      } catch (error) {
        toast.error(t('facturacion.errorCargandoReservas'));
        console.error('Error cargando reservas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadReservas();
  }, [t]);

  // Calcular total cuando cambian las reservas seleccionadas
  useEffect(() => {
    const totalCalculado = selectedReservas.reduce((sum, reserva) => {
      const totales = calcularTotalesConPromocion(reserva);
      return toNumber(sum + totales.total);
    }, 0);
    
    setTotal(totalCalculado);
  }, [selectedReservas]);

  // Manejar selección de reservas
  const handleSelectReserva = (reserva, checked) => {
    if (checked) {
      setSelectedReservas(prev => [...prev, reserva]);
    } else {
      setSelectedReservas(prev => prev.filter(r => r.ID !== reserva.ID));
    }
  };

  // Manejar selección de todas las reservas
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReservas([...reservas]);
    } else {
      setSelectedReservas([]);
    }
  };

  // Proceder al pago
  const handleProceedToPay = () => {
    if (selectedReservas.length === 0) {
      toast.error(t('facturacion.errorSeleccionarReserva'));
      return;
    }
    setOpenPaymentDialog(true);
  };

  // Función para recargar reservas después del pago
  const reloadReservas = async () => {
    try {
      const response = await FacturaService.getReservasFacturables();
      const reservasProcesadas = response.data?.map(reserva => {
        if (reserva.PromocionID) {
          reserva.promocionAplicada = {
            id: reserva.PromocionID,
            tipo: reserva.PromocionTipo,
            valor: parseFloat(reserva.PromocionValor),
            codigo: reserva.PromocionCodigo,
            descripcion: reserva.PromocionDescripcion
          };
        }
        return reserva;
      }) || [];
      setReservas(reservasProcesadas);
    } catch (error) {
      console.error('Error recargando reservas:', error);
    }
  };

  // Verificar autenticación después de todos los hooks
  if (!idUsuario) {
    return (
      <Box sx={{ padding: 4, textAlign: 'center' }}>
        <Alert severity="error">
          <Typography variant="h6">
            {t('facturacion.errorAutenticacion')}
          </Typography>
        </Alert>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', padding: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Toaster />
      <Box sx={{ padding: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('facturacion.titulo')}
        </Typography>

        {reservas.length === 0 ? (
          <Alert severity="info">
            <Typography>
              {t('facturacion.sinReservas')}
            </Typography>
          </Alert>
        ) : (
          <>
            <Paper sx={{ marginBottom: 3 }}>
              <Box sx={{ padding: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedReservas.length === reservas.length}
                      indeterminate={selectedReservas.length > 0 && selectedReservas.length < reservas.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  }
                  label={t('facturacion.seleccionarTodas')}
                />
              </Box>
              
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('facturacion.tabla.seleccionar')}</TableCell>
                    <TableCell>{t('facturacion.tabla.alojamiento')}</TableCell>
                    <TableCell>{t('facturacion.tabla.fechas')}</TableCell>
                    <TableCell>{t('facturacion.tabla.noches')}</TableCell>
                    <TableCell>{t('facturacion.tabla.precioAlojamiento')}</TableCell>
                    <TableCell>{t('facturacion.tabla.servicios')}</TableCell>
                    <TableCell>{t('facturacion.tabla.subtotal')}</TableCell>
                    <TableCell>{t('facturacion.tabla.impuesto')}</TableCell>
                    <TableCell>{t('facturacion.tabla.total')}</TableCell>
                    <TableCell>{t('facturacion.tabla.estado')}</TableCell>
                    <TableCell>{t('facturacion.tabla.detalles')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reservas.map((reserva) => {
                    const totales = calcularTotalesConPromocion(reserva);
                    const isSelected = selectedReservas.some(r => r.ID === reserva.ID);
                    
                    return (
                      <TableRow key={reserva.ID} selected={isSelected}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onChange={(e) => handleSelectReserva(reserva, e.target.checked)}
                          />
                        </TableCell>
                        <TableCell>{reserva.NombreAlojamiento}</TableCell>
                        <TableCell>
                          {reserva.Fecha_Inicio} - {reserva.Fecha_Fin}
                        </TableCell>
                        <TableCell>{reserva.Noches}</TableCell>
                        <TableCell>
                          {totales.tienePromocion ? (
                            <Tooltip title={`${t('facturacion.promocionAplicada')}: ${reserva.promocionAplicada.descripcion} | ${t('facturacion.codigo')}: ${reserva.promocionAplicada.codigo}`}>
                              <Box display="flex" flexDirection="column">
                                <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
                                  {formatCurrency(totales.precioOriginal, t)}
                                </Typography>
                                <Box display="flex" alignItems="center" gap={1}>
                                  <Chip 
                                    label={`${formatCurrency(totales.precioAlojamiento, t)}`}
                                    color="success"
                                    size="small"
                                  />
                                  <Chip 
                                    label={`-${formatCurrency(totales.descuentoAplicado, t)}`}
                                    color="error"
                                    size="small"
                                    variant="outlined"
                                  />
                                </Box>
                              </Box>
                            </Tooltip>
                          ) : (
                            formatCurrency(totales.precioAlojamiento, t)
                          )}
                        </TableCell>
                        <TableCell>
                          {totales.precioServicios > 0 ? (
                            <Chip 
                              label={`${formatCurrency(totales.precioServicios, t)} (${reserva.servicios?.length || 0} ${t('facturacion.tabla.servicios')})`}
                              size="small"
                              color="primary"
                            />
                          ) : (
                            <Chip label={t('facturacion.sinServicios')} size="small" variant="outlined" />
                          )}
                        </TableCell>
                        <TableCell>{formatCurrency(totales.subtotal, t)}</TableCell>
                        <TableCell>{formatCurrency(totales.impuesto, t)}</TableCell>
                        <TableCell><strong>{formatCurrency(totales.total, t)}</strong></TableCell>
                        <TableCell>
                          <Chip 
                            label={reserva.Estado}
                            color={reserva.Estado === 'Confirmado' ? 'success' : 'primary'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Box display="flex" flexDirection="column" gap={1}>
                            {/* Mostrar promoción si existe */}
                            {totales.tienePromocion && (
                              <Chip 
                                label={`${t('facturacion.promocion')}: ${reserva.promocionAplicada.codigo}`}
                                color="success"
                                size="small"
                                variant="outlined"
                              />
                            )}
                            
                            {/* Mostrar servicios si existen */}
                            {reserva.servicios && reserva.servicios.length > 0 && (
                              <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                  <Typography variant="body2">
                                    {t('facturacion.verServicios')} ({reserva.servicios.length})
                                  </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <List dense>
                                    {reserva.servicios.map((servicio, idx) => (
                                      <ListItem key={idx}>
                                        <ListItemText
                                          primary={servicio.NombreServicio}
                                          secondary={
                                            <Box>
                                              <Typography variant="body2" color="text.secondary">
                                                {servicio.Descripcion}
                                              </Typography>
                                              <Typography variant="body2" color="text.secondary">
                                                {t('facturacion.fecha')}: {servicio.Fecha_Inicio}
                                              </Typography>
                                              <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                                                {formatCurrency(servicio.Precio, t)}
                                              </Typography>
                                            </Box>
                                          }
                                        />
                                      </ListItem>
                                    ))}
                                  </List>
                                </AccordionDetails>
                              </Accordion>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>

            {/* Componente ResumenFacturacion */}
            <ResumenFacturacion
              selectedReservas={selectedReservas}
              total={total}
              onProceedToPay={handleProceedToPay}
              formatCurrency={(amount) => formatCurrency(amount, t)}
              calcularTotalesConPromocion={calcularTotalesConPromocion}
            />
          </>
        )}

        {/* Componente MetodoPagoFacturacion */}
        <MetodoPagoFacturacion
          open={openPaymentDialog}
          onClose={() => setOpenPaymentDialog(false)}
          total={total}
          selectedReservas={selectedReservas}
          idUsuario={idUsuario}
          onPaymentSuccess={() => {
            setSelectedReservas([]);
            reloadReservas();
          }}
          formatCurrency={(amount) => formatCurrency(amount, t)}
          toNumber={toNumber}
          calcularTotalesConPromocion={calcularTotalesConPromocion}
        />
      </Box>
    </>
  );
}

export default Facturacion;