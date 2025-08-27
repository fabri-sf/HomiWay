// src/components/Servicios/ServicioMantenimeinto.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  CircularProgress
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

import ServicioService from "../../services/ServicioService";

export default function ServicioMantenimeinto() {
  const { t } = useTranslation();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    setLoading(true);
    try {
      const { data } = await ServicioService.getAll();
      setServicios(data);
    } catch {
      toast.error(t("servicio.notificacion.serviciosNoCargados"));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await ServicioService.deleteServicio(id);
      toast.success(t("servicio.notificacion.eliminado"));
      loadServicios();
    } catch {
      toast.error(t("servicio.notificacion.error"));
    }
  };

  return (
    <Box sx={{ p: 3 }}>

      <Typography variant="h4" gutterBottom>
        {t("servicio.mantenimiento.titulo")}
      </Typography>

      <Button
        component={Link}
        to="/servicios/create"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ mb: 2 }}
      >
        {t("servicio.mantenimiento.nuevo")}
      </Button>

      {loading ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{t("servicio.id")}</TableCell>
                <TableCell>{t("servicio.nombre")}</TableCell>
                <TableCell>{t("servicio.tipo")}</TableCell>
                <TableCell>{t("servicio.precio")}</TableCell>
                <TableCell>{t("servicio.descripcion")}</TableCell>
                <TableCell align="right">
                  {t("servicio.mantenimiento.editar")}
                </TableCell>
                <TableCell align="right">
                  {t("servicio.mantenimiento.eliminar")}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {servicios.map((svc) => (
                <TableRow key={svc.ID} hover>
                  <TableCell>{svc.ID}</TableCell>
                  <TableCell>{svc.Nombre}</TableCell>
                  <TableCell>{svc.Tipo}</TableCell>
                  <TableCell>{svc.Precio}</TableCell>
                  <TableCell>{svc.Descripcion}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      component={Link}
                      to={`/servicios/update/${svc.ID}`}
                      size="small"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => handleDelete(svc.ID)} size="small">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
