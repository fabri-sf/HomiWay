import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'reserva';

class ReservaService {
  
  // ========= Helpers =========
  getToken() {
    const user = localStorage.getItem('user');
    return user ? user.replace(/^"|"$/g, '') : '';
  }

  getAuthHeaders() {
    return { 
      Authorization: `Bearer ${this.getToken()}`,
      'Content-Type': 'application/json'
    };
  }

  // ========= Métodos del controller =========

  // Listar todas las reservas
  getReservas() {
    console.log('URL completa:', BASE_URL);
    return axios.get(BASE_URL, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener una reserva por ID
  getReservaById(idReserva) {
    const url = `${BASE_URL}/get/${idReserva}`;
    console.log('GET Reserva URL:', url);
    return axios.get(url, {
      headers: this.getAuthHeaders()
    });
  }

  // Obtener reservas por usuario
  getReservasByUsuario(usuarioId) {
    const url = `${BASE_URL}/reservasPorUsuario/${usuarioId}`;
    console.log('GET Reservas Usuario URL:', url);
    return axios.get(url, {
      headers: this.getAuthHeaders()
    });
  }

  // Crear reserva de alojamiento
  createReserva(reserva) {
    const url = `${BASE_URL}/create`;
    
    // Asegurar que los datos sean números donde corresponda
    const dataToSend = {
        ...reserva,
        ID_Alojamiento: parseInt(reserva.ID_Alojamiento),
        ID_Usuario: parseInt(reserva.ID_Usuario)
    };

    console.log('Enviando datos:', dataToSend);
    
    return axios.post(url, dataToSend, {
        headers: this.getAuthHeaders()
    }).catch(error => {
        console.error('Error detallado:', {
            url,
            requestData: dataToSend,
            response: error.response?.data,
            status: error.response?.status,
            headers: error.config?.headers
        });
        throw error;
    });
}
  // Crear reserva de servicio
  // Crear reserva de servicio - VERSION MEJORADA
createReservaServicio(servicioData) {
  const url = `${BASE_URL}/createServicio`;
  
  // Validar datos antes de enviar
  if (!servicioData.ID_AlojamientoDetalle || !servicioData.ID_Servicio || !servicioData.Fecha_Inicio) {
    throw new Error('Datos incompletos para crear servicio');
  }
  
  // Asegurar que los IDs sean números
  const dataToSend = {
    ...servicioData,
    ID_AlojamientoDetalle: parseInt(servicioData.ID_AlojamientoDetalle),
    ID_Servicio: parseInt(servicioData.ID_Servicio)
  };
  
  console.log('🛎️ POST Create Servicio URL:', url);
  console.log('📋 Datos servicio (validados):', dataToSend);
  console.log('🔐 Headers:', this.getAuthHeaders());
  
  return axios.post(url, dataToSend, {
    headers: this.getAuthHeaders(),
    timeout: 10000 // 10 segundos timeout
  }).then(response => {
    console.log('✅ Servicio creado exitosamente:', response.data);
    return response;
  }).catch(error => {
    console.error('❌ Error al crear servicio:', {
      url,
      requestData: dataToSend,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
      headers: error.config?.headers,
      message: error.message
    });
    
    // Mejorar el mensaje de error
    if (error.response?.status === 500) {
      const serverMessage = error.response?.data?.message || 'Error interno del servidor';
      throw new Error(`Error del servidor: ${serverMessage}`);
    } else if (error.response?.status === 401) {
      throw new Error('No autorizado - verifica tu sesión');
    } else if (error.response?.status === 422) {
      throw new Error('Datos inválidos - verifica los campos');
    }
    
    throw error;
  });
}

  // Obtener servicios por reserva
  getServiciosByReserva(idReserva) {
    const url = `${BASE_URL}/getServicios/${idReserva}`;
    console.log('GET Servicios URL:', url);
    return axios.get(url, {
      headers: this.getAuthHeaders()
    });
  }

  // Actualizar estado de reserva
  updateEstadoReserva(idReserva, estado) {
    const url = `${BASE_URL}/updateEstado/${idReserva}`;
    console.log('PUT Update Estado URL:', url);
    return axios.put(url, { Estado: estado }, {
      headers: this.getAuthHeaders()
    });
  }

  // Confirmar reserva
  confirmarReserva(idReserva) {
    const url = `${BASE_URL}/confirmar/${idReserva}`;
    console.log('PUT Confirmar URL:', url);
    return axios.put(url, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Cancelar reserva
  cancelarReserva(idReserva) {
    const url = `${BASE_URL}/cancelar/${idReserva}`;
    console.log('PUT Cancelar URL:', url);
    return axios.put(url, {}, {
      headers: this.getAuthHeaders()
    });
  }

  // Método de prueba para verificar conectividad
  testConnection() {
    console.log('Probando conexión...');
    console.log('BASE_URL:', BASE_URL);
    console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
    
    return axios.get(BASE_URL + '/test', {
      headers: this.getAuthHeaders()
    }).catch(error => {
      console.error('Error de conexión:', error);
      return error.response || error;
    });
  }
}

export default new ReservaService();