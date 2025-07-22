import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import UsuarioService from '../../services/UsuarioService';

export function Signup() {
  const navigate = useNavigate();

  const schema = yup.object({
    Nombre: yup.string().required('El nombre es obligatorio'),
    Apellido: yup.string().required('El apellido es obligatorio'),
    Correo: yup.string().email('Formato inválido').required('El correo es obligatorio'),
    Contrasena: yup.string().required('La contraseña es obligatoria'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Nombre: '',
      Apellido: '',
      Correo: '',
      Contrasena: '',
    },
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState(null);

  const onSubmit = (dataForm) => {
    const payload = {
      ...dataForm,
      ID_Rol: 2, // Rol Cliente asignado automáticamente
      Estado: 1  // Activado por defecto
    };

    UsuarioService.registrarUsuario(payload)
      .then(() => {
        toast.success('Usuario registrado correctamente');
        navigate('/user/login');
      })
      .catch(() => {
        toast.error('Error al registrar usuario');
        setError('Fallo la solicitud de registro');
      });
  };

  const onError = () => {
    toast.error('Todos los campos son obligatorios');
  };

  return (
    <>
      <Toaster />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>Registro de Usuario</Typography>
          </Grid>

          <Grid size={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="Nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    error={!!errors.Nombre}
                    helperText={errors.Nombre?.message || ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="Apellido"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Apellido"
                    error={!!errors.Apellido}
                    helperText={errors.Apellido?.message || ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="Correo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Correo"
                    error={!!errors.Correo}
                    helperText={errors.Correo?.message || ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="Contrasena"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Contraseña"
                    type="password"
                    error={!!errors.Contrasena}
                    helperText={errors.Contrasena?.message || ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Button type="submit" variant="contained" color="secondary">
              Registrarse
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}