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
import { useTranslation } from 'react-i18next';

export function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);
  const { t } = useTranslation();

  const loginSchema = yup.object({
    Correo: yup.string()
      .required(t('auth.login.errors.required'))
      .email(t('auth.login.errors.invalidEmail')),
    Contrasena: yup.string()
      .required(t('auth.login.errors.required')),
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
        console.log('Usuario autenticado con ID:', JSON.parse(atob(token.split('.')[1]))?.id); // Corregido aquí
        toast.success(t('auth.login.toast.welcome'), { duration: 4000 });
        navigate('/');
      } else {
        toast.error(t('auth.login.errors.invalidUser'), { duration: 4000 });
      }
    })
    .catch(() => {
      toast.error(t('auth.login.errors.server'));
      setError(t('auth.login.errors.loginFailed'));
    });
};

  return (
    <>
      <Toaster />
      {error && <p>Error: {error}</p>}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>{t('auth.login.title')}</Typography>
          </Grid>

          <Grid size={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="Correo"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('auth.login.fields.email')}
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
                    label={t('auth.login.fields.password')}
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
              {t('auth.login.buttons.submit')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};