import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
  Chip,
  CircularProgress,
  Alert,
  Button,
  useTheme
} from '@mui/material';
import PedidoService from "../../services/PedidoService";

const ListPedido = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await PedidoService.getPedidos();
      console.log('Datos de pedidos:', response.data);
      setPedidos(response.data);
      
    } catch (err) {
      console.error('Error al cargar pedidos:', err);
      let errorMessage = 'Error al cargar los pedidos';
      
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
    if (!price) return '₡0';
    return `₡${Number(price).toLocaleString('es-CR')}`;
  };

  const getEstadoColor = (estado) => {
    switch(estado.toLowerCase()) {
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

  const handleVerDetalle = (pedidoId) => {
    navigate(`/pedido/${pedidoId}`);
  };

  const handleRetry = () => {
    fetchPedidos();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
        <Typography variant="body1" sx={{ ml: 2, color: theme.palette.text.primary }}>
          Cargando pedidos...
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
        Mis Pedidos
      </Typography>

      {pedidos.length === 0 ? (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No hay pedidos registrados
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
          {pedidos.map((pedido) => (
            <Grid item xs={12} key={pedido.ID}>
              <Card sx={{
                borderLeft: `4px solid ${getEstadoColor(pedido.Estado)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                }
              }}>
                <CardContent sx={{ position: 'relative' }}>
                  <Grid container spacing={2}>
                    {/* Columna 1: Número y Fecha */}
                    <Grid item xs={12} sm={4}>
                      <Typography variant="subtitle1" color="text.secondary">
                        Pedido # {pedido.ID}
                      </Typography>
                      <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                        {formatDate(pedido.Fecha)}
                      </Typography>
                    </Grid>

                    {/* Columna 2: Estado y Total */}
                    <Grid item xs={12} sm={4}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Chip
                          label={pedido.Estado}
                          size="small"
                          sx={{
                            backgroundColor: getEstadoColor(pedido.Estado),
                            color: 'white',
                            fontWeight: 'bold',
                            mr: 1
                          }}
                        />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(pedido.Total)}
                      </Typography>
                    </Grid>

                    {/* Columna 3: Acciones */}
                    <Grid item xs={12} sm={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        onClick={() => handleVerDetalle(pedido.ID)}
                        sx={{
                          color: theme.palette.primary.main,
                          borderColor: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                            color: 'white'
                          }
                        }}
                      >
                        Ver Detalle
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default ListPedido;