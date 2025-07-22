import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'ubicacion';

class UbicacionService {
  getAll() {
    const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
    return axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  getById(id) {
    const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
    return axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  create(data) {
    const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
    return axios.post(BASE_URL, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`
      }
    });
  }

  update(id, data) {
    const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
    return axios.put(`${BASE_URL}/${id}`, data, {
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${token}`
      }
    });
  }
}

export default new UbicacionService();