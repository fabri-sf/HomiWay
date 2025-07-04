import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Chip,
  useTheme
} from '@mui/material';
import {
  Receipt as ReceiptIcon,
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from '@mui/icons-material';
import PedidoService from "../../services/PedidoService";

const DetailPedido = () => {
  const theme = useTheme();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [facturaData, setFacturaData] = useState({
    encabezado: {},
    cliente: {},
    productos: [],
    productos_personalizados: [],
    resumen: {},
    metodo_pago: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFacturaCompleta();
  }, [id]);

  const fetchFacturaCompleta = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await PedidoService.getFacturaCompleta(id);
      setFacturaData(response.data);
    } catch (err) {
      let errorMessage = 'Error al cargar el detalle de la factura';
      if (err.response) {
        errorMessage = `Error ${err.response.status}: ${err.response.data?.message || 'Error del servidor'}`;
      } else if (err.request) {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      } else {
        errorMessage = err.message || 'Error desconocido';
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    if (!price) return '₡0.00';
    return `₡${Number(price).toLocaleString('es-CR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const getEstadoColor = (estado) => {
    switch (estado?.toLowerCase()) {
      case 'pendiente':
        return theme.palette.warning.main;
      case 'pagada':
        return theme.palette.success.main;
      case 'cancelada':
        return theme.palette.error.main;
      case 'en proceso':
        return theme.palette.info.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const handleVolver = () => {
    navigate('/pedidos');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
        <Typography variant="body1" sx={{ ml: 2, color: theme.palette.text.primary }}>
          Cargando detalle de la factura...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert 
          severity="error" 
          action={
            <Button color="inherit" size="small" onClick={handleVolver}>
              Volver al listado
            </Button>
          }
        >
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 3 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleVolver}
          sx={{
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main
          }}
        >
          Volver al listado
        </Button>
      </Box>

      <Card sx={{ boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <ReceiptIcon sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
            <Typography variant="h3" component="h1" sx={{ fontWeight: 'bold', color: theme.palette.primary.main }}>
              FACTURA
            </Typography>
            <Typography variant="h5" sx={{ color: theme.palette.text.secondary }}>
              # {facturaData.encabezado.numero_pedido || 'N/A'}
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <Grid container spacing={4} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CalendarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Información del Pedido
                  </Typography>
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Número de Pedido:</strong> {facturaData.encabezado.numero_pedido || 'N/A'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Fecha y Hora:</strong> {formatDate(facturaData.encabezado.fecha_emision)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <strong>Estado:</strong>
                    <Chip
                      label={facturaData.encabezado.estado || 'N/A'}
                      size="small"
                      sx={{
                        ml: 1,
                        backgroundColor: getEstadoColor(facturaData.encabezado.estado),
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 3, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <PersonIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Información del Cliente
                  </Typography>
                </Box>
                <Box sx={{ ml: 4 }}>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Nombre:</strong> {facturaData.cliente.nombre_completo || 'N/A'}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    <strong>Correo:</strong> {facturaData.cliente.correo || 'N/A'}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Teléfono:</strong> {facturaData.cliente.telefono || 'N/A'}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* Productos estándar */}
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main }}>
            Detalle de Productos
          </Typography>

          {facturaData.productos.length > 0 ? (
            <TableContainer component={Paper} sx={{ mb: 4 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: theme.palette.primary.light }}>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Producto</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Cantidad</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Precio Unitario</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {facturaData.productos.map((producto, index) => (
                    <TableRow key={`producto-${index}`}>
                      <TableCell>
                        <Typography fontWeight="bold">{producto.nombre || 'Producto sin nombre'}</Typography>
                        {producto.descripcion && (
                          <Typography variant="body2" color="text.secondary">
                            {producto.descripcion}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">{producto.cantidad || 0}</TableCell>
                      <TableCell align="right">{formatPrice(producto.precio_unitario)}</TableCell>
                      <TableCell align="right">{formatPrice(producto.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="body1" sx={{ mb: 4 }}>
              No hay productos registrados en este pedido.
            </Typography>
          )}

          {/* Productos personalizados */}
          {facturaData.productos_personalizados && facturaData.productos_personalizados.length > 0 ? (
            <>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: theme.palette.primary.main }}>
                Productos Personalizados (Servicios)
              </Typography>
              <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: theme.palette.secondary.light }}>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Servicio</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Detalles</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 'bold', color: 'white' }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {facturaData.productos_personalizados.map((servicio, index) => (
                      <TableRow key={`servicio-${index}`}>
                        <TableCell>
                          <Typography fontWeight="bold">{servicio.Nombre || 'Servicio sin nombre'}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {servicio.Descripcion || 'Sin descripción'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2"><strong>Duración:</strong> {servicio.Duracion || 'No especificada'}</Typography>
                          <Typography variant="body2"><strong>Idiomas:</strong> {servicio.Idiomas || 'No especificados'}</Typography>
                          <Typography variant="body2"><strong>Tipo:</strong> {servicio.Tipo || 'No especificado'}</Typography>
                        </TableCell>
                        <TableCell align="right">{formatPrice(servicio.Total)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          ) : (
            <Typography variant="body1" sx={{ mb: 4 }}>
              No hay productos personalizados en este pedido.
            </Typography>
          )}

          {/* Resumen */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Card variant="outlined" sx={{ p: 3, width: '100%', maxWidth: 400 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, textAlign: 'center', color: theme.palette.primary.main }}>
                Resumen del Pedido
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>{formatPrice(facturaData.resumen.subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Impuestos:</Typography>
                  <Typography>{formatPrice(facturaData.resumen.impuestos)}</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" fontWeight="bold">Total:</Typography>
                  <Typography variant="h6" fontWeight="bold">{formatPrice(facturaData.resumen.total)}</Typography>
                </Box>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="body1">
                  <strong>Método de Pago:</strong> {facturaData.metodo_pago.MetodoPago || 'No especificado'}
                </Typography>
              </Box>
              {facturaData.metodo_pago.banco && (
                <Typography variant="body2" sx={{ mt: 1, ml: 4 }}>
                  <strong>Banco:</strong> {facturaData.metodo_pago.banco}
                </Typography>
              )}
              {facturaData.metodo_pago.ultimos_digitos && (
                <Typography variant="body2" sx={{ mt: 1, ml: 4 }}>
                  <strong>Tarjeta terminada en:</strong> ****{facturaData.metodo_pago.ultimos_digitos}
                </Typography>
              )}
            </Card>
          </Box>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Gracias por su compra. Para cualquier consulta, contacte a nuestro servicio al cliente.
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Factura generada el {formatDate(new Date().toISOString())}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default DetailPedido;
