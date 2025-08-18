import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'factura';

class FacturaService {
  // Método auxiliar para obtener el token y datos del usuario
  getUserData() {
    try {
      const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
      if (!token) {
        throw new Error('No token found');
      }
      
      const userData = jwtDecode(token);
      return { token, userData };
    } catch (error) {
      console.error('Error getting user data:', error);
      throw new Error('Invalid or missing authentication token');
    }
  }

  // Obtener todas las facturas
  getFacturas() {
    const { token } = this.getUserData();
    return axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener factura por ID
  getFacturaById(id) {
    const { token } = this.getUserData();
    return axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener facturas por usuario
  getFacturasByUsuario() {
    const { token, userData } = this.getUserData();
    const userId = userData.id || userData.ID;
    
    if (!userId) {
      throw new Error('User ID not found in token');
    }
    
    return axios.get(`${BASE_URL}/usuario/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener reservas facturables
  getReservasFacturables() {
    const { token, userData } = this.getUserData();
    const userId = userData.id || userData.ID;
    
    if (!userId) {
      throw new Error('User ID not found in token');
    }
    
    return axios.get(`${BASE_URL}/reservasFacturables/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Crear factura
  createFactura(data) {
    const { token } = this.getUserData();
    return axios.post(`${BASE_URL}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Registrar pago
  registrarPago(data) {
    const { token } = this.getUserData();
    return axios.post(`${BASE_URL}/registrarPago`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Obtener detalles de factura
  getDetallesFactura(idFactura) {
    const { token } = this.getUserData();
    return axios.get(`${BASE_URL}/detalles/${idFactura}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
}

export default new FacturaService();