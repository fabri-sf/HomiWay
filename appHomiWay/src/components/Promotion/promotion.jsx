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
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PromocionService from "../../services/PromocionService";




import PromotionDetail from './PromotionDetail';

const Promotion = () => {
  const theme = useTheme();
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);



  useEffect(() => {
    fetchPromociones();
  }, []);

  const fetchPromociones = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PromocionService.getPromotions();
      console.log('Respuesta del servicio:', response.data);
      setPromociones(response.data);
      
    } catch (err) {
      console.error('Error al cargar promociones:', err);
      let errorMessage = 'Error al cargar las promociones';
      
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

  const calcularEstadoDinamico = (inicio, fin) => {
    if (!inicio || !fin) return { estado: 'Sin fechas', color: theme.palette.custom.aplicado };
    
    const now = new Date();
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      return { estado: 'Fechas inválidas', color: theme.palette.custom.aplicado };
    }
    
    fechaFin.setHours(23, 59, 59, 999);
    
    if (now < fechaInicio) {
      return { estado: 'Pendiente', color: theme.palette.custom.pendiente };
    } else if (now >= fechaInicio && now <= fechaFin) {
      return { estado: 'Vigente', color: theme.palette.custom.vigente };
    } else {
      return { estado: 'Aplicado', color: theme.palette.custom.aplicado };
    }
  };

  const handleAplicarDescuento = (promocion) => {
    const estadoDinamico = calcularEstadoDinamico(promocion.Inicio, promocion.Fin);
    
    if (estadoDinamico.estado !== 'Vigente') {
      alert(`Esta promoción no está disponible. Estado: ${estadoDinamico.estado}`);
      return;
    }
    
    console.log('Aplicar descuento:', promocion);
    alert(`Promoción aplicada: ${promocion.Codigo}\nDescuento: ${formatValue(promocion.Tipo, promocion.Valor)}`);
  };

  

  const handleVerDetalles = (promocion) => {
    setSelectedPromotion(promocion);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedPromotion(null);
  };

  const handleEditar = (promocion) => {
    console.log('Editar promoción:', promocion);
    // Aquí puedes implementar la lógica para editar la promoción
    alert(`Editando promoción: ${promocion.Descripcion}`);
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
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
        <Typography variant="body1" sx={{ ml: 2, color: theme.palette.text.primary }}>
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
          color: theme.palette.primary.main,
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
          {promociones.map((promocion) => {
            const estadoDinamico = calcularEstadoDinamico(promocion.Inicio, promocion.Fin);
            
            return (
              <Grid item xs={12} sm={6} md={4} key={promocion.ID}>
                <Card
                  sx={{
                    minWidth: 275,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `2px solid ${theme.palette.secondary.main}`,
                    borderRadius: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 8px 25px rgba(46, 125, 50, 0.15)`,
                      borderColor: theme.palette.primary.main
                    }
                  }}
                >
                  <CardContent sx={{ flexGrow: 1 }}>
                    {/* Estado dinámico calculado */}
                    <Box display="flex" justifyContent="flex-end" mb={1}>
                      <Chip
                        label={estadoDinamico.estado}
                        size="small"
                        sx={{
                          backgroundColor: estadoDinamico.color,
                          color: estadoDinamico.estado === 'Aplicado' ? '#666' : 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>

                    {/* Valor/Descuento */}
                    <Typography
                      variant="h6"
                      component="div"
                      sx={{
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        mb: 1,
                        textAlign: 'center'
                      }}
                    >
                      {formatValue(promocion.Tipo, promocion.Valor)}
                    </Typography>

                    {/* Descripción */}
                    <Typography
                      sx={{
                        color: theme.palette.text.primary,
                        mb: 2,
                        fontSize: 14,
                        lineHeight: 1.4,
                        textAlign: 'center'
                      }}
                    >
                      {promocion.Descripcion || 'Sin descripción disponible'}
                    </Typography>

                    {/* Fechas de vigencia */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        <strong>Válido desde:</strong> {formatDate(promocion.Inicio)}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        <strong>Válido hasta:</strong> {formatDate(promocion.Fin)}
                      </Typography>
                    </Box>
                  </CardContent>

                  <CardActions sx={{ padding: 2, pt: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Box>
                        <IconButton 
                          aria-label="ver detalles" 
                          onClick={() => handleVerDetalles(promocion)}
                          sx={{
                            color: theme.palette.primary.main,
                            '&:hover': {
                              backgroundColor: theme.palette.primary.light
                            }
                          }}
                        >
                          <VisibilityIcon />
                        </IconButton>
                        <IconButton 
                          aria-label="editar" 
                          onClick={() => handleEditar(promocion)}
                          sx={{
                            color: theme.palette.secondary.main,
                            '&:hover': {
                              backgroundColor: theme.palette.secondary.light
                            }
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Box>
                      <Button
                        size="small"
                        variant="contained"
                        disabled={estadoDinamico.estado !== 'Vigente'}
                        onClick={() => handleAplicarDescuento(promocion)}
                        sx={{
                          backgroundColor: theme.palette.primary.main,
                          color: 'white',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: theme.palette.primary.dark
                          },
                          '&:disabled': {
                            backgroundColor: '#BDBDBD',
                            color: '#757575'
                          }
                        }}
                      >
                        {estadoDinamico.estado === 'Vigente'
                          ? 'Activar'
                          : estadoDinamico.estado === 'Pendiente'
                          ? 'Próximamente'
                          : 'No Disponible'
                        }
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
      <PromotionDetail
        open={modalOpen}
        onClose={handleCloseModal}
        promotion={selectedPromotion}
      />
    </Container>
  );
};

export default Promotion;