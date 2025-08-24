// src/components/Layout/Header.jsx

import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import Drawer from "@mui/material/Drawer";
import MenuList from "@mui/material/MenuList";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import MenuIcon from "@mui/icons-material/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LanguageIcon from "@mui/icons-material/Language";

import { useCart } from "../../hooks/useCart";
import CarritoService from "../../services/CarritoService";
import { UserContext } from "../../context/UserContext";

import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Header() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // Contexto usuario + payload
  const { user, decodeToken } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);

<<<<<<< HEAD
  // Verificación NUMÉRICA del rol: 1 = Admin, 2 = Cliente
  // Si userData.rol viene como string, lo convertimos a número
  const roleNum = Number(userData?.rol);
  const isAdmin = roleNum === 1;
=======
  // Carrito
  const { cart } = useCart();
  const countItems = cart.length;

  const isAuthenticated = Boolean(userData && userData.id);
  const navigate = useNavigate();
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0

  // Carrito count
  const { cart } = useCart();
  const [cartCount, setCartCount] = useState(0);
  useEffect(() => {
    const uid = userData?.id;
    if (!uid) return;
    CarritoService.getCarritoByUsuario(uid)
      .then(res => setCartCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(console.error);
    const onUpdate = e => setCartCount(e.detail);
    window.addEventListener("cartCountUpdated", onUpdate);
    return () => window.removeEventListener("cartCountUpdated", onUpdate);
  }, [userData]);

<<<<<<< HEAD
  // Menús estado
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);
=======
  // Menú "más opciones" (mobile)
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  const menuOpcionesId = "badge-menu-mobile";
  const handleOpcionesMenuOpen = (e) => setMobileMoreAnchorEl(e.currentTarget);
  const handleOpcionesMenuClose = () => setMobileMoreAnchorEl(null);

  const handleCartClick = () => {
    if (!isAuthenticated) {
      return toast.custom((t) => (
        <span>
          {t("cart.loginRequired")}
          <button
            onClick={() => navigate("/user/login")}
            style={{
              marginLeft: "0.5rem",
              background: "#4caf50",
              color: "#fff",
              border: "none",
              padding: "4px 8px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {t("header.login")}
          </button>
        </span>
      ));
    }
    navigate("/Carrito");
  };

  // Menú principal (desktop)
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
  const [anchorElPrincipal, setAnchorElPrincipal] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const menuUserId = "user-menu";
  const menuOpcionesId = "badge-menu-mobile";
  const menuPrincipalId = "menu-appbar";

  const theme = useTheme();
  const isMobileDrawer = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleDrawer = () => setDrawerOpen(v => !v);
  const toggleSubmenu = () => setSubmenuOpen(v => !v);
  const handleUserMenuOpen = e => setAnchorElUser(e.currentTarget);
  const handleUserMenuClose = () => {
    setAnchorElUser(null);
    setMobileMoreAnchorEl(null);
  };
  const handleMobileMenuOpen = e => setMobileMoreAnchorEl(e.currentTarget);
  const handleMobileMenuClose = () => setMobileMoreAnchorEl(null);
  const handlePrincipalMenuClose = () => setAnchorElPrincipal(null);

  // Items usuario
  const userItems = [
    { name: t("header.login"), link: "/user/login", login: false },
    { name: t("header.registrarse"), link: "/user/create", login: false },
    { name: t("header.logout"), link: "/user/logout", login: true },
  ];

  // Nav items con rol
  const navItems = [
    { name: t("header.inicio"), link: "/", roles: null },
    { name: t("header.alojamientos"), link: "/alojamientos", roles: null },
    {
      name: t("header.promocionesDisponibles"),
      link: "/promocionesDis",
      roles: null,
    },
    { name: t("header.pedidos"), link: "/pedidos", roles: null },
<<<<<<< HEAD
    { name: t("header.administracion"), link: "/admin/dashboard", roles: [1] },
=======
    {
      name: t("header.administracion"),
      link: "/admin/dashboard",
      roles: ["Administrador"],
    },
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
  ];

  // Menú principal desktop
  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {navItems.map((item, i) => {
        if (Array.isArray(item.roles) && !item.roles.includes(roleNum)) return null;
        return (
          <IconButton key={i} component={Link} to={item.link} color="inherit">
            <Typography>{item.name}</Typography>
          </IconButton>
        );
      })}
    </Box>
  );

  // Menú principal mobile
  const menuPrincipalMobile = (
    <Menu
      id={menuPrincipalId}
      anchorEl={anchorElPrincipal}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      keepMounted
      open={Boolean(anchorElPrincipal)}
      onClose={handlePrincipalMenuClose}
      sx={{ display: { xs: "block", md: "none" } }}
    >
<<<<<<< HEAD
      {navItems.map((item, i) => {
        if (Array.isArray(item.roles) && !item.roles.includes(roleNum)) return null;
        return (
          <MenuItem
            key={i}
            component={Link}
            to={item.link}
            onClick={handlePrincipalMenuClose}
          >
            {item.name}
          </MenuItem>
        );
      })}
=======
      {navItems.map((page, i) => (
        <MenuItem
          key={i}
          component={Link}
          to={page.link}
          onClick={handleClosePrincipalMenu}
        >
          <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
        </MenuItem>
      ))}
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
    </Menu>
  );

  // Menú usuario
  const userMenu = (
<<<<<<< HEAD
    <Menu
      sx={{ mt: "45px" }}
      id={menuUserId}
      anchorEl={anchorElUser}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorElUser)}
      onClose={handleUserMenuClose}
    >
      {userData && (
        <MenuItem disabled>
          <Typography variant="subtitle1">{userData.email}</Typography>
        </MenuItem>
      )}
      {userData && (
        <MenuItem
          onClick={() => {
            handleUserMenuClose();
            navigate("/user/UserInfo");
          }}
        >
          {t("header.moreInfo")}
        </MenuItem>
      )}
      {userItems.map((opt, i) => {
        const logged = Boolean(userData?.id);
        if (opt.login && logged) {
          return (
            <MenuItem
              key={i}
              component={Link}
              to={opt.link}
              onClick={handleUserMenuClose}
            >
              {opt.name}
            </MenuItem>
          );
        }
        if (!opt.login && !logged) {
          return (
            <MenuItem
              key={i}
              component={Link}
              to={opt.link}
              onClick={handleUserMenuClose}
            >
              {opt.name}
            </MenuItem>
          );
        }
        return null;
      })}
    </Menu>
  );

  // Menú mobile (carrito + notifs)
