// src/components/Auth/Login.jsx

import { useState, useContext } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';

import { UserContext } from '../../context/UserContext';
import UsuarioService from '../../services/UsuarioService';
import { useTranslation } from 'react-i18next';

export function Login() {
  const navigate = useNavigate();
  const { saveUser } = useContext(UserContext);
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  const loginSchema = yup.object({
    Correo: yup
      .string()
      .required(t('auth.login.errors.required'))
      .email(t('auth.login.errors.invalidEmail')),
    Contrasena: yup.string().required(t('auth.login.errors.required')),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { Correo: '', Contrasena: '' },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = (dataForm) => {
    UsuarioService.loginUsuario(dataForm)
      .then((res) => {
        const token = res.data;
        if (token && token !== 'Usuario no valido') {
          saveUser(token);
          toast.success(t('auth.login.toast.welcome'), { duration: 4000 });
          navigate('/');
        } else {
          toast.error(t('auth.login.errors.invalidUser'), { duration: 4000 });
        }
      })
      .catch((err) => {
        toast.error(t('auth.login.errors.server'));
        setError(t('auth.login.errors.loginFailed'));
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
        {/* Responsive breakpoints: full ancho móvil, ocupa 10/12 en sm, 6/12 en md, 4 en lg, 3 en xl */}
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
              {t('auth.login.title')}
            </Typography>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <Grid container spacing={2}>
                <Grid xs={12}>
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

                <Grid xs={12}>
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


                <Grid xs={12}>
                  <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      fullWidth
                    >
                      {t('auth.login.buttons.submit')}
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      fullWidth
                      onClick={() => navigate('/user/signup')}
                    >
                      {t('auth.login.buttons.register')}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
