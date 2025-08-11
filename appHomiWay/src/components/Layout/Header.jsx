import { useContext, useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "../../context/UserContext";

// Imports para el Drawer lateral
import Drawer from "@mui/material/Drawer";
import MenuList from "@mui/material/MenuList";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export default function Header() {
  const { t } = useTranslation();

  // Contexto de usuario
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());
  useEffect(() => {
    setUserData(decodeToken());
  }, [user]);

  // Carrito
  const { cart, getCountItems } = useCart();

  // Menú usuario
  const [anchorElUser, setAnchorEl] = useState(null);
  const userMenuId = "user-menu";
  const handleUserMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };

  // Menú "más opciones" (mobile)
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  const menuOpcionesId = "badge-menu-mobile";
  const handleOpcionesMenuOpen = (e) => setMobileMoreAnchorEl(e.currentTarget);
  const handleOpcionesMenuClose = () => setMobileMoreAnchorEl(null);

  // Menú principal (desktop)
  const [anchorElPrincipal, setAnchorElPrincipal] = useState(null);
  const menuIdPrincipal = "menu-appbar";
  const handleClosePrincipalMenu = () => setAnchorElPrincipal(null);

  const userItems = [
    { name: t("header.login"), link: "/user/login", login: false },
    { name: t("header.registrarse"), link: "/user/create", login: false },
    { name: t("header.logout"), link: "/user/logout", login: true }
  ];

  // Elementos del menú principal
  const navItems = [
    { name: t("header.inicio"), link: "/", roles: null },
    { name: t("header.alojamientos"), link: "/alojamientos", roles: null },
    { name: t("header.promocionesDisponibles"), link: "/promocionesDis", roles: null },
    { name: t("header.pedidos"), link: "/pedidos", roles: null },
    { name: t("header.administracion"), link: "/admin/dashboard", roles: ["Administrador"] }
  ];

  // Drawer lateral y submenú "Mantenimientos"
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const theme = useTheme();
  const isMobileDrawer = useMediaQuery(theme.breakpoints.down("sm"));
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const toggleSubmenu = () => setSubmenuOpen((prev) => !prev);

  // Menú principal desktop
  const menuPrincipal = (
    <Box sx={{ display: { xs: "none", sm: "block" } }}>
      {navItems.map((item, i) => {
        if (item.roles) {
          if (userData && autorize({ requiredRoles: item.roles })) {
            return (
              <Button key={i} component={Link} to={item.link} color="secondary">
                <Typography textAlign="center">{item.name}</Typography>
              </Button>
            );
          }
        } else {
          return (
            <Button key={i} component={Link} to={item.link} color="secondary">
              <Typography textAlign="center">{item.name}</Typography>
            </Button>
          );
        }
        return null;
      })}
    </Box>
  );

  // Menú principal mobile
  const menuPrincipalMobile = (
    <Menu
      id={menuIdPrincipal}
      anchorEl={anchorElPrincipal}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "left" }}
      open={Boolean(anchorElPrincipal)}
      onClose={handleClosePrincipalMenu}
      sx={{ display: { xs: "block", md: "none" } }}
    >
      {navItems.map((page, i) => (
        <MenuItem key={i} component={Link} to={page.link} onClick={handleClosePrincipalMenu}>
          <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
        </MenuItem>
      ))}
    </Menu>
  );

  // Menú de usuario
  const userMenu = (
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
              <MenuItem key={i} component={Link} to={setting.link} onClick={handleUserMenuClose}>
                <Typography sx={{ textAlign: "center" }}>{setting.name}</Typography>
              </MenuItem>
            );
          } else if (!setting.login && Object.keys(userData).length === 0) {
            return (
              <MenuItem key={i} component={Link} to={setting.link} onClick={handleUserMenuClose}>
                <Typography sx={{ textAlign: "center" }}>{setting.name}</Typography>
              </MenuItem>
            );
          }
          return null;
        })}
      </Menu>
    </Box>
  );
    // Menú de opciones mobile (carrito / notificaciones)
  const menuOpcionesMobile = (
    <Menu
      id={menuOpcionesId}
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      <MenuItem>
        <IconButton size="large" color="inherit" component={Link} to="/rental/crear/">
          <Badge badgeContent={getCountItems(cart)} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <Typography sx={{ ml: 1 }}>{t("header.compras")}</Typography>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <Typography sx={{ ml: 1 }}>{t("header.notificaciones")}</Typography>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="primaryLight" sx={{ backgroundColor: "primaryLight.main" }}>
        <Toolbar>
          {/* Botón hamburguesa abre el Drawer */}
          <IconButton size="large" color="inherit" sx={{ mr: 2 }} onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>

          {/* Menú principal mobile (opcional, se mantiene) */}
          {menuPrincipalMobile}

          {/* Logo / enlace a home */}
          <Tooltip title={t("header.tooltipLogo")}>
            <IconButton size="large" edge="end" component="a" href="/" color="primary">
              <img src="/src/assets/logo.png" alt={t("homePage.logoAlt")} style={{ width: 30, height: 30 }} />
            </IconButton>
          </Tooltip>

          {/* Menú principal desktop */}
          {menuPrincipal}

          <Box sx={{ flexGrow: 1 }} />

          {/* Iconos carrito y notificaciones en desktop */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton size="large" color="inherit" component={Link} to="/rental/crear/">
              <Badge badgeContent={getCountItems(cart)} color="primary">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
            <IconButton size="large" color="inherit">
              <Badge badgeContent={17} color="primary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Box>

          {/* Menú usuario */}
          {userMenu}

          {/* Botón "más" en mobile */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={menuOpcionesId}
              aria-haspopup="true"
              onClick={handleOpcionesMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menú opciones mobile */}
      {menuOpcionesMobile}

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
    </Box>
  );
}