// UpdateAlojamiento.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, TextField, Button, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, FormHelperText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody,
  Checkbox, ListItemText, IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm, Controller } from "react-hook-form";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import AlojamientoService from "../../services/AlojamientoService";
import UbicacionService from "../../services/UbicacionService";
import ImageService from "../../services/ImageService";
import ServicioService from "../../services/ServicioService";
import ServicioAlojamientoService from "../../services/ServicioAlojamientoService";

const caracteristica = [
  "Wifi","Jacuzzi","Piscina","Aire acondicionado",
  "Estacionamiento","TV","Lavadora","Cocina"
];

export default function UpdateAlojamiento() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { control, handleSubmit, watch, reset } = useForm({ mode: "onSubmit" });
  const nombreValue = watch("Nombre");

  const [loading, setLoading]          = useState(true);
  const [saving, setSaving]            = useState(false);
  const [ubicacionId, setUbicacionId]  = useState(null);

  // nuevas imágenes + sus miniaturas
  const [imagenes, setImagenes]           = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // imágenes existentes + selección para eliminar
  const [imagenesExistentes, setImagenesExistentes]       = useState([]);
  const [seleccionadasEliminar, setSeleccionadasEliminar] = useState([]);
  const [dialogImgOpen, setDialogImgOpen]                 = useState(false);

  // servicios + selección
  const [servicios, setServicios]          = useState([]);
  const [dialogServOpen, setDialogServOpen]     = useState(false);
  const [tempSelectedIds, setTempIds]           = useState([]);
  const [selectedServices, setSelServ]          = useState([]);

  useEffect(() => {
    Promise.all([
      AlojamientoService.getAlojamientoById(id),
      ServicioService.getAll()
    ])
    .then(async ([alRes, servRes]) => {
      const data = alRes.data;
      const idUb  = data.ID_Ubicacion;
      setUbicacionId(idUb);

      const ubRes = await UbicacionService.getById(idUb);
      const ub    = ubRes.data;

      const asRes = await ServicioAlojamientoService.getByAlojamiento(id);
      const asIds = asRes.data.map(s=>s.ID);

      // cargar imágenes existentes
      const imgsRes = await ImageService.getByAlojamiento(id);
      setImagenesExistentes(imgsRes.data || []);

      setServicios(servRes.data || []);
      setTempIds(asIds);
      setSelServ(servRes.data.filter(s=>asIds.includes(s.ID)));

      reset({
        Provincia:       ub.Provincia || "",
        CodigoPostal:    ub.CodigoPostal || "",
        Canton:          ub.Canton || "",
        Distrito:        ub.Distrito || "",
        Direccion:       ub.Direccion || "",
        Nombre:          data.Nombre || "",
        Descripcion:     data.Descripcion || "",
        PrecioNoche:     data.PrecioNoche?.toString() || "",
        Capacidad:       data.Capacidad?.toString() || "",
        Categoria:       data.Categoria || "",
        Caracteristicas: (data.Caracteristicas||"").split(", ").filter(Boolean)
      });
    })
    .catch(err => {
      console.error(err);
      toast.error(t("alojamientos.create.errorLoadUsers"));
    })
    .finally(() => setLoading(false));
  }, [id, reset, t]);

  const onFileChange = e => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImagenes(prev => [...prev, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = idx => {
    setImagenes(prev => prev.filter((_, i) => i !== idx));
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  // servicios
  const openDialogServ = () => {
    setTempIds(selectedServices.map(s=>s.ID));
    setDialogServOpen(true);
  };
  const closeDialogServ = () => setDialogServOpen(false);
  const toggleSelectServ = id => {
    setTempIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  };
  const confirmSelServ = () => {
    setSelServ(servicios.filter(s=>tempSelectedIds.includes(s.ID)));
    setDialogServOpen(false);
  };

  const onSubmit = async data => {
    setSaving(true);
    try {
      await AlojamientoService.updateAlojamiento(id, {
        ID_Ubicacion:    ubicacionId,
        Nombre:          data.Nombre,
        Descripcion:     data.Descripcion,
        PrecioNoche:     Number(data.PrecioNoche),
        Capacidad:       Number(data.Capacidad),
        Caracteristicas: (data.Caracteristicas||[]).join(", "),
        Estado:          1,
        Categoria:       data.Categoria
      });

      // subir nuevas imágenes
      if (imagenes.length) {
        await Promise.all(imagenes.map(f => ImageService.upload(id, f)));
      }

      toast.success(t("alojamientos.create.success"));
      navigate("/alojamientos");
    } catch (err) {
      console.error(err);
      toast.error(t("alojamientos.create.error"));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth:900, mx:"auto", mt:3, p:2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton component={Link} to="/alojamientos">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" ml={1}>
          {t("alojamientos.get.buttons.edit")}: {nombreValue}
        </Typography>
      </Box>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {[
            { n: "Nombre",      l: "nombre" },
            { n: "Descripcion", l: "descripcion", multi: true, rows: 3 },
            { n: "PrecioNoche", l: "precioNoche", type: "number" },
            { n: "Capacidad",   l: "capacidad",   type: "number" }
          ].map(f=>(
            <Grid item xs={12} sm={f.multi?12:6} key={f.n}>
              <Controller
                name={f.n}
                control={control}
                defaultValue=""
                rules={{ required: t(`alojamientos.create.errors.${f.l}Required`) }}
                render={({ field, fieldState:{error} })=>(
                  <TextField
                    {...field}
                    label={t(`alojamientos.create.labels.${f.l}`)}
                    type={f.type||"text"}
                    fullWidth
                    multiline={!!f.multi}
                    rows={f.rows||1}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          ))}

          <Grid item xs={12} sm={6}>
            <Controller
              name="Categoria"
              control={control}
              defaultValue=""
              rules={{ required: t("alojamientos.create.errors.selectCategory") }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>{t("alojamientos.create.labels.category")}</InputLabel>
                  <Select {...field} label={t("alojamientos.create.labels.category")}>
                    {["Hotel","Casa","Apartamento","Hostal"].map(c=>(
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          <Grid item xs={12}>
            <Controller
              name="Caracteristicas"
              control={control}
              defaultValue={[]}
              rules={{ required: t("alojamientos.create.errors.selectFeature") }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>{t("alojamientos.create.labels.features")}</InputLabel>
                  <Select
                    multiple
                    value={field.value}
                    onChange={e=>field.onChange(e.target.value)}
                    label={t("alojamientos.create.labels.features")}
                    renderValue={v=>v.join(", ")}
                  >
                    {caracteristica.map(opt=>(
                      <MenuItem key={opt} value={opt}>
                        <Checkbox checked={field.value.includes(opt)} />
                        <ListItemText primary={opt} />
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
                    {/* Nuevas imágenes con previsualización */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              {t("alojamientos.create.labels.images")}
            </Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onFileChange}
            />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              {imagePreviews.map((src, i) => (
                <Grid item xs={4} sm={3} md={2} key={i}>
                  <Box sx={{ position: "relative" }}>
                    <img
                      src={src}
                      alt={`new-${i}`}
                      style={{ width:"100%", borderRadius:4 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeNewImage(i)}
                      sx={{
                        position:"absolute",
                        top:4,
                        right:4,
                        bgcolor:"rgba(0,0,0,0.6)"
                      }}
                    >
                      <DeleteIcon fontSize="small" htmlColor="#fff" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Administrar imágenes existentes */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">
              {/* no existe clave—se mantiene literal */}
              Imágenes actuales
            </Typography>
            <Button variant="outlined" onClick={() => setDialogImgOpen(true)}>
              {/* no existe clave—se mantiene literal */}
              Administrar imágenes
            </Button>
          </Grid>

          {/* Servicios */}
          <Grid item xs={12}>
            <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", mb:1 }}>
              <Typography variant="subtitle1">
                {/* no existe clave—se mantiene literal */}
                Servicios
              </Typography>
              <Button variant="outlined" onClick={openDialogServ}>
                {t("alojamientos.create.buttons.addServices")}
              </Button>
            </Box>
            <Box>
              {selectedServices.length
                ? selectedServices.map(s=>(
                    <Typography key={s.ID}>• {s.Nombre}</Typography>
                  ))
                : <Typography color="text.secondary">
                    {t("alojamientos.create.noServiceSelected")}
                  </Typography>
              }
            </Box>
          </Grid>

          {/* Guardar */}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={saving}
            >
              {saving
                ? t("alojamientos.create.savingAccommodation")
                : t("alojamientos.create.buttons.saveAccommodation")
              }
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Diálogo: Eliminar imágenes */}
      <Dialog
        open={dialogImgOpen}
        onClose={() => setDialogImgOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {/* se mantiene literal */}
          Eliminar imágenes
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {!imagenesExistentes.length ? (
              <Grid item xs={12}>
                {/* se mantiene literal */}
                <Typography>No hay imágenes disponibles</Typography>
              </Grid>
            ) : imagenesExistentes.map(img => (
              <Grid item xs={6} sm={4} md={3} key={img.ID}>
                <Box sx={{ position:"relative" }}>
                  <img
                    src={`${import.meta.env.VITE_BASE_URL}uploads/${img.url}`}
                    alt={t("alojamientos.cards.defaultImageAlt")}
                    style={{ width:"100%", borderRadius:4 }}
                  />
                  <Checkbox
                    checked={seleccionadasEliminar.includes(img.ID)}
                    onChange={() => {
                      setSeleccionadasEliminar(prev =>
                        prev.includes(img.ID)
                          ? prev.filter(x => x !== img.ID)
                          : [...prev, img.ID]
                      );
                    }}
                    sx={{ position:"absolute", top:4, left:4, bgcolor:"white" }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogImgOpen(false)}>
            {t("alojamientos.create.buttons.cancel")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              try {
                await Promise.all(
                  seleccionadasEliminar.map(i => ImageService.deleteImage(i))
                );
                toast.success(t("alojamientos.get.toast.success"));
                const imgsRes = await ImageService.getByAlojamiento(id);
                setImagenesExistentes(imgsRes.data || []);
                setSeleccionadasEliminar([]);
                setDialogImgOpen(false);
              } catch (err) {
                console.error(err);
                toast.error(t("alojamientos.get.toast.error"));
              }
            }}
          >
            {/* se mantiene literal */}
            Eliminar seleccionadas
          </Button>
        </DialogActions>
      </Dialog>

      {/* Diálogo: Seleccionar servicios */}
      <Dialog
        open={dialogServOpen}
        onClose={closeDialogServ}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {t("alojamientos.create.servicesDialog.title")}
        </DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell/>
                <TableCell>{t("alojamientos.create.servicesDialog.columns.name")}</TableCell>
                <TableCell>{t("alojamientos.create.servicesDialog.columns.type")}</TableCell>
                <TableCell>{t("alojamientos.create.servicesDialog.columns.price")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!servicios.length ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    {t("alojamientos.create.servicesDialog.noServices")}
                  </TableCell>
                </TableRow>
              ) : servicios.map(s=>(
                <TableRow key={s.ID} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={tempSelectedIds.includes(s.ID)}
                      onChange={() => toggleSelectServ(s.ID)}
                    />
                  </TableCell>
                  <TableCell>{s.Nombre}</TableCell>
                  <TableCell>{s.Tipo}</TableCell>
                  <TableCell>₡{s.Precio}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialogServ}>
            {t("alojamientos.create.buttons.cancel")}
          </Button>
          <Button onClick={confirmSelServ} variant="contained">
            {t("alojamientos.create.buttons.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}