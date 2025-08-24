// src/components/User/MantenimientoUsuarios.jsx

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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
  MenuItem
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

import UsuarioService from '../../services/UsuarioService';
import RolService from '../../services/RolService';

export default function MantenimientoUsuarios() {
  const { t } = useTranslation();

  const [usuarios, setUsuarios]       = useState([]);
  const [roles, setRoles]             = useState([]);
  const [busqueda, setBusqueda]       = useState('');
  const [modalOpen, setModalOpen]     = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState(null);

  // 1) Carga usuarios y roles, y enriquece cada usuario con su objeto rol
  useEffect(() => {
    Promise.all([
      UsuarioService.getUsuarios(),
      RolService.getRoles()
    ])
      .then(([resUsers, resRoles]) => {
        const rolesData = resRoles.data || [];
        setRoles(rolesData);

        const usersData = resUsers.data || [];
        const enriched = usersData.map(u => ({
          ...u,
          rol: rolesData.find(r => r.ID === u.ID_Rol) || null
        }));
        setUsuarios(enriched);
      })
      .catch(console.error);
  }, []);

  // 2) Filtrado por nombre+apellido
  const filtrados = usuarios.filter(u =>
    `${u.Nombre} ${u.Apellido}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // 3) Abrir modal, precargar ID del rol (0 = inactivo)
  const handleOpenModal = u => {
    setCurrentUser(u);
    setSelectedRoleId(u.Estado === 0 ? 0 : (u.ID_Rol || 0));
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentUser(null);
  };

  // 4) Confirmar cambio: post a /usuario (update), refrescar la fila
  const handleConfirm = async () => {
    try {
      const body = selectedRoleId === 0
        ? { Estado: 0 }
        : { ID_Rol: selectedRoleId };

      const { data: updatedUser } = await UsuarioService.updateRol(
        currentUser.ID,
        body
      );

      // Vuelve a enrriquecer con el objeto rol completo
      const fullUpdated = {
        ...updatedUser,
        rol: roles.find(r => r.ID === updatedUser.ID_Rol) || null
      };

      setUsuarios(list =>
        list.map(u =>
          u.ID === fullUpdated.ID ? fullUpdated : u
        )
      );

      toast.success(t('usuarios.mantenimiento.toast.updated'));
    } catch (err) {
      console.error(err);
      toast.error(t('usuarios.mantenimiento.toast.error'));
    } finally {
      handleCloseModal();
    }
  };

  return (
    <Box sx={{ p: 3 }}>

      <IconButton onClick={() => window.history.back()} sx={{ mb: 2 }}>
        <ArrowBackIcon />
        <Typography sx={{ ml: 1 }}>
          {t('usuarios.mantenimiento.back')}
        </Typography>
      </IconButton>

      <Typography variant="h4" gutterBottom>
        {t('usuarios.mantenimiento.title')}
      </Typography>

      <Paper
        component="form"
        onSubmit={e => e.preventDefault()}
        sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center' }}
      >
        <SearchIcon sx={{ mr: 1 }} />
        <TextField
          fullWidth
          variant="standard"
          placeholder={t('usuarios.mantenimiento.search')}
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />
      </Paper>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('usuarios.fields.nombre')}</TableCell>
              <TableCell>{t('usuarios.fields.apellido')}</TableCell>
              <TableCell>{t('usuarios.fields.correo')}</TableCell>
              <TableCell>{t('usuarios.fields.rol')}</TableCell>
              <TableCell>{t('usuarios.fields.estado')}</TableCell>
              <TableCell align="right">
                {t('usuarios.fields.acciones')}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtrados.map(u => (
              <TableRow key={u.ID}>
                <TableCell>{u.Nombre}</TableCell>
                <TableCell>{u.Apellido}</TableCell>
                <TableCell>{u.Correo}</TableCell>
                <TableCell>{u.rol?.Rol || '—'}</TableCell>
                <TableCell>
                  {u.Estado === 1
                    ? t('usuarios.fields.roles.cliente')
                    : t('usuarios.fields.roles.inactivo')}
                </TableCell>
                <TableCell align="right">
                  <Button
                    size="small"
                    variant="contained"
                    startIcon={<AdminPanelSettingsIcon />}
                    onClick={() => handleOpenModal(u)}
                  >
                    {t('usuarios.mantenimiento.actions')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>{t('usuarios.mantenimiento.dialog.title')}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('usuarios.mantenimiento.dialog.subtitle', {
              name: currentUser?.Nombre
            })}
          </DialogContentText>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel id="select-role-label">
              {t('usuarios.mantenimiento.dialog.selectLabel')}
            </InputLabel>
            <Select
              labelId="select-role-label"
              value={selectedRoleId}
              label={t('usuarios.mantenimiento.dialog.selectLabel')}
              onChange={e => setSelectedRoleId(e.target.value)}
            >
              <MenuItem value={0}>
                {t('usuarios.mantenimiento.dialog.options.inactivo')}
              </MenuItem>
              {roles.map(r => (
                <MenuItem key={r.ID} value={r.ID}>
                  {r.Rol}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>
            {t('usuarios.mantenimiento.dialog.cancel')}
          </Button>
          <Button variant="contained" onClick={handleConfirm}>
            {t('usuarios.mantenimiento.dialog.confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
