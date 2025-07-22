import { useState, useContext } from 'react';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import { useForm, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import UsuarioService from '../../services/UsuarioService';
import { UserContext } from '../../context/UserContext';

export function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);

  // Validación: campos obligatorios
  const loginSchema = yup.object({
    Correo: yup.string().required('El correo es obligatorio').email('Formato de correo inválido'),
    Contrasena: yup.string().required('La contraseña es obligatoria'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      Correo: '',
      Contrasena: '',
    },
    resolver: yupResolver(loginSchema),
  });

  const [error, setError] = useState(null);

  const onSubmit = (dataForm) => {
    UsuarioService.loginUsuario(dataForm)
      .then((response) => {
        const token = response.data;
        if (token && typeof token === 'string' && token !== 'Usuario no valido') {
          saveUser(token);
          toast.success('Bienvenido, usuario', { duration: 4000 });
          navigate('/');
        } else {
          toast.error('Usuario no válido', { duration: 4000 });
        }
      })
      .catch(() => {
        toast.error('Error al conectar con el servidor');
        setError('Fallo la solicitud de login');
      });
  };

  const onError = () => {
    toast.error('Todos los campos son obligatorios');
  };

  return (
    <>
      <Toaster />
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>Iniciar Sesión</Typography>
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
              Acceder
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}