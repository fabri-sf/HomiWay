// src/components/Resena/CreateResena.jsx

import { useParams, useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ResenaService from '../../services/ResenaService';
import {
  Container,
  Card,
  CardContent,
  Divider,
  Stack,
  Box,
  TextField,
  Typography,
  Button,
  FormControl,
  Grid
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Minimal JWT decoder
function jwtDecode(token) {
  try {
    const [, payload] = token.split('.');
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(
      decodeURIComponent(
        json
          .split('')
          .map(ch => '%' + ch.charCodeAt(0).toString(16).padStart(2, '0'))
          .join('')
      )
    );
  } catch {
    return null;
  }
}

export function CreateResena() {
  const { idAlojamiento } = useParams();
  const navigate = useNavigate();
  const alojamientoID = parseInt(idAlojamiento, 10);

  const rawToken = localStorage.getItem('user')?.replace(/^"|"$/g, '');
  const userData = rawToken ? jwtDecode(rawToken) : null;
  const idUsuario = userData?.id;

  const { t } = useTranslation();

  const schema = yup.object({
    Comentario: yup.string().required(t('reviews.form.errors.required')),
    Calificacion: yup
      .number()
      .typeError(t('reviews.form.errors.type'))
      .required(t('reviews.form.errors.required'))
      .min(1, t('reviews.form.errors.min'))
      .max(5, t('reviews.form.errors.max')),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { Comentario: '', Calificacion: '' },
    resolver: yupResolver(schema),
  });

  if (!idUsuario || !alojamientoID) {
    return (
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h6" color="error" align="center">
          {t('reviews.form.errors.auth')}
        </Typography>
      </Container>
    );
  }

  const onSubmit = (dataForm) => {
    const payload = {
      ...dataForm,
      ID_Usuario: idUsuario,
      ID_Alojamiento: alojamientoID,
    };

    ResenaService.createResena(payload)
      .then(() => {
        toast.success(t('reviews.form.toast.success'));
        reset();
        // Redirige al listado de alojamientos (ListCardAlojamiento.jsx)
        navigate('/alojamientos');
      })
      .catch(() => {
        toast.error(t('reviews.form.toast.error'));
      });
  };

  const onError = () => {
    toast.error(t('reviews.form.errors.incomplete'));
  };

  return (
    <>
      <Toaster position="top-center" />

      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card elevation={4}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={2}>
              <Typography variant="h5" align="center">
                {t('reviews.form.title')}
              </Typography>

              <Divider />

              <Box
                component="form"
                onSubmit={handleSubmit(onSubmit, onError)}
                noValidate
              >
                <Stack spacing={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <Controller
                          name="Comentario"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t('reviews.form.fields.comment')}
                              variant="outlined"
                              multiline
                              rows={4}
                              error={!!errors.Comentario}
                              helperText={errors.Comentario?.message || ' '}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth>
                        <Controller
                          name="Calificacion"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label={t('reviews.form.fields.rating')}
                              variant="outlined"
                              type="number"
                              inputProps={{ min: 1, max: 5 }}
                              error={!!errors.Calificacion}
                              helperText={errors.Calificacion?.message || ' '}
                            />
                          )}
                        />
                      </FormControl>
                    </Grid>
                  </Grid>

                  <Box textAlign="center">
                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      size="large"
                      sx={{ px: 6 }}
                    >
                      {t('reviews.form.buttons.submit')}
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
