// src/components/Auth/Signup.jsx

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import UsuarioService from '../../services/UsuarioService';
import { useTranslation } from 'react-i18next';

export function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  const signupSchema = yup.object({
    Nombre: yup.string().required(t('auth.signup.errors.required')),
    Apellido: yup.string().required(t('auth.signup.errors.required')),
    Username: yup.string().required(t('auth.signup.errors.required')),
    Correo: yup
      .string()
      .email(t('auth.signup.errors.invalidEmail'))
      .required(t('auth.signup.errors.required')),
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
      Username: '',
      Correo: '',
      Contrasena: '',
    },
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = (dataForm) => {
    const payload = {
      ...dataForm,
      ID_Rol: 2,
      Estado: 1,
      // Username viene del campo Username
    };
    UsuarioService.registrarUsuario(payload)
      .then(() => {
        toast.success(t('auth.signup.toast.success'));
        navigate('/user/login');
      })
      .catch((err) => {
        toast.error(t('auth.signup.toast.error'));
        setError(t('auth.signup.errors.registerFailed'));
      });
  };

  return (
    <>
      <Toaster position="bottom-center" />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{ minHeight: '80vh', px: 2 }}
      >
        <Grid xs={12} sm={10} md={6} lg={4} xl={3}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Box
              component="img"
              src="/src/assets/logo.png"
              alt={t('homePage.logoAlt')}
              sx={{
                display: 'block',
                mx: 'auto',
                mb: 3,
                width: 100,
                height: 100,
                borderRadius: '50%',
                objectFit: 'cover'
              }}
            />

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{ mb: 3 }}
            >
              {t('auth.signup.title')}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                {/* Nombre */}
                <Grid xs={12}>
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

                {/* Apellido */}
                <Grid xs={12}>
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

                {/* Username */}
                <Grid xs={12}>
                  <FormControl fullWidth>
                    <Controller
                      name="Username"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t('auth.signup.fields.username')}
                          error={!!errors.Username}
                          helperText={errors.Username?.message || ' '}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>

                {/* Correo */}
                <Grid xs={12}>
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

                {/* Contrasena */}
                <Grid xs={12}>
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

                {/* Submit */}
                <Grid xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    fullWidth
                    sx={{
                      mt: 2,
                      textTransform: 'none',
                      fontWeight: 600,
                    }}
                  >
                    {t('auth.signup.buttons.submit')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
