// src/components/Alojamiento/GetAlojamiento.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  IconButton,
  Button
} from "@mui/material";
import { Link } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import toast from "react-hot-toast";

import AlojamientoService from "../../services/AlojamientoService";

export default function GetAlojamiento() {
  const [alojamientos, setAlojamientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAlojamientos = () => {
    setLoading(true);
    AlojamientoService.getAlojamientos()
      .then((res) => {
        console.log("API Alojamientos:", res.data);
        // Asegurarse de que venga un array
        if (Array.isArray(res.data)) {
          setAlojamientos(res.data);
          setError("");
        } else {
          setAlojamientos([]);
          setError("Respuesta inesperada del servidor");
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "Error al cargar alojamientos");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAlojamientos();
  }, []);

  const handleDelete = (id) => {
    toast
      .promise(
        AlojamientoService.deleteLogicoAlojamiento(id),
        {
          loading: "Eliminando alojamiento...",
          success: "Alojamiento eliminado",
          error: "No se pudo eliminar"
        },
        { position: "bottom-center" }
      )
      .then(fetchAlojamientos);
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fafaf7",
          color: "#2E7D32"
        }}
      >
        <CircularProgress size={60} sx={{ color: "#2E7D32", mb: 2 }} />
        <Typography variant="h6">Cargando alojamientos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4, backgroundColor: "#fafaf7" }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!alojamientos.length) {
    return (
      <Box sx={{ p: 4, backgroundColor: "#fafaf7" }}>
        <Typography>No hay alojamientos para mostrar.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1200, m: "2rem auto", px: 2 }}>
      <Typography variant="h5" gutterBottom>
        Listado de Alojamientos
      </Typography>

      <Box mb={2}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/alojamiento/crear"
        >
          Crear alojamiento
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Categoría</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alojamientos.map((a) => {
              // Ajustá los campos según tu API: a.id / a.Nombre, etc.
              const id = a.ID ?? a.id;
              const nombre = a.Nombre ?? a.nombre;
              const desc = a.Descripcion ?? a.descripcion;
              const cat = a.Categoria ?? a.categoria ?? "—";

              return (
                <TableRow key={id} hover>
                  <TableCell>{nombre}</TableCell>
                  <TableCell>{desc}</TableCell>
                  <TableCell>{cat}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      size="small"
                      component={Link}
                      to={`/alojamiento/editar/${id}`}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}