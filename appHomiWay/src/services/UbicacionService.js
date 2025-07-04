import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'ubicacion';

class UbicacionService {
  getUbicacionById(id) {
    const user = localStorage.getItem('user');
    const token = user ? user.replace(/^"|"$/g, '') : '';
    return axios.get(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

export default new UbicacionService();