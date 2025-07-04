import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'resena';

class ResenaService {
  getByAlojamiento(idAlojamiento) {
    const user = localStorage.getItem('user');
    const token = user ? user.replace(/^"|"$/g, '') : '';
    return axios.get(`${BASE_URL}/getByAlojamiento/${idAlojamiento}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

export default new ResenaService();