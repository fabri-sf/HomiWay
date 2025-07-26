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
import AddIcon from '@mui/icons-material/Add';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import PromocionService from "../../services/PromocionService";
import PromotionDetail from './PromotionDetail';
import CreatePromotion from './CreatePromotion';
import EditPromotion from './EditPromotion';


const Promotion = () => {
  const theme = useTheme();
  const [promociones, setPromociones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [promotionToEdit, setPromotionToEdit] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('todos');

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
  
  try {
    // Separar la fecha en sus componentes para evitar problemas de zona horaria
    const [year, month, day] = dateString.split('T')[0].split('-');
    
    // Crear la fecha usando los componentes individuales (mes - 1 porque JavaScript cuenta desde 0)
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    if (isNaN(date.getTime())) return 'Fecha inválida';
    
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long', 
      day: 'numeric'
    });
  } catch {
    return 'Fecha inválida';
  }
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

 // También necesitas corregir la función calcularEstadoDinamico
const calcularEstadoDinamico = (inicio, fin) => {
  if (!inicio || !fin) return { estado: 'Sin fechas', color: theme.palette.custom.aplicado };
  
  try {
    const now = new Date();
    
    // Separar las fechas en componentes para evitar problemas de zona horaria
    const [yearInicio, monthInicio, dayInicio] = inicio.split('T')[0].split('-');
    const [yearFin, monthFin, dayFin] = fin.split('T')[0].split('-');
    
    // Crear las fechas usando componentes individuales
    const fechaInicio = new Date(parseInt(yearInicio), parseInt(monthInicio) - 1, parseInt(dayInicio));
    const fechaFin = new Date(parseInt(yearFin), parseInt(monthFin) - 1, parseInt(dayFin));
    
    if (isNaN(fechaInicio.getTime()) || isNaN(fechaFin.getTime())) {
      return { estado: 'Fechas inválidas', color: theme.palette.custom.aplicado };
    }
    
    // Establecer la hora final del día para la fecha de fin
    fechaFin.setHours(23, 59, 59, 999);
    
    // Comparar solo las fechas (sin horas) para el inicio
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const inicioDate = new Date(fechaInicio.getFullYear(), fechaInicio.getMonth(), fechaInicio.getDate());
    
    if (nowDate < inicioDate) {
      return { estado: 'Pendiente', color: theme.palette.custom.pendiente };
    } else if (now >= fechaInicio && now <= fechaFin) {
      return { estado: 'Vigente', color: theme.palette.custom.vigente };
    } else {
      return { estado: 'Aplicado', color: theme.palette.custom.aplicado };
    }
  } catch {
    return { estado: 'Error en fechas', color: theme.palette.custom.aplicado };
  }
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
    setPromotionToEdit(promocion);
    setShowEditModal(true);
  };

  const handlePromotionCreated = () => {
    
    console.log('Promoción creada exitosamente');
      // Recargar la lista de promociones
  fetchPromociones();
  // Cerrar el modal de creación
  setShowCreateModal(false);
  };

  const handleCrearPromocion = () => {
    setShowCreateModal(true);
    // Aquí puedes implementar la lógica para abrir un formulario de creación
    // alert('Funcionalidad de crear nueva promoción');
  };

  const handleRetry = () => {
    fetchPromociones();
  };

  const handleFiltroChange = (event) => {
    setFiltroEstado(event.target.value);
  };

  // Filtrar promociones según el estado seleccionado
  const promocionesFiltradas = promociones.filter((promocion) => {
    if (filtroEstado === 'todos') return true;
    const estadoDinamico = calcularEstadoDinamico(promocion.Inicio, promocion.Fin);
    return estadoDinamico.estado.toLowerCase() === filtroEstado;
  });

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
      {/* Sección del título con botón de crear */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4,
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{
            color: theme.palette.primary.main,
            fontWeight: 'bold',
          }}
        >
          Promociones Disponibles
        </Typography>
        
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCrearPromocion}
          sx={{
            backgroundColor: theme.palette.success.main,
            color: 'white',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: theme.palette.success.dark,
            },
            minWidth: '200px',
            height: '48px'
          }}
        >
          Crear Promoción
        </Button>

        <CreatePromotion
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onPromotionCreated={handlePromotionCreated}
        />
      </Box>

      {/* Filtro por estado */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="filtro-estado-label">Filtrar por Estado</InputLabel>
          <Select
            labelId="filtro-estado-label"
            id="filtro-estado"
            value={filtroEstado}
            label="Filtrar por Estado"
            onChange={handleFiltroChange}
          >
            <MenuItem value="todos">Todos</MenuItem>
            <MenuItem value="vigente">Vigente</MenuItem>
            <MenuItem value="pendiente">Pendiente</MenuItem>
            <MenuItem value="aplicado">Aplicado</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {promocionesFiltradas.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {filtroEstado === 'todos' 
              ? 'No hay promociones disponibles en este momento'
              : `No hay promociones con estado "${filtroEstado}"`
            }
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
            <Button 
              variant="outlined" 
              onClick={handleRetry}
              sx={{ 
                color: theme.palette.primary.main, 
                borderColor: theme.palette.primary.main 
              }}
            >
              Actualizar
            </Button>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={handleCrearPromocion}
              sx={{ 
                backgroundColor: theme.palette.success.main,
                '&:hover': {
                  backgroundColor: theme.palette.success.dark,
                }
              }}
            >
              Crear Promoción
            </Button>
          </Box>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {promocionesFiltradas.map((promocion) => {
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', width: '100%' }}>
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
                      {/* Solo mostrar el botón de editar si el estado no es 'Aplicado' */}
                      {estadoDinamico.estado !== 'Aplicado' && (
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
                      )}
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {showEditModal && (
        <EditPromotion
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          promotion={promotionToEdit}
          onPromotionUpdated={() => {
            fetchPromociones(); // Recargar la lista
            setShowEditModal(false);
          }}
        />
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