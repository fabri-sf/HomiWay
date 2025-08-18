import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Modal, Box, Typography, Button, TextField, Grid,
  Alert, CircularProgress, Card, CardMedia, CardContent, Divider
} from '@mui/material';
import AlojamientoService from '../../services/AlojamientoService';
import ReservaService from '../../services/ReservaService';
import { useTranslation } from 'react-i18next';
import { jwtDecode } from 'jwt-decode';
import toast, { Toaster } from 'react-hot-toast';

// Importar los componentes separados
import ServicesSection from './ServicesSection';
import ReservationSuccessModal from './ReservationSuccessModal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '90%', md: '800px' },
  maxWidth: '95vw',
  maxHeight: '90vh',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: { xs: 2, sm: 3, md: 4 },
  borderRadius: 2,
  overflowY: 'auto'
};

const CreateReserva = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  
  const [alojamiento, setAlojamiento] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [reservaCreada, setReservaCreada] = useState(null);
  

  
  const [formData, setFormData] = useState({
    Fecha_Inicio: '',
    Fecha_Fin: '',
    serviciosSeleccionados: [],
    noches: 0,
  });

    const calcularNoches = (fechaInicio, fechaFin) => {
    if (!fechaInicio || !fechaFin) return 0;
    const diffTime = new Date(fechaFin) - new Date(fechaInicio);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

// Al inicio del componente, obtener la promoción si existe
const [promocionAplicada, setPromocionAplicada] = useState(null);

useEffect(() => {
  const promocionGuardada = localStorage.getItem('promocionAplicada');
  if (promocionGuardada) {
    setPromocionAplicada(JSON.parse(promocionGuardada));
    localStorage.removeItem('promocionAplicada'); // Limpiar después de usar
  }
}, []);

// Modificar la función calcularPrecioTotal
const calcularPrecioTotal = () => {
  if (!alojamiento || !formData.Fecha_Inicio || !formData.Fecha_Fin) return 0;
  
  const noches = calcularNoches(formData.Fecha_Inicio, formData.Fecha_Fin);
  let precioAlojamiento = parseFloat(alojamiento.PrecioNoche) * noches;
  
  // Aplicar descuento si hay promoción
  if (promocionAplicada && promocionAplicada.alojamientoId === alojamiento.ID) {
    if (promocionAplicada.tipo === 'Porcentaje') {
      precioAlojamiento = precioAlojamiento * (1 - promocionAplicada.valor/100);
    } else {
      precioAlojamiento = precioAlojamiento - promocionAplicada.valor;
    }
  }
  
  const precioServicios = formData.serviciosSeleccionados.reduce(
    (total, servicio) => total + parseFloat(servicio.Precio), 0
  );
  
  return precioAlojamiento + precioServicios;
};

  // Actualizar noches cuando cambien las fechas
  useEffect(() => {
    if (formData.Fecha_Inicio && formData.Fecha_Fin) {
      const noches = calcularNoches(formData.Fecha_Inicio, formData.Fecha_Fin);
      setFormData(prev => ({ ...prev, noches }));
    }
  }, [formData.Fecha_Inicio, formData.Fecha_Fin]);

  // Función para obtener el usuario autenticado
  const getCurrentUser = () => {
    try {
      const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
      if (!token) {
        return null;
      }
      
      try {
        const decoded = jwtDecode(token);
        return {
          ID: decoded.id || decoded.ID,
          ...decoded
        };
      } catch {
        try {
          const userData = JSON.parse(token);
          return userData;
        } catch (jsonError) {
          console.error('Error parsing user data:', jsonError);
          return null;
        }
      }
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  };

  // Verificar autenticación al cargar
  useEffect(() => {
    const user = getCurrentUser();
    if (!user || !user.ID) {
      setError(t('reserva.errors.userNotAuthenticated'));
      return;
    }
  }, []);

  // Cargar datos del alojamiento y servicios
  useEffect(() => {
    if (id) {
      loadAlojamientoData();
    }
  }, [id]);
  

  const loadAlojamientoData = async () => {
    try {
      setLoading(true);
      const response = await AlojamientoService.getAlojamientoById(id);
      setAlojamiento(response.data);
      setServicios(response.data.servicios || []);
      setError(null);
    } catch (err) {
      setError(err.message || t("reserva.errors.loadAlojamiento"));
    } finally {
      setLoading(false);
    }
  };

  // Validar fechas
  const validateDates = (inicio, fin) => {
    const errors = {};
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];

    if (!inicio) {
      errors.Fecha_Inicio = t('reserva.errors.fechaInicioRequired');
    } else if (inicio < todayString) {
      errors.Fecha_Inicio = t('reserva.errors.fechaInicioPast');
    }

    if (!fin) {
      errors.Fecha_Fin = t('reserva.errors.fechaFinRequired');
    } else if (inicio && fin <= inicio) {
      errors.Fecha_Fin = t('reserva.errors.fechaFinAfterStart');
    }

    return errors;
  };

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'Fecha_Inicio' || name === 'Fecha_Fin') {
      const newForm = { ...formData, [name]: value };
      const dateErrors = validateDates(newForm.Fecha_Inicio, newForm.Fecha_Fin);
      setValidationErrors(prev => ({
        ...prev,
        Fecha_Inicio: dateErrors.Fecha_Inicio || '',
        Fecha_Fin: dateErrors.Fecha_Fin || ''
      }));

      if (name === 'Fecha_Inicio' || name === 'Fecha_Fin') {
        setFormData(prev => ({ ...prev, serviciosSeleccionados: [] }));
      }
    }
  };

  // Manejar selección de servicios
  const handleServiceSelection = (servicio, isSelected) => {
    if (isSelected) {
      setFormData(prev => ({
        ...prev,
        serviciosSeleccionados: [
          ...prev.serviciosSeleccionados,
          {
            ID_Servicio: servicio.ID,
            Fecha_Inicio: formData.Fecha_Inicio,
            NombreServicio: servicio.Nombre,
            Precio: servicio.Precio
          }
        ]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        serviciosSeleccionados: prev.serviciosSeleccionados.filter(
          s => s.ID_Servicio !== servicio.ID
        )
      }));
    }
  };

  // Cambiar fecha de un servicio específico
  const handleServiceDateChange = (servicioId, nuevaFecha) => {
    setFormData(prev => ({
      ...prev,
      serviciosSeleccionados: prev.serviciosSeleccionados.map(s =>
        s.ID_Servicio === servicioId ? { ...s, Fecha_Inicio: nuevaFecha } : s
      )
    }));
  };

  // Validar formulario completo
  const validateForm = () => {
    const errors = validateDates(formData.Fecha_Inicio, formData.Fecha_Fin);

    formData.serviciosSeleccionados.forEach(servicio => {
      if (servicio.Fecha_Inicio < formData.Fecha_Inicio || 
          servicio.Fecha_Inicio > formData.Fecha_Fin) {
        errors.servicios = t('reserva.errors.servicioFueraRango');
      }
    });

    return errors;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const user = getCurrentUser();
    if (!user || !user.ID) {
      setError(t('reserva.errors.userNotAuthenticated'));
      toast.error(t('reserva.errors.userNotAuthenticated'));
      return;
    }

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    // Calcular número de noches
const calcularNoches = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return 0;
  const diffTime = new Date(fechaFin) - new Date(fechaInicio);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Calcular precio total
const calcularPrecioTotal = () => {
  if (!alojamiento || !formData.Fecha_Inicio || !formData.Fecha_Fin) return 0;
  
  const noches = calcularNoches(formData.Fecha_Inicio, formData.Fecha_Fin);
  const precioAlojamiento = alojamiento.PrecioNoche * noches;
  
  const precioServicios = formData.serviciosSeleccionados.reduce(
    (total, servicio) => total + parseFloat(servicio.Precio), 0
  );
  
  return precioAlojamiento + precioServicios;
};

    setSubmitting(true);
    setError(null);

    try {
      console.log(' Iniciando creación de reserva...');
      
      const reservaData = {
        ID_Alojamiento: parseInt(id),
        ID_Usuario: user.ID,
        Fecha_Inicio: formData.Fecha_Inicio,
        Fecha_Fin: formData.Fecha_Fin
      };

      console.log(' Datos de reserva de alojamiento:', reservaData);
      const reservaResponse = await ReservaService.createReserva(reservaData);
      console.log('Respuesta de reserva de alojamiento:', reservaResponse.data);

      let idReservaAlojamiento;
      
      if (reservaResponse.data && reservaResponse.data.ID) {
        idReservaAlojamiento = reservaResponse.data.ID;
      } else if (reservaResponse.data && reservaResponse.data.idReserva) {
        idReservaAlojamiento = reservaResponse.data.idReserva;
      } else {
        idReservaAlojamiento = reservaResponse.data.ID || reservaResponse.data;
      }

      console.log(' ID de reserva obtenido:', idReservaAlojamiento);

      if (!idReservaAlojamiento) {
        throw new Error('No se pudo obtener el ID de la reserva creada');
      }

      // Crear reservas de servicios si hay seleccionados
      if (formData.serviciosSeleccionados.length > 0) {
        
        for (const servicio of formData.serviciosSeleccionados) {
          const servicioData = {
            ID_AlojamientoDetalle: parseInt(idReservaAlojamiento),
            ID_Servicio: parseInt(servicio.ID_Servicio),
            Fecha_Inicio: servicio.Fecha_Inicio,
            ...(servicio.Fecha_Fin && { Fecha_Fin: servicio.Fecha_Fin })
          };

          console.log('Datos de servicio:', servicioData);
          
          try {
            const servicioResponse = await ReservaService.createReservaServicio(servicioData);
            console.log('Servicio creado:', servicioResponse.data);
          } catch (servicioError) {
            console.error(' Error creando servicio:', servicioError);
            console.error('Datos que causaron el error:', servicioData);
            throw servicioError;
          }
        }
      }

      // Guardar datos de la reserva creada para mostrar en el modal de éxito
      setReservaCreada({
        id: idReservaAlojamiento,
        alojamiento: alojamiento.Nombre,
        fechaInicio: formData.Fecha_Inicio,
        fechaFin: formData.Fecha_Fin,
        servicios: formData.serviciosSeleccionados
      });

      setShowSuccess(true);
      toast.success(t('reserva.success.created'), {
        duration: 4000,
        icon: '✅',
      });

    } catch (err) {
      
      const errorMessage = err.response?.data?.message || err.message || t('reserva.errors.create');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Cerrar modal
  const handleClose = () => {
    navigate(-1);
  };

  // Manejar cierre del modal de éxito
  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate('/mis-reservas');
  };

  // Si el usuario no está autenticado, mostrar mensaje de error
  const user = getCurrentUser();
  if (!user || !user.ID) {
    return (
      <Modal open={true} onClose={handleClose}>
        <Box sx={style}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {t('reserva.errors.userNotAuthenticated')}
          </Alert>
          <Typography variant="body1" sx={{ mb: 3 }}>
            {t('reserva.errors.pleaseLogin')}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button onClick={handleClose} variant="outlined">
              {t('common.close')}
            </Button>
            <Button 
              onClick={() => navigate('/user/login')} 
              variant="contained"
              sx={{ bgcolor: '#2e7d32', '&:hover': { bgcolor: '#1b5e20' } }}
            >
              {t('auth.login')}
            </Button>
          </Box>
        </Box>
      </Modal>
    );
  }

  if (loading) {
    return (
      <Modal open={true}>
        <Box sx={style}>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress size={60} sx={{ color: '#2E7D32' }} />
          </Box>
        </Box>
      </Modal>
    );
  }

  if (!alojamiento) {
    return (
      <Modal open={true} onClose={handleClose}>
        <Box sx={style}>
          <Alert severity="error">{t('reserva.errors.alojamientoNotFound')}</Alert>
          <Button onClick={handleClose} sx={{ mt: 2 }}>
            {t('common.close')}
          </Button>
        </Box>
      </Modal>
    );
  }

  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#2e7d32',
            },
          },
          error: {
            style: {
              background: '#d32f2f',
            },
          },
        }}
      />
      
      {/* Modal principal de reserva */}
      <Modal open={true} onClose={!submitting ? handleClose : undefined}>
        <Box sx={style}>
          <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
            {t('reserva.title')} - {alojamiento.Nombre}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Imágenes del alojamiento */}
          {alojamiento.imagenes && alojamiento.imagenes.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('reserva.images')}
              </Typography>
              <Grid container spacing={2}>
                {alojamiento.imagenes.slice(0, 3).map((img, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardMedia
                        component="img"
                        height="140"
                        image={`${BASE_URL}/${img.url}`}
                        alt={`${alojamiento.Nombre} - ${index + 1}`}
                        sx={{ objectFit: 'cover' }}
                      />
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {/* Información del alojamiento */}
            <Card sx={{ mb: 3, bgcolor: '#f8f9fa' }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>{t('alojamientos.create.labels.precioNoche')}:</strong> ₡{alojamiento.PrecioNoche}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2">
                      <strong>{t('alojamientos.create.labels.capacidad')}:</strong> {alojamiento.Capacidad} personas
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2">
                      <strong>{t('alojamientos.detail.location')}:</strong>{' '}
                      {alojamiento.ubicacion ? 
                        `${alojamiento.ubicacion.Direccion}, ${alojamiento.ubicacion.Distrito}, ${alojamiento.ubicacion.Canton}` : 
                        t('alojamientos.detail.locationUnavailable')}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Fechas de reserva */}
            <Typography variant="h6" gutterBottom>
              {t('reserva.dateSelection')}
            </Typography>
            
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('reserva.fechaInicio')}
                  name="Fecha_Inicio"
                  type="date"
                  value={formData.Fecha_Inicio}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!validationErrors.Fecha_Inicio}
                  helperText={validationErrors.Fecha_Inicio}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label={t('reserva.fechaFin')}
                  name="Fecha_Fin"
                  type="date"
                  value={formData.Fecha_Fin}
                  onChange={handleChange}
                  InputLabelProps={{ shrink: true }}
                  error={!!validationErrors.Fecha_Fin}
                  helperText={validationErrors.Fecha_Fin}
                  size="small"
                />
              </Grid>
            </Grid>

            {/* Componente de servicios */}
            <ServicesSection
              servicios={servicios}
              formData={formData}
              validationErrors={validationErrors}
              onServiceSelection={handleServiceSelection}
              onServiceDateChange={handleServiceDateChange}
            />

            {/* Resumen de la reserva */}
            {(formData.Fecha_Inicio && formData.Fecha_Fin) && (
             // Reemplaza el Card de resumen con este:
<Card sx={{ mb: 3, bgcolor: '#e8f5e8' }}>
  <CardContent>
    <Typography variant="h6" gutterBottom>
      {t('reserva.summary')}
    </Typography>

     {promocionAplicada && (
        <Box sx={{ mb: 2, p: 2, backgroundColor: '#e8f5e9', borderRadius: 1 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            Promoción aplicada:
          </Typography>
          <Typography variant="body2">
            {promocionAplicada.tipo === 'Porcentaje' 
              ? `${promocionAplicada.valor}% de descuento`
              : `Descuento de ₡${promocionAplicada.valor.toLocaleString()}`}
          </Typography>
          <Typography variant="body2">
            Ahorro: ₡{(promocionAplicada.precioOriginal - promocionAplicada.precioConDescuento).toLocaleString()}
          </Typography>
        </Box>
      )}
      {/* FIN DEL CÓDIGO DE PROMOCIÓN */}
    
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2">
        <strong>{t('reserva.accommodation')}:</strong> {alojamiento.Nombre}
      </Typography>
      <Typography variant="body2">
        <strong>{t('reserva.dates')}:</strong> {formData.Fecha_Inicio} - {formData.Fecha_Fin}
      </Typography>
      <Typography variant="body2">
        <strong>{t('reserva.nights')}:</strong> {calcularNoches(formData.Fecha_Inicio, formData.Fecha_Fin)}
      </Typography>
      <Typography variant="body2">
        <strong>{t('reserva.pricePerNight')}:</strong> ₡{alojamiento.PrecioNoche}
      </Typography>
      <Typography variant="body2">
        <strong>{t('reserva.subtotal')}:</strong> ₡{alojamiento.PrecioNoche * calcularNoches(formData.Fecha_Inicio, formData.Fecha_Fin)}
      </Typography>
    </Box>

    {formData.serviciosSeleccionados.length > 0 && (
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          {t('reserva.selectedServices')}:
        </Typography>
        {formData.serviciosSeleccionados.map((servicio, index) => (
          <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" sx={{ ml: 2 }}>
              • {servicio.NombreServicio} ({servicio.Fecha_Inicio})
            </Typography>
            <Typography variant="body2">₡{servicio.Precio}</Typography>
          </Box>
        ))}
      </Box>
    )}

    <Divider sx={{ my: 1 }} />

    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        {t('reserva.total')}:
      </Typography>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        ₡{calcularPrecioTotal()}
      </Typography>
    </Box>
  </CardContent>
</Card>
            )}

            {/* Botones */}
            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2,
              pt: 2,
              borderTop: '1px solid rgba(0, 0, 0, 0.12)'
            }}>
              <Button
                onClick={handleClose}
                disabled={submitting}
                variant="outlined"
                size="large"
              >
                {t('common.cancel')}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting || !formData.Fecha_Inicio || !formData.Fecha_Fin}
                size="large"
                sx={{ 
                  minWidth: 150,
                  bgcolor: '#2e7d32',
                  '&:hover': { bgcolor: '#1b5e20' }
                }}
              >
                {submitting ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  t('reserva.createReservation')
                )}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Componente del modal de éxito */}
      <ReservationSuccessModal
        open={showSuccess}
        onClose={handleSuccessClose}
        reservaCreada={reservaCreada}
      />
    </>
  );
};

export default CreateReserva;