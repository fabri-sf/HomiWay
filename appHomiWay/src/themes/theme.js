import { createTheme } from '@mui/material/styles'; 
export const appTheme= createTheme  ({ 


  
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
      default: '#F1F8E9', // Verde muy claro para fondo
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
      precioDescuento: '#FF5722' // Naranja para precio con descuento
    }
  },
});