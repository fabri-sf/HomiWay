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
import toast from "react-hot-toast";

import AlojamientoService         from "../../services/AlojamientoService";
import UbicacionService           from "../../services/UbicacionService";
import UsuarioService             from "../../services/UsuarioService";
import ImageService               from "../../services/ImageService";
import ServicioService            from "../../services/ServicioService";
import ServicioAlojamientoService from "../../services/ServicioAlojamientoService";

const provinciasCR = ["San José","Alajuela","Cartago","Heredia","Guanacaste","Puntarenas","Limón"];
const postalCode = {
  "San José":["10101","10102","10103","10104","10105"],
  "Alajuela":["20101","20102","20103","20104","20105"],
  "Cartago":["30101","30102","30103","30104","30105"],
  "Heredia":["40101","40102","40103","40104","40105"],
  "Guanacaste":["50101","50102","50103","50104","50105"],
  "Puntarenas":["60101","60102","60103","60104","60105"],
  "Limón":["70101","70102","70103","70104","70105"]
};
const característica = ["Wifi","Jacuzzi","Piscina","Aire acondicionado","Estacionamiento","TV","Lavadora","Cocina"];

export default function CreateAlojamiento() {
  const navigate = useNavigate();
  const { control, handleSubmit, watch } = useForm({ mode: "onSubmit" });
  const selectedProv = watch("Provincia");

  const [loading, setLoading]          = useState(false);
  const [users, setUsers]              = useState([]);
  const [imagenes, setImagenes]        = useState([]);
  const [servicios, setServicios]      = useState([]);
  const [dialogOpen, setDialogOpen]    = useState(false);
  const [tempSelectedIds, setTempIds]  = useState([]);
  const [selectedServices, setSelServ] = useState([]);

  useEffect(() => {
    UsuarioService.getUsuarios()
      .then(res => setUsers(res.data || []))
      .catch(() => toast.error("No se pudieron cargar usuarios"));
    ServicioService.getAll()
      .then(res => setServicios(res.data || []))
      .catch(() => toast.error("No se pudieron cargar servicios"));
  }, []);

  const onFileChange = e => {
    if (e.target.files) setImagenes(p => [...p, ...Array.from(e.target.files)]);
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
        Canton: data.Canton,
        Distrito: data.Distrito,
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
        await Promise.all(selectedServices.map(s =>
          ServicioAlojamientoService.createAssociation(idA, s.ID)
        ));

      toast.success("Alojamiento creado exitosamente");
      navigate("/alojamientos");
    } catch {
      toast.error("Error al crear alojamiento");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <Box sx={{ minHeight:"60vh", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center" }}>
        <CircularProgress size={60} sx={{ mb:2 }} />
        <Typography>Guardando alojamiento...</Typography>
      </Box>
    );

  const postalCodes = postalCode[selectedProv] || [];

  return (
    <Box sx={{ maxWidth:900, mx:"auto", mt:3, p:2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton component={Link} to="/alojamientos"><ArrowBackIcon/></IconButton>
        <Typography variant="h5" ml={1}>Crear Alojamiento</Typography>
      </Box>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Usuario */}
          <Grid item xs={12} sm={6}>
            <Controller name="ID_Usuario" control={control} defaultValue="" rules={{ required:"Selecciona un usuario" }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Usuario</InputLabel>
                  <Select {...field} label="Usuario">
                    {users.map(u=><MenuItem key={u.ID} value={u.ID}>{u.Nombre} {u.Apellido}</MenuItem>)}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          {/* Provincia */}
          <Grid item xs={12} sm={6}>
            <Controller name="Provincia" control={control} defaultValue="" rules={{ required:"Selecciona provincia" }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Provincia</InputLabel>
                  <Select {...field} label="Provincia">
                    {provinciasCR.map(p=><MenuItem key={p} value={p}>{p}</MenuItem>)}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          {/* Código Postal */}
          <Grid item xs={12} sm={6}>
            <Controller name="CodigoPostal" control={control} defaultValue="" rules={{ required:"Selecciona código postal" }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Código Postal</InputLabel>
                  <Select {...field} label="Código Postal">
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
              <Controller name={name} control={control} defaultValue="" rules={{ required:`${name} obligatorio` }}
                render={({ field, fieldState:{error} })=>(
                  <TextField {...field} label={name==="Direccion"?"Dirección":name} fullWidth error={!!error} helperText={error?.message}/>
                )}
              />
            </Grid>
          ))}
          {/* Nombre, Descripción, Precio, Capacidad */}
          {[{n:"Nombre",l:"Nombre"},{n:"Descripcion",l:"Descripción",multi:true,rows:3},{n:"PrecioNoche",l:"Precio por noche",type:"number"},{n:"Capacidad",l:"Capacidad",type:"number"}].map(f=>(
            <Grid item xs={12} sm={f.multi?12:6} key={f.n}>
              <Controller name={f.n} control={control} defaultValue="" rules={{ required:`${f.l} obligatorio` }}
                render={({ field, fieldState:{error} })=>(
                  <TextField {...field} label={f.l} type={f.type||"text"} fullWidth multiline={!!f.multi} rows={f.rows||1} error={!!error} helperText={error?.message}/>
                )}
              />
            </Grid>
          ))}
          {/* Categoría */}
          <Grid item xs={12} sm={6}>
            <Controller name="Categoria" control={control} defaultValue="" rules={{ required:"Selecciona categoría" }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Categoría</InputLabel>
                  <Select {...field} label="Categoría">
                    {["Hotel","Casa","Apartamento","Hostal"].map(c=><MenuItem key={c} value={c}>{c}</MenuItem>)}
                  </Select>
                  <FormHelperText>{error?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          {/* Características */}
          <Grid item xs={12}>
            <Controller name="Caracteristicas" control={control} defaultValue={[]} rules={{ required:"Selecciona al menos una característica" }}
              render={({ field, fieldState:{error} })=>(
                <FormControl fullWidth error={!!error}>
                  <InputLabel>Características</InputLabel>
                  <Select multiple value={field.value} onChange={e=>field.onChange(e.target.value)} label="Características" renderValue={v=>v.join(", ")}>
                    {característica.map(opt=>(
                      <MenuItem key={opt} value={opt}>
                        <Checkbox checked={field.value.includes(opt)}/>
                        <ListItemText primary={opt}/>
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
            <Typography variant="subtitle1">Imágenes</Typography>
            <input type="file" multiple accept="image/*" onChange={onFileChange}/>
            <Box sx={{mt:1}}>{imagenes.map((f,i)=><Typography key={i} variant="body2">{f.name}</Typography>)}</Box>
          </Grid>
          {/* Servicios */}
          <Grid item xs={12}>
            <Box sx={{display:"flex",alignItems:"center",justifyContent:"space-between",mb:1}}>
              <Typography variant="subtitle1">Servicios</Typography>
              <Button variant="outlined" onClick={openDialog}>Agregar servicios</Button>
            </Box>
            <Box>{selectedServices.length?selectedServices.map(s=><Typography key={s.ID}>• {s.Nombre}</Typography>):<Typography color="text.secondary">Ningún servicio seleccionado</Typography>}</Box>
          </Grid>
          {/* Guardar */}
          <Grid item xs={12}><Button variant="contained" color="primary" fullWidth type="submit">Guardar alojamiento</Button></Grid>
        </Grid>
      </form>

      {/* Diálogo servicios */}
      <Dialog open={dialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>Seleccionar servicios</DialogTitle>
        <DialogContent dividers>
          <Table size="small">
            <TableHead><TableRow><TableCell/><TableCell>Nombre</TableCell><TableCell>Tipo</TableCell><TableCell>Precio</TableCell></TableRow></TableHead>
            <TableBody>
              {!servicios.length
                ? <TableRow><TableCell colSpan={4} align="center">No hay servicios disponibles</TableCell></TableRow>
                : servicios.map(s=>(
                    <TableRow key={s.ID} hover>
                      <TableCell padding="checkbox"><Checkbox checked={tempSelectedIds.includes(s.ID)} onChange={()=>toggleSelect(s.ID)}/></TableCell>
                      <TableCell>{s.Nombre}</TableCell>
                      <TableCell>{s.Tipo}</TableCell>
                      <TableCell>₡{s.Precio}</TableCell>
                    </TableRow>
                  ))
              }
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions><Button onClick={closeDialog}>Cancelar</Button><Button onClick={confirmSel} variant="contained">Confirmar</Button></DialogActions>
      </Dialog>
    </Box>
  );
}
//yaaaaaaaaaaaaa