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
import { useTranslation } from 'react-i18next'; // Importación añadida

export function Footer() {
  const { t } = useTranslation(); // Hook para traducciones

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
        marginTop: "auto"
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                {t('footer.nombreApp')} {/* Texto traducido */}
              </Typography>
              <Typography variant="body2">
                {t('footer.derechos', { year: new Date().getFullYear() })} {/* Texto con parámetro */}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>
                {t('footer.desarrolladoPor')} {/* Texto traducido */}
              </Typography>
              <Typography variant="body2">
                {t('footer.desarrollador1')} {/* Texto traducido */}
              </Typography>
              <Typography variant="body2">
                {t('footer.desarrollador2')} {/* Texto traducido */}
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: { xs: 'center', md: 'flex-end' }
            }}>
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
              
              <Typography variant="caption" sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                {t('footer.codigoCurso')} {/* Texto traducido */}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Toolbar>
  );
}