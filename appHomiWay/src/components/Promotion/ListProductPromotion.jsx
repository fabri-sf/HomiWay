import * as React from 'react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useNavigate } from "react-router-dom";

const ProductosConPromociones = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preciosCalculados, setPreciosCalculados] = useState({});
  const [selectedAlojamiento, setSelectedAlojamiento] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
   const navigate = useNavigate();

  useEffect(() => {
    fetchAlojamientosConPromociones();
  }, []);

  const fetchAlojamientosConPromociones = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await PromocionService.getAlojamientosConPromociones();

      // Filtrar para excluir promociones finalizadas/aplicadas
      const alojamientosFiltrados = response.data.filter(a => 
        a.EstadoPromocion !== 'Aplicado'
      );

      setAlojamientos(alojamientosFiltrados);
      await calcularPreciosConPromociones(alojamientosFiltrados);

    } catch (err) {
      console.error('Error al cargar alojamientos con promociones:', err);
      let errorMessage = t('productosConPromociones.errorLoad');

      if (err.response) {
        errorMessage = `${t('productosConPromociones.error')} ${err.response.status}: ${err.response.data?.message || t('productosConPromociones.errorServer')}`;
      } else if (err.request) {
        errorMessage = t('productosConPromociones.errorConnection');
      } else {
        errorMessage = err.message || t('productosConPromociones.errorUnknown');
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const calcularPreciosConPromociones = async (data) => {
    const nuevos = {};
    const promesas = data
      .filter(a => a.PromocionID)
      .map(async a => {
        try {
          const resp = await PromocionService.calcularPrecio(
            a.PrecioNoche, a.PromocionID
          );
          const key = `${a.AlojamientoID}-${a.PromocionID}`;
          nuevos[key] = {
            precioConDescuento: resp.data.precioConDescuento,
            descuentoAplicado: resp.data.descuentoAplicado,
            porcentajeDescuento: resp.data.porcentajeDescuento,
            success: true
          };
        } catch (error) {
          console.error(`Error calculando precio para alojamiento ${a.AlojamientoID}:`, error);
          const key = `${a.AlojamientoID}-${a.PromocionID}`;
          nuevos[key] = {
            precioConDescuento: a.PrecioConDescuento || a.PrecioNoche,
            descuentoAplicado: 0,
            porcentajeDescuento: calcularDescuentoLocal(a.PrecioNoche, a.PrecioConDescuento),
            success: false,
            error: error.message
          };
        }
      });

    await Promise.all(promesas);
    setPreciosCalculados(nuevos);
  };

  const formatPrice = (price) => {
    if (!price) return `₡0`;
    return `₡${Number(price).toLocaleString('es-CR')}`;
  };

  const obtenerPrecioCalculado = (alojamiento) => {
    if (!alojamiento.PromocionID) return null;
    const key = `${alojamiento.AlojamientoID}-${alojamiento.PromocionID}`;
    const info = preciosCalculados[key];
    if (info) {
      return {
        precioConDescuento: info.precioConDescuento,
        porcentajeDescuento: info.porcentajeDescuento,
        calculadoPorAPI: info.success
      };
    }
    return {
      precioConDescuento: alojamiento.PrecioConDescuento || alojamiento.PrecioNoche,
      porcentajeDescuento: calcularDescuentoLocal(alojamiento.PrecioNoche, alojamiento.PrecioConDescuento),
      calculadoPorAPI: false
    };
  };

  const calcularDescuentoLocal = (orig, desc) => {
    if (!orig || !desc) return 0;
    const pct = ((orig - desc) / orig) * 100;
    return Math.round(pct);
  };
    const determinarEstadoPromocion = (estado) => {
    switch (estado) {
      case 'Vigente':
        return {
          color: theme.palette.success.main,
          texto: t('productosConPromociones.stateActive'),
          botonTexto: t('productosConPromociones.btnUse'),
          botonColor: 'success',
          activo: true
        };
      case 'Pendiente':
        return {
          color: theme.palette.warning.main,
          texto: t('productosConPromociones.statePending'),
          botonTexto: t('productosConPromociones.btnComingSoon'),
          botonColor: 'warning',
          activo: false
        };
      default:
        return {
          color: theme.palette.grey[500],
          texto: t('productosConPromociones.stateNone'),
          botonTexto: t('productosConPromociones.stateNone'),
          botonColor: 'inherit',
          activo: false
        };
    }
  };

  const handleRetry = () => {
    fetchAlojamientosConPromociones();
  };

  const handleVerDetalles = (a) => {
    setSelectedAlojamiento(a);
    setModalOpen(true);
  };

  const handleUtilizarPromocion = (alojamiento) => {
  // Calcular el precio con descuento
  const noches = 1; // Valor inicial, se actualizará en el formulario
  const precioOriginal = alojamiento.PrecioNoche * noches;
  
  let precioConDescuento;
  if (alojamiento.Tipo === 'Porcentaje') {
    precioConDescuento = precioOriginal * (1 - alojamiento.Valor/100);
  } else {
    precioConDescuento = precioOriginal - alojamiento.Valor;
  }

  // Guardar en el estado/localStorage
  const promocionAplicada = {
    alojamientoId: alojamiento.AlojamientoID,
    promocionId: alojamiento.PromocionID,
    tipo: alojamiento.Tipo,
    valor: alojamiento.Valor,
    precioOriginal,
    precioConDescuento,
    noches
  };

  localStorage.setItem('promocionAplicada', JSON.stringify(promocionAplicada));
  
  // Navegar al formulario de reserva
  navigate(`/reserva-crear/${alojamiento.AlojamientoID}`);
};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
        <Typography variant="body1" sx={{ ml: 2, color: theme.palette.text.primary }}>
          {t('productosConPromociones.loadingText')}
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
              {t('productosConPromociones.buttonRetry')}
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
        {t('productosConPromociones.title')}
      </Typography>

      {alojamientos.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {t('productosConPromociones.noProducts')}
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
            {t('productosConPromociones.buttonRefresh')}
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {alojamientos.map(a => {
            const tienePromocion = !!a.PromocionID;
            const estado = determinarEstadoPromocion(a.EstadoPromocion);
            const precioInfo = tienePromocion ? obtenerPrecioCalculado(a) : null;
            const descuentoPct = precioInfo?.porcentajeDescuento || 0;

            return (
              <Grid item xs={12} sm={6} md={4} key={`${a.AlojamientoID}-${a.PromocionID || 'no-promo'}`}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${tienePromocion ? estado.color : theme.palette.grey[300]}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  {tienePromocion && descuentoPct > 0 && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: -5,
                        right: -5,
                        backgroundColor: estado.color,
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
                      -{descuentoPct}%
                    </Box>
                  )}

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        mb: 2
                      }}
                    >
                      {a.AlojamientoNombre || t('productosConPromociones.fallbackNoName')}
                    </Typography>

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
                      {a.Descripcion || t('productosConPromociones.fallbackNoDescription')}
                    </Typography>

                    <Box sx={{ mb: 2 }}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <PersonIcon sx={{ fontSize: 16, color: theme.palette.primary.dark, mr: 1 }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                          {`${t('productosConPromociones.labelCapacity')} ${a.Capacidad || t('productosConPromociones.na')} ${t('productosConPromociones.personas')}`}
                        </Typography>
                      </Box>

                      <Box display="flex" alignItems="center" mb={1}>
                        <CategoryIcon sx={{ fontSize: 16, color: theme.palette.primary.dark, mr: 1 }} />
                        <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>
                          {`${t('productosConPromociones.labelCategory')} ${a.Categoria || t('productosConPromociones.noCategory')}`}
                        </Typography>
                      </Box>
                    </Box>

                    {tienePromocion && (
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={estado.texto}
                          size="small"
                          sx={{
                            backgroundColor: estado.color,
                            color: 'white',
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    )}

                    <Box sx={{ mt: 'auto' }}>
                      {tienePromocion && precioInfo ? (
                        <Box>
                          <Typography
                            variant="body2"
                            sx={{
                              color: theme.palette.text.secondary,
                              textDecoration: 'line-through',
                              mb: 0.5
                            }}
                          >
                            {`${t('productosConPromociones.previousPrice')} ${formatPrice(a.PrecioNoche)}`}
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{
                              color: theme.palette.success.dark,
                              fontWeight: 'bold',
                              fontSize: '1.2rem'
                            }}
                          >
                            {`${t('productosConPromociones.promoPrice')} ${formatPrice(precioInfo.precioConDescuento)}`}
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
                          {`${t('productosConPromociones.labelPrice')} ${formatPrice(a.PrecioNoche)}`}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                        {t('productosConPromociones.perNight')}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ p: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', width: '100%', gap: 1 }}>
                      <IconButton
                        aria-label={t('productosConPromociones.ariaViewDetails')}
                        onClick={() => handleVerDetalles(a)}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light
                          }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>

                      {tienePromocion && (
                       <Button
  fullWidth
  variant="contained"
  color={estado.botonColor}
  disabled={!estado.activo}
  onClick={() => estado.activo && handleUtilizarPromocion(a)}
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
  {estado.botonTexto}
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