// src/components/User/UserInfo.jsx

import React, { useState, useEffect, useContext } from "react";
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
  Alert
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { UserContext } from "../../context/UserContext";
import UsuarioService from "../../services/UsuarioService";

export default function UserInfo() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { decodeToken } = useContext(UserContext);

  const tokenData = decodeToken();
  const [profile, setProfile] = useState(null);

  // efecto siempre definido, pero solo dispara fetch si hay sesión
  useEffect(() => {
    if (!tokenData?.id) return;

    UsuarioService.getUsuarioPorID(tokenData.id)
      .then(res => setProfile(res.data))
      .catch(() => setProfile(null));
  }, [tokenData]);

  // si no hay sesión, mostramos alerta + botón login
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

  // mientras carga el perfil
  if (!profile) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography>{t("usuarios.userInfo.loading")}</Typography>
      </Box>
    );
  }

  const infoFields = [
    { key: "email",     value: profile.Correo },
    { key: "username",  value: profile.Username },
    { key: "firstName", value: profile.Nombre },
    { key: "lastName",  value: profile.Apellido },
    { key: "role",      value: profile.rol?.Rol || "-" }
  ];

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
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
        </CardContent>
      </Card>
    </Box>
  );
}
