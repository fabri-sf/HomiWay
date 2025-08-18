import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import AlojamientoService from "../../services/AlojamientoService";
import ImageService from "../../services/ImageService";
import { CartContext } from "../../context/CartContext";

const API_BASE = import.meta.env.VITE_BASE_URL;

export default function Carrito() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, removeAlojamiento, clearCart } = useContext(CartContext);
  const [items, setItems] = useState([]);

  // 1) Hook siempre al tope, antes de cualquier return
  useEffect(() => {
    if (!isAuthenticated || cart.length === 0) {
      setItems([]);
      return;
    }

    let isMounted = true;
    async function loadDetails() {
      try {
        const detailed = await Promise.all(
          cart.map(async ({ id, noches }) => {
            const { data: aloj } = await AlojamientoService.getAlojamientoById(id);
            const { data: img }  = await ImageService.getFirst(id);
            const fotoUrl = img.url.startsWith("http")
              ? img.url
              : `${API_BASE}uploads/${encodeURIComponent(img.url)}`;

            return {
              id,
              noches,
              nombre:      aloj.Nombre,
              descripcion: aloj.Descripcion,
              precio:      parseFloat(aloj.PrecioNoche) || 0,
              fotoUrl,
            };
          })
        );
        if (isMounted) {
          setItems(detailed.filter(Boolean));
        }
      } catch (err) {
        console.error("Error cargando detalles del carrito:", err);
      }
    }

    loadDetails();
    return () => {
      isMounted = false;
    };
  }, [cart, isAuthenticated]);

  // 2) Si no está autenticado mostramos el botón de login
  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Carrito de alojamientos
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          Debes iniciar sesión para ver o modificar el carrito.
        </Alert>
        <Button variant="contained" onClick={() => navigate("/user/login")}>
          Iniciar sesión
        </Button>
      </Box>
    );
  }

  // 3) Handlers de acciones
  const eliminarItem   = (id) => removeAlojamiento({ id });
  const limpiarCarrito = ()   => clearCart(true);
  const reservarItem   = (id) => navigate(`/alojamiento/reservar/${id}`);
  const reservarTodos  = ()   => navigate("/alojamiento/reservar/todos");

  // 4) Render principal
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de alojamientos
      </Typography>

      {!items.length ? (
        <Typography>No hay alojamientos en tu carrito.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Foto</TableCell>
                <TableCell>Nombre</TableCell>
                <TableCell>Precio</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Noches</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(({ id, fotoUrl, nombre, precio, descripcion, noches }) => (
                <TableRow key={id}>
                  <TableCell>
                    {fotoUrl ? (
                      <img
                        src={fotoUrl}
                        alt={nombre}
                        style={{
                          width:        80,
                          height:       60,
                          objectFit:    "cover",
                          borderRadius: 4,
                        }}
                      />
                    ) : (
                      <Typography color="text.secondary">Sin imagen</Typography>
                    )}
                  </TableCell>
                  <TableCell>{nombre}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat("es-CR", {
                      style:    "currency",
                      currency: "CRC",
                    }).format(precio)}
                  </TableCell>
                  <TableCell>{descripcion}</TableCell>
                  <TableCell>{noches}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      color="error"
                      sx={{ mr: 1 }}
                      onClick={() => eliminarItem(id)}
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => reservarItem(id)}
                    >
                      Reservar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {items.length > 0 && (
        <Box sx={{ mt: 4, display: "flex", gap: 2 }}>
          <Button variant="outlined" color="error" onClick={limpiarCarrito}>
            Limpiar carrito
          </Button>
          <Button variant="contained" color="primary" onClick={reservarTodos}>
            Reservar todos
          </Button>
        </Box>
      )}
    </Box>
  );
}