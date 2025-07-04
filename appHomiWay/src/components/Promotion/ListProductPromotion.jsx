import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTheme } from '@mui/material/styles';
import PromocionService from "../../services/PromocionService";
import PromotionProductDetail from './PromotionProductDetail';


const ProductosConPromociones = () => {
  const theme = useTheme();
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preciosCalculados, setPreciosCalculados] = useState({});
  const [selectedAlojamiento, setSelectedAlojamiento] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    fetchAlojamientosConPromociones();
  }, []);

  const fetchAlojamientosConPromociones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PromocionService.getAlojamientosConPromociones();
      setAlojamientos(response.data);
      await calcularPreciosConPromociones(response.data);
      
    } catch (err) {
      console.error('Error al cargar alojamientos con promociones:', err);
      let errorMessage = 'Error al cargar los productos con promociones';
      
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

  const calcularPreciosConPromociones = async (alojamientosData) => {
    const nuevosPreciosCalculados = {};
    
    const promesasCalculo = alojamientosData
      .filter(alojamiento => alojamiento.PromocionID)
      .map(async (alojamiento) => {
        try {
          const response = await PromocionService.calcularPrecio(
            alojamiento.PrecioNoche, 
            alojamiento.PromocionID
          );
          
          const key = `${alojamiento.AlojamientoID}-${alojamiento.PromocionID}`;
          nuevosPreciosCalculados[key] = {
            precioConDescuento: response.data.precioConDescuento,
            descuentoAplicado: response.data.descuentoAplicado,
            porcentajeDescuento: response.data.porcentajeDescuento,
            success: true
          };
        } catch (error) {
          console.error(`Error calculando precio para alojamiento ${alojamiento.AlojamientoID}:`, error);
          const key = `${alojamiento.AlojamientoID}-${alojamiento.PromocionID}`;
          nuevosPreciosCalculados[key] = {
            precioConDescuento: alojamiento.PrecioConDescuento || alojamiento.PrecioNoche,
            descuentoAplicado: 0,
            porcentajeDescuento: calcularDescuentoLocal(alojamiento.PrecioNoche, alojamiento.PrecioConDescuento),
            success: false,
            error: error.message
          };
        }
      });

    await Promise.all(promesasCalculo);
    setPreciosCalculados(nuevosPreciosCalculados);
  };

  const formatPrice = (price) => {
    if (!price) return '₡0';
    return `₡${Number(price).toLocaleString('es-CR')}`;
  };

  const obtenerPrecioCalculado = (alojamiento) => {
    if (!alojamiento.PromocionID) return null;
    
    const key = `${alojamiento.AlojamientoID}-${alojamiento.PromocionID}`;
    const precioCalculado = preciosCalculados[key];
    
    if (precioCalculado) {
      return {
        precioConDescuento: precioCalculado.precioConDescuento,
        porcentajeDescuento: precioCalculado.porcentajeDescuento,
        calculadoPorAPI: precioCalculado.success
      };
    }
    
    return {
      precioConDescuento: alojamiento.PrecioConDescuento || alojamiento.PrecioNoche,
      porcentajeDescuento: calcularDescuentoLocal(alojamiento.PrecioNoche, alojamiento.PrecioConDescuento),
      calculadoPorAPI: false
    };
  };

  const calcularDescuentoLocal = (precioOriginal, precioConDescuento) => {
    if (!precioOriginal || !precioConDescuento) return 0;
    const descuento = ((precioOriginal - precioConDescuento) / precioOriginal) * 100;
    return Math.round(descuento);
  };

  const determinarEstadoPromocion = (estadoPromocion) => {
    switch (estadoPromocion) {
      case 'Vigente':
        return { 
          color: theme.palette.success.main, 
          texto: 'Vigente',
          botonTexto: 'Utilizar',
          botonColor: 'success',
          activo: true
        };
      case 'Aplicado':
        return { 
          color: theme.palette.grey[500], 
          texto: 'Finalizado',
          botonTexto: 'Finalizado',
          botonColor: 'inherit',
          activo: false
        };
      case 'Pendiente':
        return { 
          color: theme.palette.warning.main, 
          texto: 'Pendiente',
          botonTexto: 'Próximamente',
          botonColor: 'warning',
          activo: false
        };
      default:
        return { 
          color: theme.palette.grey[500], 
          texto: 'Sin promoción',
          botonTexto: 'Sin promoción',
          botonColor: 'inherit',
          activo: false
        };
    }
  };

  const handleRetry = () => {
    fetchAlojamientosConPromociones();
  };

  const handleVerDetalles = (alojamiento) => {
  setSelectedAlojamiento(alojamiento);
  setModalOpen(true);
};


  const handleUtilizarPromocion = (alojamiento) => {
    console.log('Utilizando promoción para:', alojamiento);
    alert(`Promoción aplicada para: ${alojamiento.AlojamientoNombre}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
        <Typography variant="body1" sx={{ ml: 2, color: theme.palette.text.primary }}>
          Cargando productos con promociones...
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
            <Button color="inherit" size="small" onClick={handleRetry}>
              Reintentar
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
      <Typography variant="h4" component="h1" gutterBottom sx={{
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        textAlign: 'center',
        mb: 4
      }}>
        Productos con Promociones
      </Typography>

      {alojamientos.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No hay productos con promociones disponibles
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleRetry}
            sx={{ mt: 2, color: theme.palette.primary.main, borderColor: theme.palette.primary.main }}
          >
            Actualizar
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {alojamientos.map((alojamiento) => {
            const tienePromocion = !!alojamiento.PromocionID;
            const estadoPromocion = determinarEstadoPromocion(alojamiento.EstadoPromocion);
            const precioInfo = tienePromocion ? obtenerPrecioCalculado(alojamiento) : null;
            const descuentoPorcentaje = precioInfo?.porcentajeDescuento || 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={`${alojamiento.AlojamientoID}-${alojamiento.PromocionID || 'no-promo'}`}>
                <Card sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: `2px solid ${tienePromocion ? estadoPromocion.color : theme.palette.grey[300]}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  }
                }}>
                  {/* Badge de descuento */}
                  {tienePromocion && descuentoPorcentaje > 0 && (
                    <Box sx={{
                      position: 'absolute',
                      top: -5,
                      right: -5,
                      backgroundColor: estadoPromocion.color,
                      color: 'white',
                      borderRadius: '50%',
                      width: 50,
                      height: 50,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      zIndex: 1,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                    }}>
                      -{descuentoPorcentaje}%
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Nombre del alojamiento */}
                    <Typography variant="h6" component="div" sx={{
                      color: theme.palette.primary.main,
                      fontWeight: 'bold',
                      lineHeight: 1.2,
                      mb: 2
                    }}>
                      {alojamiento.AlojamientoNombre || 'Producto sin nombre'}
                    </Typography>

                    {/* Descripción */}
                    <Typography sx={{
                      color: theme.palette.text.primary,
                      mb: 2,
                      fontSize: 14,
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {alojamiento.Descripcion || 'Sin descripción disponible'}
                    </Typography>

                    {/* Información adicional */}
                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PersonIcon sx={{ fontSize: 16, color: theme.palette.primary.dark, mr: 1 }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                          Capacidad: {alojamiento.Capacidad || 'N/A'} personas
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <CategoryIcon sx={{ fontSize: 16, color: theme.palette.primary.dark, mr: 1 }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                          Categoría: {alojamiento.Categoria || 'Sin categoría'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Estado de promoción */}
                    {tienePromocion && (
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={estadoPromocion.texto}
                          size="small"
                          sx={{
                            backgroundColor: estadoPromocion.color,
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    )}

                    {/* Precios */}
                    <Box sx={{ mt: 'auto' }}>
                      {tienePromocion && precioInfo ? (
                        <Box>
                          <Typography variant="body2" sx={{
                            color: theme.palette.text.secondary,
                            textDecoration: 'line-through',
                            mb: 0.5
                          }}>
                            Precio anterior: {formatPrice(alojamiento.PrecioNoche)}
                          </Typography>
                          <Typography variant="h6" sx={{
                            color: theme.palette.success.dark,
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}>
                            Precio con promoción: {formatPrice(precioInfo.precioConDescuento)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="h6" sx={{
                          color: theme.palette.primary.main,
                          fontWeight: 'bold',
                          fontSize: '1.2rem'
                        }}>
                          Precio: {formatPrice(alojamiento.PrecioNoche)}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        por noche
                      </Typography>
                    </Box>
                  </CardContent>

                  {/* Acciones - Botones de utilizar y detalles */}
                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
                      {/* Botón de detalles */}
                      <IconButton 
                          aria-label="ver detalles" 
                          onClick={() => handleVerDetalles(alojamiento)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.light
                            }
                          }}
                        >
                        <VisibilityIcon />
                      </IconButton>
                      
                      {/* Botón principal (Utilizar/Finalizado/Próximamente) */}
                      {tienePromocion && (
                        <Button
                          fullWidth
                          variant="contained"
                          color={estadoPromocion.botonColor}
                          disabled={!estadoPromocion.activo}
                          onClick={() => estadoPromocion.activo && handleUtilizarPromocion(alojamiento)}
                          sx={{
                            fontWeight: 'bold',
                            textTransform: 'none',
                            flexGrow: 1,
                            '&:disabled': {
                              backgroundColor: theme.palette.grey[300],
                              color: theme.palette.grey[600]
                            }
                          }}
                        >
                          {estadoPromocion.botonTexto}
                        </Button>
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      <PromotionProductDetail
  open={modalOpen}
  onClose={() => setModalOpen(false)}
  alojamiento={selectedAlojamiento}
/>

    </Container>
  );
};

export default ProductosConPromociones;