// src/components/Servicios/UpdateServicio.jsx
import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    CircularProgress,
    Paper,
    IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ServicioService from "../../services/ServicioService";
import { useTranslation } from "react-i18next";

export default function UpdateServicio() {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({ mode: "onSubmit" });

    const [loading, setLoading] = useState(true);
    const [imagenFile, setImagenFile] = useState(null);
    const [preview, setPreview] = useState("");

    useEffect(() => {
        if (!id) {
            toast.error(t("servicio.notificacion.idNotFound"));
            setLoading(false);
            return;
        }

        ServicioService.getById(id)
            .then(({ data }) => {
                reset({
                    Nombre: data.Nombre,
                    Tipo: data.Tipo,
                    Precio: data.Precio,
                    Descripcion: data.Descripcion
                });
                if (data.ImagenURL) {
                    setPreview(data.ImagenURL);
                }
            })
            .catch(() => toast.error(t("servicio.notificacion.error")))
            .finally(() => setLoading(false));
    }, [id, reset, t]);

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImagenFile(file);
        setPreview(URL.createObjectURL(file));
    };

    const onSubmit = async (formValues) => {
        setLoading(true);
        try {
            await ServicioService.updateServicio(id, {
                Nombre: formValues.Nombre,
                Tipo: formValues.Tipo,
                Precio: formValues.Precio,
                Descripcion: formValues.Descripcion,
                Imagen: imagenFile    
            });
            toast.success(t("servicio.notificacion.actualizado"));
            navigate("/servicios/mantenimiento");
        } catch {
            toast.error(t("servicio.notificacion.error"));
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "60vh"
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Toaster />

            <Paper sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
                {/* Flecha de regreso */}
                <Box display="flex" alignItems="center" mb={2}>
                    <IconButton component={Link} to="/servicios/mantenimiento">
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h5" ml={1}>
                        {t("servicio.mantenimiento.editar")}
                    </Typography>
                </Box>

                <form noValidate onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        {/* Nombre */}
                        <Grid item xs={12}>
                            <Controller
                                name="Nombre"
                                control={control}
                                rules={{
                                    required: t("servicio.create.errors.nombreRequired")
                                }}
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

                        {/* Tipo */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="Tipo"
                                control={control}
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

                        {/* Precio */}
                        <Grid item xs={12} sm={6}>
                            <Controller
                                name="Precio"
                                control={control}
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

                        {/* Descripción */}
                        <Grid item xs={12}>
                            <Controller
                                name="Descripcion"
                                control={control}
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
                            <Button variant="contained" fullWidth type="submit">
                                {t("servicio.mantenimiento.guardar")}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
