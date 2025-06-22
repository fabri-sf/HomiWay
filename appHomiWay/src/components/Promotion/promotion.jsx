import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import PromocionService from "../../services/PromocionService";

const Promotion = () => {
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Colores basados en el logo de HomiWay
  const colors = {
    primary: '#2E7D32', // Verde del logo
    secondary: '#4CAF50', // Verde más claro
    accent: '#1B5E20', // Verde oscuro
    background: '#F1F8E9', // Verde muy claro para fondo
    text: '#263238'
  };

  useEffect(() => {
    fetchPromociones();
  }, []);

  const fetchPromociones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Usar el PromocionService en lugar de fetch
      const response = await PromocionService.getPromotions();
      console.log('Respuesta del servicio:', response.data);
      setPromociones(response.data);
      
    } catch (err) {
      console.error('Error al cargar promociones:', err);
      let errorMessage = 'Error al cargar las promociones';
      
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

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatValue = (tipo, valor) => {
    if (!valor) return 'No especificado';
    
    if (tipo === 'porcentaje') {
      return `${valor}% OFF`;
    } else if (tipo === 'monto') {
      return `₡${Number(valor).toLocaleString()}`;
    }
    return valor;
  };

  const isPromocionActiva = (inicio, fin) => {
    if (!inicio || !fin) return false;
    
    const now = new Date();
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    
    // Verificar que las fechas sean válidas
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      return false;
    }
    
    return now >= fechaInicio && now <= fechaFin;
  };

  const handleAplicarDescuento = (promocion) => {
    // Aquí puedes implementar la lógica para aplicar el descuento
    console.log('Aplicar descuento:', promocion);
    // Por ejemplo, podrías abrir un modal o redirigir a otra página
    alert(`Promoción aplicada: ${promocion.Codigo}\nDescuento: ${formatValue(promocion.Tipo, promocion.Valor)}`);
  };

  const handleRetry = () => {
    fetchPromociones();
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="50vh"
      >
        <CircularProgress sx={{ color: colors.primary }} />
        <Typography variant="body1" sx={{ ml: 2, color: colors.text }}>
          Cargando promociones...
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
          color: colors.primary,
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4
        }}
      >
        Promociones Disponibles
      </Typography>

      {promociones.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No hay promociones disponibles en este momento
          </Typography>
          <Button 
            variant="outlined" 
            onClick={handleRetry}
            sx={{ mt: 2, color: colors.primary, borderColor: colors.primary }}
          >
            Actualizar
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {promociones.map((promocion) => (
            <Grid item xs={12} sm={6} md={4} key={promocion.ID}>
              <Card
                sx={{
                  minWidth: 275,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  border: `2px solid ${colors.secondary}`,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px rgba(46, 125, 50, 0.15)`,
                    borderColor: colors.primary
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography
                      gutterBottom
                      sx={{
                        color: colors.accent,
                        fontSize: 12,
                        fontWeight: 'bold',
                        textTransform: 'uppercase'
                      }}
                    >
                      Código: {promocion.Codigo || 'N/A'}
                    </Typography>
                    <Chip
                      label={promocion.Estado ? 'Activa' : 'Inactiva'}
                      size="small"
                      sx={{
                        backgroundColor: promocion.Estado ? colors.secondary : '#757575',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      color: colors.primary,
                      fontWeight: 'bold',
                      mb: 1
                    }}
                  >
                    {formatValue(promocion.Tipo, promocion.Valor)}
                  </Typography>

                  <Typography
                    sx={{
                      color: colors.text,
                      mb: 2,
                      fontSize: 14,
                      lineHeight: 1.4
                    }}
                  >
                    {promocion.Descripcion || 'Sin descripción disponible'}
                  </Typography>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      <strong>Válido desde:</strong> {formatDate(promocion.Inicio)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      <strong>Válido hasta:</strong> {formatDate(promocion.Fin)}
                    </Typography>
                  </Box>

                  {promocion.Requisitos && (
                    <Box
                      sx={{
                        backgroundColor: colors.background,
                        padding: 1.5,
                        borderRadius: 1,
                        mt: 2
                      }}
                    >
                      <Typography variant="caption" sx={{ color: colors.accent, fontWeight: 'bold' }}>
                        Requisitos:
                      </Typography>
                      <Typography variant="body2" sx={{ color: colors.text, fontSize: 12, mt: 0.5 }}>
                        {promocion.Requisitos}
                      </Typography>
                    </Box>
                  )}
                </CardContent>

                <CardActions sx={{ padding: 2, pt: 0 }}>
                  <Button
                    size="small"
                    variant="contained"
                    fullWidth
                    disabled={!promocion.Estado || !isPromocionActiva(promocion.Inicio, promocion.Fin)}
                    onClick={() => handleAplicarDescuento(promocion)}
                    sx={{
                      backgroundColor: colors.primary,
                      color: 'white',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      '&:hover': {
                        backgroundColor: colors.accent
                      },
                      '&:disabled': {
                        backgroundColor: '#BDBDBD',
                        color: '#757575'
                      }
                    }}
                  >
                    {promocion.Estado && isPromocionActiva(promocion.Inicio, promocion.Fin)
                      ? 'Aplicar Descuento'
                      : 'No Disponible'
                    }
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Promotion;