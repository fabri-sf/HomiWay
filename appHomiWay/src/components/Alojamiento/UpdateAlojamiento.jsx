import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Box, Typography, Grid, TextField, Button, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, FormHelperText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody,
  Checkbox, ListItemText, IconButton
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import AlojamientoService         from "../../services/AlojamientoService";
import UbicacionService           from "../../services/UbicacionService";
import ImageService               from "../../services/ImageService";
import ServicioService            from "../../services/ServicioService";
import ServicioAlojamientoService from "../../services/ServicioAlojamientoService";

const provinciasCR = [
  "San José","Alajuela","Cartago","Heredia",
  "Guanacaste","Puntarenas","Limón"
];
const postalCode = {
  "San José":["10101","10102","10103","10104","10105"],
  "Alajuela":["20101","20102","20103","20104","20105"],
  "Cartago":["30101","30102","30103","30104","30105"],
  "Heredia":["40101","40102","40103","40104","40105"],
  "Guanacaste":["50101","50102","50103","50104","50105"],
  "Puntarenas":["60101","60102","60103","60104","60105"],
  "Limón":["70101","70102","70103","70104","70105"]
};
const característica = [
  "Wifi","Jacuzzi","Piscina","Aire acondicionado",
  "Estacionamiento","TV","Lavadora","Cocina"
];

export default function UpdateAlojamiento() {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const {
    control, handleSubmit, watch, reset
  } = useForm({ mode: "onSubmit" });

  const [loading, setLoading]          = useState(true);
  const [saving, setSaving]            = useState(false);
  const [ubicacionId, setUbicacionId]  = useState(null);
  const [imagenes, setImagenes]        = useState([]);
  const [servicios, setServicios]      = useState([]);
  const [dialogOpen, setDialogOpen]    = useState(false);
  const [tempSelectedIds, setTempIds]  = useState([]);
  const [selectedServices, setSelServ] = useState([]);

  const selectedProv = watch("Provincia");
  const nombreValue  = watch("Nombre");

  useEffect(() => {
    Promise.all([
      AlojamientoService.getAlojamientoById(id),
      ServicioService.getAll()
    ])
      .then(async ([alRes, servRes]) => {
        const data = alRes.data;
        const idUb  = data.ID_Ubicacion;
        setUbicacionId(idUb);

        // 1. Ubicación
        const ubi = await UbicacionService.getById(idUb);
        const ub   = ubi.data;

        // 1. Servicios asignados
        const asRes = await ServicioAlojamientoService.getByAlojamiento(id);
        const asIds = asRes.data.map(s => s.ID);

        setServicios(servRes.data || []);
        setTempIds(asIds);
        setSelServ(servRes.data.filter(s => asIds.includes(s.ID)));

        // 1.Llenar formulario
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
          Caracteristicas: (data.Caracteristicas || "").split(", ").filter(Boolean)
        });
      })
      .catch(err => {
        console.error(err);
        toast.error("Error cargando datos");
      })
      .finally(() => setLoading(false));
  }, [id, reset]);

  const onFileChange = e => {
    if (e.target.files) {
      setImagenes(prev => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const openDialog   = () => {
    setTempIds(selectedServices.map(s => s.ID));
    setDialogOpen(true);
  };
  const closeDialog  = () => setDialogOpen(false);
  const toggleSelect = id => {
    setTempIds(prev =>
      prev.includes(id)
        ? prev.filter(x => x !== id)
        : [...prev, id]
    );
  };
  const confirmSel = () => {
    setSelServ(servicios.filter(s => tempSelectedIds.includes(s.ID)));
    setDialogOpen(false);
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
      Caracteristicas: (data.Caracteristicas || []).join(", "),
      Estado:          1,
      Categoria:       data.Categoria
    });

    if (imagenes.length > 0) {
      const uploads = imagenes.map(file =>
        ImageService.upload(id, file)
          .catch(err => {
            console.error("Error subiendo imagen:", err);
            toast.error(`Error subiendo imagen: ${file.name}`);
          })
      );
      await Promise.all(uploads);
    }

    toast.success("Alojamiento actualizado");
    navigate("/alojamientos");
  } catch (err) {
    console.error(err);
    toast.error("Error actualizando alojamiento");
  } finally {
    setSaving(false);
  }
};

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 3, p: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton component={Link} to="/alojamientos">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" ml={1}>
          Editar alojamiento: {nombreValue}
        </Typography>
      </Box>

      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Nombre, Descripción, Precio, Capacidad */}
          {[ 
            { n: "Nombre",      l: "Nombre" },
            { n: "Descripcion", l: "Descripción", multi: true, rows: 3 },
            { n: "PrecioNoche", l: "Precio por noche", type: "number" },
            { n: "Capacidad",   l: "Capacidad", type: "number" }
          ].map(f => (
            <Grid item xs={12} sm={f.multi ? 12 : 6} key={f.n}>
              <Controller
                name={f.n}
                control={control}
                defaultValue=""
                rules={{ required: `${f.l} obligatorio` }}
                render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    label={f.l}
                    type={f.type || "text"}
                    fullWidth
                    multiline={!!f.multi}
                    rows={f.rows || 1}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          ))}

          {/* Categoría */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="Categoria"
              control={control}
              defaultValue=""
              rules={{ required: "Selecciona categoría" }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Categoría</InputLabel>
                  <Select {...field} label="Categoría">
                    {["Hotel","Casa","Apartamento","Hostal"].map(c => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {/* Características */}
          <Grid item xs={12}>
            <Controller
              name="Caracteristicas"
              control={control}
              defaultValue={[]}
              rules={{ required: "Selecciona al menos una característica" }}
              render={({ field, fieldState: { error } }) => (
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Características</InputLabel>
                  <Select
                    multiple
                    {...field}
                    label="Características"
                    renderValue={vals => vals.join(", ")}
                  >
                    {característica.map(opt => (
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

          {/* Nuevas Imágenes */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">Agregar nuevas fotos</Typography>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={onFileChange}
            />
            <Box sx={{ mt: 1 }}>
              {imagenes.map((f, i) => (
                <Typography key={i} variant="body2">{f.name}</Typography>
              ))}
            </Box>
          </Grid>

          {/* Servicios */}
          <Grid item xs={12}>
            <Box
              sx={{
                display:       "flex",
                alignItems:    "center",
                justifyContent:"space-between",
                mb:            1
              }}
            >
              <Typography variant="subtitle1">Servicios</Typography>
              <Button variant="outlined" onClick={openDialog}>
                Agregar servicios
              </Button>
            </Box>
            <Box>
              {selectedServices.length
                ? selectedServices.map(s => (
                    <Typography key={s.ID}>• {s.Nombre}</Typography>
                  ))
                : <Typography color="text.secondary">
                    Ningún servicio seleccionado
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
              {saving ? "Guardando..." : "Actualizar alojamiento"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Diálogo de servicios */}
      <Dialog
        open={dialogOpen}
        onClose={closeDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Seleccionar servicios</DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Nombre</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Precio</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {!servicios.length
                ? <TableRow>
                    <TableCell colSpan={4} align="center">
                      No hay servicios disponibles
                    </TableCell>
                  </TableRow>
                : servicios.map(s => (
                    <TableRow key={s.ID} hover>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={tempSelectedIds.includes(s.ID)}
                          onChange={() => toggleSelect(s.ID)}
                        />
                      </TableCell>
                      <TableCell>{s.Nombre}</TableCell>
                      <TableCell>{s.Tipo}</TableCell>
                      <TableCell>₡{s.Precio}</TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancelar</Button>
          <Button onClick={confirmSel} variant="contained">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}