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

export function CreateResena() {
  const { idAlojamiento } = useParams();
  const alojamientoID = parseInt(idAlojamiento);
  const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
  const userData = token ? jwtDecode(token) : null;
  
  const idUsuario = userData?.id;

  const schema = yup.object({
    Comentario: yup.string().required('El comentario es obligatorio'),
    Calificacion: yup
      .number()
      .typeError('Debés escribir un número')
      .required('La calificación es obligatoria')
      .min(1, 'Mínimo 1')
      .max(5, 'Máximo 5'),
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
          Debés iniciar sesión para dejar una reseña.
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
        toast.success('Reseña creada correctamente');
        reset();
      })
      .catch(() => {
        toast.error('Error al crear la reseña');
      });
  };

  const onError = () => toast.error('Completá todos los campos');

  return (
    <>
      <Toaster />
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography variant="h6" gutterBottom>Agregar Reseña</Typography>
          </Grid>

          <Grid size={12}>
            <FormControl fullWidth>
              <Controller
                name="Comentario"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Comentario"
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
                    label="Calificación (1–5)"
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
              Guardar Reseña
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}