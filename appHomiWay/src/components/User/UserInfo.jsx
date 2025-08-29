// src/components/User/UserInfo.jsx

import React, { useState, useEffect, useContext } from "react";
import toast from "react-hot-toast";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Alert,
  Grid,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { UserContext } from "../../context/UserContext";
import UsuarioService from "../../services/UsuarioService";
import PedidoService from "../../services/PedidoService";

export default function UserInfo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { decodeToken } = useContext(UserContext);

  const tokenData = decodeToken();
  const [profile, setProfile] = useState(null);

  // Estados para "Mis pedidos"
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [showPedidos, setShowPedidos] = useState(false);

  // Cargar perfil
  useEffect(() => {
    if (!tokenData?.id) return;
    UsuarioService.getUsuarioPorID(tokenData.id)
      .then((res) => setProfile(res.data))
      .catch(() => setProfile(null));
  }, [tokenData]);

  // Toggle y carga de pedidos
  const handleShowPedidos = () => {
    if (!showPedidos) {
      setLoadingPedidos(true);
      PedidoService.getPedidosResumidos()
        .then((data) => {
          // Filtrar sólo los de este usuario
          setPedidos(data.filter((p) => p.usuario_id === tokenData.id));
        })
        .catch(() => toast.error(t("usuarios.userInfo.pedidosError")))
        .finally(() => setLoadingPedidos(false));
    }
    setShowPedidos((prev) => !prev);
  };

  // Sin sesión -> alerta + botón login
  if (!tokenData?.id) {
    return (
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, textAlign: "center" }}>
        <Alert severity="warning" sx={{ mb: 2 }}>
          {t("usuarios.userInfo.loginWarning")}
        </Alert>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/user/login")}
        >
          {t("usuarios.userInfo.loginButton")}
        </Button>
      </Box>
    );
  }

  // Perfil cargando
  if (!profile) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography>{t("usuarios.userInfo.loading")}</Typography>
      </Box>
    );
  }

  // Campos de perfil
  const infoFields = [
    { key: "email", value: profile.Correo },
    { key: "username", value: profile.Username },
    { key: "firstName", value: profile.Nombre },
    { key: "lastName", value: profile.Apellido },
    { key: "role", value: profile.rol?.Rol || "-" },
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4, px: 2 }}>
      <Card>
        <CardContent>
          <IconButton
            onClick={() => navigate("/alojamientos")}
            sx={{ mb: 2, p: 0 }}
            aria-label={t("usuarios.mantenimiento.back")}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography variant="h5" gutterBottom>
            {t("usuarios.userInfo.title")}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <List disablePadding>
            {infoFields.map(({ key, value }) => (
              <ListItem key={key} sx={{ px: 0, py: 1 }}>
                <ListItemText
                  primary={t(`usuarios.userInfo.${key}`)}
                  secondary={value}
                />
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleShowPedidos}
          >
            {t("usuarios.userInfo.myOrders")}
          </Button>

          {showPedidos && (
            <Box sx={{ mt: 3 }}>
              {loadingPedidos ? (
                <Typography textAlign="center">
                  {t("usuarios.userInfo.loadingOrders")}
                </Typography>
              ) : pedidos.length > 0 ? (
                <Grid container spacing={2}>
                  {pedidos.map((order) => (
                    <Grid key={order.id} item xs={12} sm={6} md={4}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" gutterBottom>
                            {t("usuarios.userInfo.orderNumber", {
                              number: order.id,
                            })}
                          </Typography>
                          <Typography variant="body2">
                            {t("usuarios.userInfo.date")}: {order.fecha}
                          </Typography>
                          <Typography variant="body2">
                            {t("usuarios.userInfo.status")}: {order.estado}
                          </Typography>
                          <Typography variant="body2">
                            {t("usuarios.userInfo.total")}: ${order.total}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography textAlign="center">
                  {t("usuarios.userInfo.noOrders")}
                </Typography>
              )}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
