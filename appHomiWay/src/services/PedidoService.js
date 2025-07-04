import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'pedido';

class PedidoService {
  
  // Método para obtener el token de autorización
  getAuthHeaders() {
    const user = localStorage.getItem('user');
    const token = user ? user.replace(/^"|"$/g, '') : '';
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
  }

  getPedidos() {
    return axios.get(BASE_URL, this.getAuthHeaders());
  }

  getPedidoById(pedidoId) {
    return axios.get(`${BASE_URL}/${pedidoId}`, this.getAuthHeaders());
  }

 
  getFacturaCompleta(pedidoId) {
    return axios.get(`${BASE_URL}/factura/${pedidoId}`, this.getAuthHeaders());
  }

  async getProductosPedido(pedidoId) {
    try {
      const response = await this.getFacturaCompleta(pedidoId);
      return {
        productos: response.data.productos,
        productos_personalizados: response.data.productos_personalizados
      };
    } catch (error) {
      console.error('Error obteniendo productos del pedido:', error);
      throw error;
    }
  }

  async getClientePedido(pedidoId) {
    try {
      const response = await this.getFacturaCompleta(pedidoId);
      return response.data.cliente;
    } catch (error) {
      console.error('Error obteniendo cliente del pedido:', error);
      throw error;
    }
  }

  async getResumenPedido(pedidoId) {
    try {
      const response = await this.getFacturaCompleta(pedidoId);
      return {
        ...response.data.resumen,
        metodo_pago: response.data.metodo_pago
      };
    } catch (error) {
      console.error('Error obteniendo resumen del pedido:', error);
      throw error;
    }
  }
  async getPedidosResumidos() {
    try {
      const response = await this.getPedidos();
      return response.data.map(pedido => ({
        id: pedido.ID,
        fecha: pedido.Fecha,
        estado: pedido.Estado,
        total: pedido.Total,
        usuario_id: pedido.ID_Usuario
      }));
    } catch (error) {
      console.error('Error obteniendo pedidos resumidos:', error);
      throw error;
    }
  }
}

export default new PedidoService();