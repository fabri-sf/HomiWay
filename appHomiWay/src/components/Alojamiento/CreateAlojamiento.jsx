// CreateAlojamiento.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, TextField, Button, CircularProgress,
  FormControl, InputLabel, Select, MenuItem, FormHelperText,
  Dialog, DialogTitle, DialogContent, DialogActions,
  Table, TableHead, TableRow, TableCell, TableBody,
  Checkbox, ListItemText, IconButton
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

import AlojamientoService from "../../services/AlojamientoService";
import UbicacionService from "../../services/UbicacionService";
import UsuarioService from "../../services/UsuarioService";
import ImageService from "../../services/ImageService";
import ServicioService from "../../services/ServicioService";
import ServicioAlojamientoService from "../../services/ServicioAlojamientoService";

const provinciasCR = [
  "San José","Alajuela","Cartago","Heredia","Guanacaste","Puntarenas","Limón"
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

export default function CreateAlojamiento() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm({ mode: "onSubmit" });
  const selectedProv = watch("Provincia");

  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tempSelectedIds, setTempIds] = useState([]);
  const [selectedServices, setSelServ] = useState([]);

  const [imagenes, setImagenes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    UsuarioService.getUsuarios()
      .then(res => setUsers(res.data || []))
      .catch(() => toast.error(t("alojamientos.create.errorLoadUsers")));
    ServicioService.getAll()
      .then(res => setServicios(res.data || []))
      .catch(() => toast.error(t("alojamientos.create.errorLoadServices")));
  }, []);

  const onFileChange = e => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setImagenes(prev => [...prev, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = index => {
    setImagenes(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const openDialog   = () => { setTempIds(selectedServices.map(s=>s.ID)); setDialogOpen(true); };
  const closeDialog  = () => setDialogOpen(false);
  const toggleSelect = id => setTempIds(p => p.includes(id) ? p.filter(x=>x!==id) : [...p,id]);
  const confirmSel   = () => { setSelServ(servicios.filter(s=>tempSelectedIds.includes(s.ID))); closeDialog(); };

  const onSubmit = async data => {
    setLoading(true);
    try {
      const ubRes = await UbicacionService.create({
        Provincia: data.Provincia,
        Canton:    data.Canton,
        Distrito:  data.Distrito,
        Direccion: data.Direccion,
        CodigoPostal: data.CodigoPostal,
        API: null
      });
      const idU = ubRes.data.ID;

      const alRes = await AlojamientoService.createAlojamiento({
        ID_Usuario:   data.ID_Usuario,
        ID_Ubicacion: idU,
        Nombre:       data.Nombre,
        Descripcion:  data.Descripcion,
        PrecioNoche:  Number(data.PrecioNoche),
        Capacidad:    Number(data.Capacidad),
        Caracteristicas: (data.Caracteristicas||[]).join(", "),
        Estado:       1,
        Categoria:    data.Categoria
      });
      const idA = alRes.data.ID;

      await Promise.all(imagenes.map(file => ImageService.upload(idA, file)));

      if (selectedServices.length)
        await Promise.all(
          selectedServices.map(s => ServicioAlojamientoService.createAssociation(idA, s.ID))
        );

      toast.success(t("alojamientos.create.success"));
      navigate("/alojamientos");
    } catch {
      toast.error(t("alojamientos.create.error"));
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" }}>
        <CircularProgress size={60} sx={{ mb:2 }} />
        <Typography>{t("alojamientos.create.savingAccommodation")}</Typography>
      </Box>
    );

  const postalCodes = postalCode[selectedProv] || [];

  return (
    <Box sx={{ maxWidth:900, mx:"auto", mt:3, p:2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton component={Link} to="/alojamientos">
          <ArrowBackIcon/>
        </IconButton>
        <Typography variant="h5" ml={1}>{t("alojamientos.create.title")}</Typography>
      </Box>
      
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Usuario */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="ID_Usuario"
              control={control}
              defaultValue=""
              rules={{ required:t("alojamientos.create.errors.selectUser") }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>{t("alojamientos.create.labels.user")}</InputLabel>
                  <Select {...field} label={t("alojamientos.create.labels.user")}>
                    {users.map(u=>(
                      <MenuItem key={u.ID} value={u.ID}>{u.Nombre} {u.Apellido}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {/* Provincia */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="Provincia"
              control={control}
              defaultValue=""
              rules={{ required:t("alojamientos.create.errors.selectProvince") }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>{t("alojamientos.create.labels.province")}</InputLabel>
                  <Select {...field} label={t("alojamientos.create.labels.province")}>
                    {provinciasCR.map(p=>(
                      <MenuItem key={p} value={p}>{p}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>

          {/* Código Postal */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="CodigoPostal"
              control={control}
              defaultValue=""
              rules={{ required:t("alojamientos.create.errors.selectPostal") }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>{t("alojamientos.create.labels.postalCode")}</InputLabel>
                  <Select {...field} label={t("alojamientos.create.labels.postalCode")}>
                    {postalCodes.map(cp=><MenuItem key={cp} value={cp}>{cp}</MenuItem>)}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
                    {/* Cantón, Distrito, Dirección */}
          {["Canton","Distrito","Direccion"].map(name=>(
            <Grid item xs={12} sm={6} key={name}>
              <Controller
                name={name}
                control={control}
                defaultValue=""
                rules={{ required:t(`alojamientos.create.errors.${name.toLowerCase()}Required`) }}
                render={({ field, fieldState:{error} })=>(
                  <TextField
                    {...field}
                    label={t(`alojamientos.create.labels.${name.toLowerCase()}`)}
                    fullWidth
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          ))}

          {/* Nombre, Descripción, Precio, Capacidad */}
          {[
            { n:"Nombre", l:"nombre" },
            { n:"Descripcion", l:"descripcion", multi:true, rows:3 },
            { n:"PrecioNoche", l:"precioNoche", type:"number" },
            { n:"Capacidad", l:"capacidad", type:"number" }
          ].map(f=>(
            <Grid item xs={12} sm={f.multi?12:6} key={f.n}>
              <Controller
                name={f.n}
                control={control}
                defaultValue=""
                rules={{ required:t(`alojamientos.create.errors.${f.l}Required`) }}
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

          {/* Categoría */}
          <Grid item xs={12} sm={6}>
            <Controller
              name="Categoria"
              control={control}
              defaultValue=""
              rules={{ required:t("alojamientos.create.errors.selectCategory") }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>{t("alojamientos.create.labels.category")}</InputLabel>
                  <Select {...field} label={t("alojamientos.create.labels.category")}>
                    {["Hotel","Casa","Apartamento","Hostal"].map(c=><MenuItem key={c} value={c}>{c}</MenuItem>)}
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
              rules={{ required:t("alojamientos.create.errors.selectFeature") }}
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
                    {característica.map(opt=>(
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

          {/* Imágenes */}
          <Grid item xs={12}>
            <Typography variant="subtitle1">{t("alojamientos.create.labels.images")}</Typography>
            <input type="file" multiple accept="image/*" onChange={onFileChange} />
            <Grid container spacing={2} sx={{ mt:1 }}>
              {imagePreviews.map((src,i)=>(
                <Grid item xs={4} sm={3} md={2} key={i}>
                  <Box sx={{ position:"relative" }}>
                    <img src={src} alt={`preview-${i}`} style={{ width:"100%", borderRadius:4 }} />
                    <IconButton size="small" onClick={()=>removeNewImage(i)} sx={{ position:"absolute", top:4, right:4, bgcolor:"rgba(0,0,0,0.6)" }}>
                      <DeleteIcon fontSize="small" htmlColor="#fff" />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>

          {/* Servicios */}
          <Grid item xs={12}>
            <Box sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", mb:1 }}>
              <Typography variant="subtitle1">{t("alojamientos.create.labels.services")}</Typography>
              <Button variant="outlined" onClick={openDialog}>{t("alojamientos.create.buttons.addServices")}</Button>
            </Box>
            <Box>
              {selectedServices.length
                ? selectedServices.map(s=><Typography key={s.ID}>• {s.Nombre}</Typography>)
                : <Typography color="text.secondary">{t("alojamientos.create.noServiceSelected")}</Typography>
              }
            </Box>
          </Grid>

          {/* Guardar */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth type="submit">
              {t("alojamientos.create.buttons.saveAccommodation")}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* Diálogo servicios */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t("alojamientos.create.servicesDialog.title")}</DialogTitle>
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
              {!servicios.length
                ? <TableRow><TableCell colSpan={4} align="center">{t("alojamientos.create.servicesDialog.noServices")}</TableCell></TableRow>
                : servicios.map(s=>(
                    <TableRow key={s.ID} hover>
                      <TableCell padding="checkbox">
                        <Checkbox checked={tempSelectedIds.includes(s.ID)} onChange={()=>toggleSelect(s.ID)} />
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
          <Button onClick={closeDialog}>
            {t("alojamientos.create.buttons.cancel")}
          </Button>
          <Button onClick={confirmSel} variant="contained">
            {t("alojamientos.create.buttons.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}