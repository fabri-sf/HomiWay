import React from 'react';
import PropTypes from 'prop-types';
import {
  Container,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Header from './Header';
import { Footer } from './Footer';
import { Toaster } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

Layout.propTypes = { children: PropTypes.node.isRequired };

export function Layout({ children }) {
  const { i18n } = useTranslation() || {};
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Header />

      {/* Selector de idioma fijo y más alejado del borde derecho */}
      {i18n && (
        <FormControl
          size="small"
          sx={{
            position: 'fixed',
            top: isMobile ? '0.5rem' : '1rem',
            right: isMobile ? '6.5rem' : '10rem', // más a la izquierda
            zIndex: 1000,
            backgroundColor: 'background.paper',
            borderRadius: '4px',
            boxShadow: 1,
            minWidth: isMobile ? '60px' : '80px'
          }}
        >
          <Select
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            displayEmpty
            inputProps={{ 'aria-label': 'Idioma' }}
            sx={{
              height: '36px',
              fontSize: isMobile ? '0.75rem' : '0.875rem',
              '& .MuiSelect-select': {
                paddingTop: '6px',
                paddingBottom: '6px'
              }
            }}
          >
            <MenuItem value="es">ES</MenuItem>
            <MenuItem value="en">EN</MenuItem>
          </Select>
        </FormControl>
      )}

      <Container maxWidth="xl" sx={{ pt: 2, pb: 6 }}>
        <Toaster position="bottom-right" />
        {children}
      </Container>

      <Footer />
    </>
  );
}