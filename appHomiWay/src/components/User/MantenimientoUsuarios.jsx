// src/components/User/MantenimientoUsuarios.jsx

import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import UsuarioService from "../../services/UsuarioService";
import RolService from "../../services/RolService";

export default function MantenimientoUsuarios() {
  const { t } = useTranslation();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  useEffect(() => {
    Promise.all([UsuarioService.getUsuarios(), RolService.getRoles()])
      .then(([resUsers, resRoles]) => {
        const rolesData = resRoles.data || [];
        setRoles(rolesData);

        const usersData = resUsers.data || [];
        const enriched = usersData.map((u) => ({
          ...u,
          rol: rolesData.find((r) => r.ID === u.ID_Rol) || null,
        }));
        setUsuarios(enriched);
      })
      .catch(console.error);
  }, []);

  const filtrados = usuarios.filter((u) =>
    `${u.Nombre} ${u.Apellido}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  const handleOpenModal = (u) => {
    setCurrentUser(u);
    setSelectedRoleId(u.Estado === 0 ? 0 : u.ID_Rol || 0);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentUser(null);
  };

  const handleConfirm = async () => {
    try {
      const body =
        selectedRoleId === 0 ? { Estado: 0 } : { ID_Rol: selectedRoleId };

      const { data: updatedUser } = await UsuarioService.updateRol(
        currentUser.ID,
        body
      );

      const fullUpdated = {
        ...updatedUser,
        rol: roles.find((r) => r.ID === updatedUser.ID_Rol) || null,
      };

      setUsuarios((list) =>
        list.map((u) => (u.ID === fullUpdated.ID ? fullUpdated : u))
      );

      toast.success(t("usuarios.mantenimiento.toast.updated"));
    } catch (err) {
      console.error(err);
      toast.error(t("usuarios.mantenimiento.toast.error"));
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Toaster />
      <IconButton onClick={() => window.history.back()} sx={{ mb: 2 }}>
        <ArrowBackIcon />
        <Typography sx={{ ml: 1 }}>
          {t("usuarios.mantenimiento.back")}
        </Typography>
      </IconButton>

      <Typography variant="h4" gutterBottom>
        {t("usuarios.mantenimiento.title")}
      </Typography>

      <Paper
        component="form"
        onSubmit={(e) => e.preventDefault()}
        sx={{ p: 2, mb: 3, display: "flex", alignItems: "center" }}
      >
        <SearchIcon sx={{ mr: 1 }} />
        <TextField
          fullWidth
          variant="standard"
          placeholder={t("usuarios.mantenimiento.search")}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Paper>

      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "60vh",
          overflowY: "auto",
          mb: 2,
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>{t("usuarios.fields.nombre")}</TableCell>
              <TableCell>{t("usuarios.fields.apellido")}</TableCell>
              <TableCell sx={{ display: { xs: "none", sm: "table-cell" } }}>
                {t("usuarios.fields.correo")}
              </TableCell>
              <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>
                {t("usuarios.fields.rol")}
              </TableCell>
              <TableCell>{t("usuarios.fields.estado")}</TableCell>
              <TableCell align="right">
                {t("usuarios.fields.acciones")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.map((u) => (
              <TableRow key={u.ID}>
                <TableCell>{u.Nombre}</TableCell>
                <TableCell>{u.Apellido}</TableCell>
                <TableCell
                  sx={{ display: { xs: "none", sm: "table-cell" } }}
                >
                  {u.Correo}
                </TableCell>
                <TableCell
                  sx={{ display: { xs: "none", md: "table-cell" } }}
                >
                  {u.rol?.Rol || "—"}
                </TableCell>
                <TableCell>
                  {u.Estado == 1
                    ? t("usuarios.fields.roles.activo")
                    : t("usuarios.fields.roles.inactivo")}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AdminPanelSettingsIcon />}
                    onClick={() => handleOpenModal(u)}
                  >
                    {t("usuarios.mantenimiento.actions")}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="xs"
        fullScreen={fullScreen}
      >
        <DialogTitle>{t("usuarios.mantenimiento.dialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("usuarios.mantenimiento.dialog.subtitle", {
              name: currentUser?.Nombre,
            })}
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="select-role-label">
              {t("usuarios.mantenimiento.dialog.selectLabel")}
            </InputLabel>
            <Select
              labelId="select-role-label"
              value={selectedRoleId}
              label={t("usuarios.mantenimiento.dialog.selectLabel")}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              <MenuItem value={0}>
                {t("usuarios.mantenimiento.dialog.options.inactivo")}
              </MenuItem>
              {roles.map((r) => (
                <MenuItem key={r.ID} value={r.ID}>
                  {r.Rol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>
            {t("usuarios.mantenimiento.dialog.cancel")}
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            {t("usuarios.mantenimiento.dialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
