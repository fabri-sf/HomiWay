import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'resena';

function getToken() {
  const user = localStorage.getItem('user');
  return user ? user.replace(/^"|"$/g, '') : '';
}


class ResenaService {
  // Listar reseñas por alojamiento
  getByAlojamiento(idAlojamiento) {
    return axios.get(`${BASE_URL}/getByAlojamiento/${idAlojamiento}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });
  }

  // Listar todas las reseñas globales
  getAll() {
    return axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      }
    });
  }

  // Crear nueva reseña
  createResena(data) {
    return axios.post(BASE_URL, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
  }

  // Actualizar reseña existente
  updateResena(idResena, data) {
    return axios.put(`${BASE_URL}/${idResena}`, JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getToken()}`,
      },
    });
  }

  // Eliminar reseña de forma lógica
     deleteLogicoResena(idResena) {
    return axios.delete(
      `${BASE_URL}/logico/${idResena}`,       // <-- aquí agregamos "/logico"
      { headers: { Authorization: `Bearer ${getToken()}` } }
    );
  }


}

export default new ResenaService();