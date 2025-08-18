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
import { useTranslation } from 'react-i18next';
export function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const schema = yup.object({
    Nombre: yup.string().required(t('auth.signup.errors.required')),
    Apellido: yup.string().required(t('auth.signup.errors.required')),
    Correo: yup.string().email(t('auth.signup.errors.invalidEmail')).required(t('auth.signup.errors.required')),
    Contrasena: yup.string().required(t('auth.signup.errors.required')),
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
      ID_Rol: 2,
      Estado: 1
    };

      UsuarioService.registrarUsuario(payload)
      .then(() => {
        console.log('Nuevo usuario registrado'); // Log para depuración
        toast.success(t('auth.signup.toast.success'));
        navigate('/user/login');
      })
      .catch(() => {
        toast.error(t('auth.signup.toast.error'));
        setError(t('auth.signup.errors.registerFailed'));
      });
  };

  return (
    <>
      <Toaster />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form
        onSubmit={handleSubmit(onSubmit, () => toast.error(t('auth.signup.errors.required')))}
        noValidate
      >
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h5" gutterBottom>{t('auth.signup.title')}</Typography>
          </Grid>

          <Grid size={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="Nombre"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('auth.signup.fields.name')}
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
                    label={t('auth.signup.fields.surname')}
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
                    label={t('auth.signup.fields.email')}
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
                    label={t('auth.signup.fields.password')}
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
              {t('auth.signup.buttons.submit')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
};