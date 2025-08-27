// src/components/Servicios/CreateServicio.jsx
import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Paper
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import ServicioService from "../../services/ServicioService";
import ServicioAlojamientoService from "../../services/ServicioAlojamientoService";

export default function CreateServicio() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { idAlojamiento } = useParams(); // opcional: /servicios/create/:idAlojamiento
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({ mode: "onSubmit" });

  const [loading, setLoading] = useState(false);
  const [imagenFile, setImagenFile] = useState(null);
  const [preview, setPreview] = useState("");

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagenFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Nombre", data.Nombre);
      formData.append("Descripcion", data.Descripcion);
      formData.append("Tipo", data.Tipo);
      formData.append("Precio", data.Precio);
      if (imagenFile) formData.append("Imagen", imagenFile);

      // 1) Crear servicio
      const resp = await ServicioService.createServicio(formData);
      const newService = resp.data;

      // 2) Asociar con alojamiento si aplica
      if (idAlojamiento) {
        await ServicioAlojamientoService.createAssociation(
          parseInt(idAlojamiento, 10),
          newService.ID
        );
      }

      toast.success(t("servicio.create.success"));
      // navegar atrás o a lista
      if (idAlojamiento) {
        navigate(`/alojamientos/${idAlojamiento}`);
      } else {
        navigate("/servicios/mantenimiento");
      }
    } catch (err) {
      console.error(err);
      toast.error(t("servicio.create.error"));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <CircularProgress size={60} sx={{ mb: 2 }} />
        <Typography>{t("servicio.create.saving")}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Hot-toast container */}
      <Toaster position="bottom-center" />

      <Paper sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <IconButton
            component={Link}
            to="/servicios/mantenimiento"
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" ml={1}>
            {t("servicio.create.title")}
          </Typography>
        </Box>

        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            {/* Nombre */}
            <Grid item xs={12}>
              <Controller
                name="Nombre"
                control={control}
                defaultValue=""
                rules={{ required: t("servicio.create.errors.nombreRequired") }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("servicio.create.labels.nombre")}
                    fullWidth
                    error={!!errors.Nombre}
                    helperText={errors.Nombre?.message}
                  />
                )}
              />
            </Grid>

            {/* Descripción */}
            <Grid item xs={12}>
              <Controller
                name="Descripcion"
                control={control}
                defaultValue=""
                rules={{
                  required: t("servicio.create.errors.descripcionRequired")
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("servicio.create.labels.descripcion")}
                    fullWidth
                    multiline
                    rows={4}
                    error={!!errors.Descripcion}
                    helperText={errors.Descripcion?.message}
                  />
                )}
              />
            </Grid>

            {/* Tipo */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="Tipo"
                control={control}
                defaultValue=""
                rules={{ required: t("servicio.create.errors.tipoRequired") }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("servicio.create.labels.tipo")}
                    fullWidth
                    error={!!errors.Tipo}
                    helperText={errors.Tipo?.message}
                  />
                )}
              />
            </Grid>

            {/* Precio (paso ₡1,000) */}
            <Grid item xs={12} sm={6}>
              <Controller
                name="Precio"
                control={control}
                defaultValue=""
                rules={{ required: t("servicio.create.errors.precioRequired") }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label={t("servicio.create.labels.precio")}
                    type="number"
                    inputProps={{ step: 1000, min: 0 }}
                    fullWidth
                    error={!!errors.Precio}
                    helperText={errors.Precio?.message}
                  />
                )}
              />
            </Grid>

            {/* Imagen */}
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                {t("servicio.create.labels.imagen")}
              </Typography>
              <input type="file" accept="image/*" onChange={onFileChange} />
              {preview && (
                <Box mt={1}>
                  <img
                    src={preview}
                    alt="preview"
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 4
                    }}
                  />
                </Box>
              )}
            </Grid>

            {/* Guardar */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" fullWidth type="submit">
                {t("servicio.create.buttons.save")}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}
