import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'alojamiento';

class AlojamientoService {
  getAlojamientos() {
    const user = localStorage.getItem('user');
    const token = user ? user.replace(/^"|"$/g, '') : '';
    console.log("Token", token);
    return axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  getAlojamientoById(id) {
    const user = localStorage.getItem('user');
    const token = user ? user.replace(/^"|"$/g, '') : '';
    return axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

export default new AlojamientoService();