=======
    <Box sx={{ flexGrow: 0 }}>
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        sx={{ mt: "45px" }}
        id={userMenuId}
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        {userData && (
          <MenuItem>
            <Typography variant="subtitle1" gutterBottom>
              {userData.email}
            </Typography>
          </MenuItem>
        )}
        {userItems.map((setting, i) => {
          if (setting.login && userData && Object.keys(userData).length > 0) {
            return (
              <MenuItem
                key={i}
                component={Link}
                to={setting.link}
                onClick={handleUserMenuClose}
              >
                <Typography sx={{ textAlign: "center" }}>
                  {setting.name}
                </Typography>
              </MenuItem>
            );
          } else if (!setting.login && Object.keys(userData).length === 0) {
            return (
              <MenuItem
                key={i}
                component={Link}
                to={setting.link}
                onClick={handleUserMenuClose}
              >
                <Typography sx={{ textAlign: "center" }}>
                  {setting.name}
                </Typography>
              </MenuItem>
            );
          }
          return null;
        })}
      </Menu>
    </Box>
  );
  // Menú de opciones mobile (carrito / notificaciones)
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
  const menuOpcionesMobile = (
    <Menu
      id={menuOpcionesId}
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
<<<<<<< HEAD
      <MenuItem component={Link} to="/carrito" onClick={handleMobileMenuClose}>
        <Badge badgeContent={cartCount} color="primary">
          <ShoppingCartIcon />
        </Badge>
=======
      <MenuItem>
        <IconButton size="large" color="inherit" onClick={handleCartClick}>
          <Badge badgeContent={countItems} color="success">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
        <Typography sx={{ ml: 1 }}>{t("header.compras")}</Typography>
      </MenuItem>
      <MenuItem onClick={handleMobileMenuClose}>
        <Badge badgeContent={17} color="error">
          <NotificationsIcon />
        </Badge>
        <Typography sx={{ ml: 1 }}>{t("header.notificaciones")}</Typography>
      </MenuItem>
    </Menu>
  );

  return (
<<<<<<< HEAD
    <Box sx={{ flexGrow: 1, pt: 7, mb: 2 }}>
      <AppBar position="fixed" color="primaryLight" sx={{ backgroundColor: "white" }}>
        <Toolbar>
=======
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{ backgroundColor: "primaryLight.main" }}
      >
        <Toolbar>
          {/* Botón hamburguesa abre el Drawer */}
          <IconButton
            size="large"
            color="inherit"
            sx={{ mr: 2 }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0

          {/* Toggle hamburguesa NUMÉRICO: solo si roleNum===1 */}
          {isAdmin && (
            <IconButton size="large" color="inherit" sx={{ mr: 2 }} onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
          )}

          {menuPrincipalMobile}

          <Tooltip title={t("header.tooltipLogo")}>
<<<<<<< HEAD
            <IconButton component={Link} to="/" color="inherit">
              <img src="/src/assets/logo.png" alt={t("homePage.logoAlt")} width={30} height={30} />
=======
            <IconButton
              size="large"
              edge="end"
              component="a"
              href="/"
              color="primary"
            >
              <img
                src="/src/assets/logo.png"
                alt={t("homePage.logoAlt")}
                style={{ width: 30, height: 30 }}
              />
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
            </IconButton>
          </Tooltip>

          {menuPrincipal}

          <Box sx={{ flexGrow: 1 }} />

<<<<<<< HEAD
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" component={Link} to="/carrito">
              <Badge badgeContent={cartCount} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton color="inherit">
              <Badge badgeContent={17} color="error">
=======
          {/* Iconos carrito y notificaciones en desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              color="inherit"
              component={Link}
              to="/Carrito"
            >
              <Badge badgeContent={countItems} color="success">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="primary">
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              color="inherit"
              onClick={() => i18n.changeLanguage(i18n.language === "es" ? "en" : "es")}
              title={t("header.languageToggle")}
            >
              <LanguageIcon />
            </IconButton>
          </Box>

          <IconButton
            size="large"
            edge="end"
            aria-label="account of current user"
            aria-controls={menuUserId}
            aria-haspopup="true"
            onClick={handleUserMenuOpen}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={menuOpcionesId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {menuOpcionesMobile}
      {userMenu}

<<<<<<< HEAD
      {/* Drawer Lateral NUMÉRICO: solo si roleNum===1 */}
      {isAdmin && (
        <Drawer
          anchor={isMobileDrawer ? "bottom" : "left"}
          open={drawerOpen}
          onClose={toggleDrawer}
          sx={{
            "& .MuiDrawer-paper": {
              width: isMobileDrawer ? "100%" : 260,
              borderTopLeftRadius: isMobileDrawer ? 12 : 0,
              borderTopRightRadius: isMobileDrawer ? 12 : 0,
              p: 2,
              backgroundColor: "primaryLight.main",
            },
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
            {t("header.navegacion")}
          </Typography>
          <MenuList>
            <ListItemButton onClick={toggleSubmenu}>
              <ListItemText
                primary={t("header.mantenimientos")}
                primaryTypographyProps={{ color: "text.primary" }}
              />
              {submenuOpen ? "▲" : "▼"}
            </ListItemButton>
            <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
              <MenuList sx={{ pl: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <MenuItem
                  component={Link}
                  to="/resenas"
                  onClick={() => {
                    toggleDrawer();
                    setSubmenuOpen(false);
                  }}
                >
                  {t("header.resenas")}
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/promociones"
                  onClick={() => {
                    toggleDrawer();
                    setSubmenuOpen(false);
                  }}
                >
                  {t("header.promociones")}
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/alojamiento"
                  onClick={() => {
                    toggleDrawer();
                    setSubmenuOpen(false);
                  }}
                >
                  {t("header.listaAlojamientos")}
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/user/mantenimiento"
                  onClick={() => {
                    toggleDrawer();
                    setSubmenuOpen(false);
                  }}
                >
                  {t("header.mantenimientoUsuarios")}
                </MenuItem>
                <MenuItem
                  component={Link}
                  to="/servicios/mantenimiento"
                  onClick={() => {
                    toggleDrawer();
                    setSubmenuOpen(false);
                  }}
                >
                  {t("header.serviciosMantenimiento")}
                </MenuItem>
              </MenuList>
            </Collapse>
          </MenuList>
        </Drawer>
      )}
=======
      {/* Drawer lateral / inferior con sección Mantenimientos */}
      <Drawer
        anchor={isMobileDrawer ? "bottom" : "left"}
        open={drawerOpen}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: isMobileDrawer ? "100%" : 260,
            borderTopLeftRadius: isMobileDrawer ? 12 : 0,
            borderTopRightRadius: isMobileDrawer ? 12 : 0,
            p: 2,
            backgroundColor: "primaryLight.main",
          },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, color: "text.primary" }}>
          {t("header.navegacion")}
        </Typography>
        <MenuList>
          {/* Elementos principales del drawer */}
          <MenuItem component={Link} to="/resenas" onClick={toggleDrawer}>
            {t("header.resenas")}
          </MenuItem>

          <MenuItem component={Link} to="/promociones" onClick={toggleDrawer}>
            {t("header.promociones")}
          </MenuItem>

          {/* Submenu: Mantenimientos */}
          <ListItemButton onClick={toggleSubmenu}>
            <ListItemText
              primary={t("header.mantenimientos")}
              primaryTypographyProps={{ color: "text.primary" }}
            />
            {submenuOpen ? "▲" : "▼"}
          </ListItemButton>
          <Collapse in={submenuOpen} timeout="auto" unmountOnExit>
            <MenuList sx={{ pl: 2 }}>
              <MenuItem
                component={Link}
                to="/alojamiento"
                onClick={() => {
                  toggleDrawer();
                  setSubmenuOpen(false);
                }}
              >
                {t("header.listaAlojamientos")}
              </MenuItem>

              <MenuItem
                component={Link}
                to="/servicio/crear"
                onClick={() => {
                  toggleDrawer();
                  setSubmenuOpen(false);
                }}
              >
                {t("header.servicio")}
              </MenuItem>

              <MenuItem
                component={Link}
                to="/usuario/crear"
                onClick={() => {
                  toggleDrawer();
                  setSubmenuOpen(false);
                }}
              >
                {t("header.usuario")}
              </MenuItem>
            </MenuList>
          </Collapse>
        </MenuList>
      </Drawer>
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
    </Box>
  );
}
