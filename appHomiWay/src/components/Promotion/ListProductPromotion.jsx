import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Badge from '@mui/material/Badge';
import StarIcon from '@mui/icons-material/Star';
import PersonIcon from '@mui/icons-material/Person';
import CategoryIcon from '@mui/icons-material/Category';
import { useTheme } from '@mui/material/styles';
import PromocionService from "../../services/PromocionService";

const ProductosConPromociones = () => {
  const theme = useTheme();
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preciosCalculados, setPreciosCalculados] = useState({}); // Para almacenar precios calculados

  useEffect(() => {
    fetchAlojamientosConPromociones();
  }, []);

  const fetchAlojamientosConPromociones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar el PromocionService
      const response = await PromocionService.getAlojamientosConPromociones();
      console.log('Datos de alojamientos con promociones:', response.data);
      setAlojamientos(response.data);
      
      // Calcular precios para alojamientos con promociones
      await calcularPreciosConPromociones(response.data);
      
    } catch (err) {
      console.error('Error al cargar alojamientos con promociones:', err);
      let errorMessage = 'Error al cargar los productos con promociones';
      
      if (err.response) {
        // Error de respuesta del servidor
        errorMessage = `Error ${err.response.status}: ${err.response.data?.message || 'Error del servidor'}`;
      } else if (err.request) {
        // Error de red
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      } else {
        // Otro tipo de error
        errorMessage = err.message || 'Error desconocido';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para calcular precios usando la API
  const calcularPreciosConPromociones = async (alojamientosData) => {
    const nuevosPreciosCalculados = {};
    
    // Procesar alojamientos con promociones vigentes
    const promesasCalculo = alojamientosData
      .filter(alojamiento => alojamiento.PromocionID && alojamiento.EstadoPromocion === 'Vigente')
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
          
          console.log(`Precio calculado para ${alojamiento.AlojamientoNombre}:`, response.data);
        } catch (error) {
          console.error(`Error calculando precio para alojamiento ${alojamiento.AlojamientoID}:`, error);
          const key = `${alojamiento.AlojamientoID}-${alojamiento.PromocionID}`;
          nuevosPreciosCalculados[key] = {
            precioConDescuento: alojamiento.PrecioConDescuento || alojamiento.PrecioNoche,
            descuentoAplicado: 0,
            porcentajeDescuento: 0,
            success: false,
            error: error.message
          };
        }
      });

    // Esperar a que se completen todos los cálculos
    await Promise.all(promesasCalculo);
    setPreciosCalculados(nuevosPreciosCalculados);
  };

  const formatPrice = (price) => {
    if (!price) return '₡0';
    return `₡${Number(price).toLocaleString('es-CR')}`;
  };

  // Función para obtener el precio calculado o usar el valor por defecto
  const obtenerPrecioCalculado = (alojamiento) => {
    const key = `${alojamiento.AlojamientoID}-${alojamiento.PromocionID}`;
    const precioCalculado = preciosCalculados[key];
    
    if (precioCalculado && precioCalculado.success) {
      return {
        precioConDescuento: precioCalculado.precioConDescuento,
        porcentajeDescuento: precioCalculado.porcentajeDescuento,
        calculadoPorAPI: true
      };
    }
    
    // Fallback al cálculo local si la API falla
    const descuentoLocal = alojamiento.PrecioConDescuento ? 
      calcularDescuentoLocal(alojamiento.PrecioNoche, alojamiento.PrecioConDescuento) : 0;
    
    return {
      precioConDescuento: alojamiento.PrecioConDescuento || alojamiento.PrecioNoche,
      porcentajeDescuento: descuentoLocal,
      calculadoPorAPI: false
    };
  };

  // Mantener función de cálculo local como fallback
  const calcularDescuentoLocal = (precioOriginal, precioConDescuento) => {
    if (!precioOriginal || !precioConDescuento) return 0;
    const descuento = ((precioOriginal - precioConDescuento) / precioOriginal) * 100;
    return Math.round(descuento);
  };

  const determinarEstadoPromocion = (estadoPromocion) => {
    switch (estadoPromocion) {
      case 'Vigente':
        return { color: theme.palette.custom.vigente, texto: 'Vigente' };
      case 'Aplicado':
        return { color: theme.palette.custom.aplicado, texto: 'Aplicado' };
      case 'Pendiente':
        return { color: theme.palette.custom.pendiente, texto: 'Pendiente' };
      default:
        return { color: theme.palette.custom.aplicado, texto: 'Sin promoción' };
    }
  };

  const handleRetry = () => {
    fetchAlojamientosConPromociones();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
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
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{
          color: theme.palette.primary.main,
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4
        }}
      >
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
            sx={{ 
              mt: 2, 
              color: theme.palette.primary.main, 
              borderColor: theme.palette.primary.main 
            }}
          >
            Actualizar
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {alojamientos.map((alojamiento, index) => {
            const tienePromocion = alojamiento.PromocionID && alojamiento.EstadoPromocion === 'Vigente';
            const estadoPromocion = determinarEstadoPromocion(alojamiento.EstadoPromocion);
            
            // Usar el nuevo método para obtener precios calculados
            const precioInfo = tienePromocion ? obtenerPrecioCalculado(alojamiento) : null;
            const descuentoPorcentaje = precioInfo ? precioInfo.porcentajeDescuento : 0;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={`${alojamiento.AlojamientoID}-${index}`}>
                <Card
                  sx={{
                    minWidth: 275,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${tienePromocion ? theme.palette.custom.vigente : theme.palette.secondary.main}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(46, 125, 50, 0.15)',
                      borderColor: tienePromocion ? theme.palette.custom.vigente : theme.palette.primary.main
                    }
                  }}
                >
                  {/* Badge de descuento */}
                  {tienePromocion && descuentoPorcentaje > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        backgroundColor: theme.palette.custom.vigente,
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
                      }}
                    >
                      -{descuentoPorcentaje}%
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Nombre del Alojamiento */}
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        mb: 2,
                        lineHeight: 1.2
                      }}
                    >
                      {alojamiento.AlojamientoNombre || 'Producto sin nombre'}
                    </Typography>

                    {/* Descripción */}
                    <Typography
                      sx={{
                        color: theme.palette.text.primary,
                        mb: 2,
                        fontSize: 14,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
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

                    {/* Etiqueta si existe */}
                    {alojamiento.EtiquetaNombre && (
                      <Chip
                        label={alojamiento.EtiquetaNombre}
                        size="small"
                        sx={{
                          backgroundColor: theme.palette.background.default,
                          color: theme.palette.primary.dark,
                          mb: 2,
                          fontWeight: 'bold'
                        }}
                      />
                    )}

                    {/* Estado y código de promoción */}
                    {alojamiento.PromocionID && (
                      <Box sx={{ mb: 2 }}>
                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                          <Chip
                            label={estadoPromocion.texto}
                            size="small"
                            sx={{
                              backgroundColor: estadoPromocion.color,
                              color: estadoPromocion.texto === 'Aplicado' ? '#666' : 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          {alojamiento.Codigo && (
                            <Typography variant="caption" sx={{ 
                              color: theme.palette.primary.dark, 
                              fontWeight: 'bold' 
                            }}>
                              Código: {alojamiento.Codigo}
                            </Typography>
                          )}
                        </Box>
                        
                        {alojamiento.PromocionDescripcion && (
                          <Typography variant="caption" sx={{ 
                            color: theme.palette.text.primary, 
                            fontStyle: 'italic' 
                          }}>
                            {alojamiento.PromocionDescripcion}
                          </Typography>
                        )}

                        {/* Indicador de cálculo API */}
                        {tienePromocion && precioInfo && (
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: precioInfo.calculadoPorAPI ? theme.palette.secondary.main : theme.palette.custom.precioOriginal,
                              display: 'block',
                              fontSize: '0.7rem',
                              mt: 0.5
                            }}
                          >
                            {precioInfo.calculadoPorAPI ? '✓ Precio calculado por API' : '⚠ Precio local (API no disponible)'}
                          </Typography>
                        )}
                      </Box>
                    )}

                    {/* Precios */}
                    <Box sx={{ mt: 'auto' }}>
                      {tienePromocion && precioInfo ? (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.custom.precioOriginal,
                              textDecoration: 'line-through',
                              mb: 0.5
                            }}
                          >
                            Precio anterior: {formatPrice(alojamiento.PrecioNoche)}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.custom.precioDescuento,
                              fontWeight: 'bold',
                              fontSize: '1.2rem'
                            }}
                          >
                            Precio con promoción: {formatPrice(precioInfo.precioConDescuento)}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography
                          variant="h6"
                          sx={{
                            color: theme.palette.primary.main,
                            fontWeight: 'bold',
                            fontSize: '1.2rem'
                          }}
                        >
                          Precio: {formatPrice(alojamiento.PrecioNoche)}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: theme.palette.text.primary }}>
                        por noche
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
};

export default ProductosConPromociones;