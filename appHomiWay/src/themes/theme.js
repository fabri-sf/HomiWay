import { createTheme } from '@mui/material/styles';

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32', // Verde del logo
      light: '#4CAF50', // Verde más claro
      dark: '#1B5E20', // Verde oscuro
    },
    secondary: {
      main: '#4CAF50', // Verde más claro
    },
    background: {
      default: '#fafaf7', // Verde muy claro para fondo (corregido)
    },
    text: {
      primary: '#263238',
    },
    // Colores personalizados para estados
    custom: {
      vigente: '#FF4D4D', // Rojo vibrante
      aplicado: '#D3D3D3', // Gris suave
      pendiente: '#ADD8E6', // Azul claro
      precioOriginal: '#9E9E9E', // Gris para precio original
      precioDescuento: '#FF5722', // Naranja para precio con descuento
      
      // Nuevos colores agregados para el componente Home
      gradientStart: '#E8F5E8', // Verde muy claro para gradiente
      gradientMiddle: '#F1F8E9', // Verde muy suave
      gradientEnd: '#C8E6C9', // Verde claro
      accentGreen: '#66BB6A', // Verde intermedio
      surfaceGreen: 'rgba(46, 125, 50, 0.1)', // Verde con transparencia para superficies
      borderGreen: 'rgba(46, 125, 50, 0.3)', // Verde con transparencia para bordes
      hoverGreen: 'rgba(46, 125, 50, 0.15)', // Verde hover
    }
  },
});