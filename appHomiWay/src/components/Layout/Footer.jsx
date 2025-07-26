import React from "react";
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Toolbar, 
  IconButton,
  Link
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Twitter,
  WhatsApp
} from "@mui/icons-material";

export function Footer() {
  return (
    <Toolbar
      component="footer"
      sx={{
        px: 2,
        width: "100%",
        backgroundColor: "primary.main",
        paddingTop: "1.5rem",
        paddingBottom: "1.5rem",
        color: "white",
        marginTop: "auto" // Para que quede pegado abajo si el contenido es corto
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Nombre de la aplicación y derechos */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                HomiWay
              </Typography>
              <Typography variant="body2">
                © {new Date().getFullYear()} Todos los derechos reservados
              </Typography>
            </Box>
          </Grid>

          {/* Desarrolladores */}
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                Desarrollado por:
              </Typography>
              <Typography variant="body2">
                Thaylin Barrueta López
              </Typography>
              <Typography variant="body2">
                Fabricio Sequeira Dávila
              </Typography>
            </Box>
          </Grid>

          {/* Redes sociales y código */}
          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-end' }
            }}>
              {/* Redes sociales */}
              <Box sx={{ mb: 1 }}>
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  href="https://facebook.com" 
                  target="_blank"
                >
                  <Facebook />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  href="https://instagram.com" 
                  target="_blank"
                >
                  <Instagram />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  href="https://twitter.com" 
                  target="_blank"
                >
                  <Twitter />
                </IconButton>
                <IconButton 
                  color="inherit" 
                  component={Link} 
                  href="https://wa.me/" 
                  target="_blank"
                >
                  <WhatsApp />
                </IconButton>
              </Box>
              
              {/* Código del curso */}
              <Typography variant="caption" sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                ISW-613
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Toolbar>
  );
}