import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import ResenaService from '../../services/ResenaService';
import { jwtDecode } from 'jwt-decode';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid2';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
export function CreateResena() {
  const { idAlojamiento } = useParams();
  const alojamientoID = parseInt(idAlojamiento);
  const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
  const userData = token ? jwtDecode(token) : null;

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
    defaultValues: {
      Comentario: '',
      Calificacion: '',
    },
    resolver: yupResolver(schema),
  });
    if (!idUsuario || !alojamientoID) {
    return (
      <div style={{ padding: '2rem' }}>
        <Typography variant="h6" color="error">
          {t('reviews.form.errors.auth')}
        </Typography>
      </div>
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
      })
      .catch(() => {
        toast.error(t('reviews.form.toast.error'));
      });
  };

  const onError = () => toast.error(t('reviews.form.errors.incomplete'));
    return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>
              {t('reviews.form.title')}
            </Typography>
          </Grid>

          <Grid size={12}>
            <FormControl fullWidth>
              <Controller
                name="Comentario"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('reviews.form.fields.comment')}
                    multiline
                    rows={3}
                    error={!!errors.Comentario}
                    helperText={errors.Comentario?.message || ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={12} sm={6}>
            <FormControl fullWidth>
              <Controller
                name="Calificacion"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t('reviews.form.fields.rating')}
                    type="number"
                    inputProps={{ min: 1, max: 5 }}
                    error={!!errors.Calificacion}
                    helperText={errors.Calificacion?.message || ' '}
                  />
                )}
              />
            </FormControl>
          </Grid>

          <Grid size={12}>
            <Button type="submit" variant="contained" color="secondary">
              {t('reviews.form.buttons.submit')}
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}