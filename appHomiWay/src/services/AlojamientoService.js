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

  createAlojamiento(data) {
  const user = localStorage.getItem('user');
  const token = user ? user.replace(/^"|"$/g, '') : '';
  return axios.post(`${BASE_URL}`, JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
  });
  }

 updateAlojamiento(id, data) {
  const user = localStorage.getItem('user');
  const token = user ? user.replace(/^"|"$/g, '') : '';

  return axios.put(`${BASE_URL}/update/${id}`, JSON.stringify(data), {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });
}

  deleteLogicoAlojamiento(id) {
  const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
  return axios.get(`${BASE_URL}/logico/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

getCategorias() {
    const user = localStorage.getItem('user');
    const token = user ? user.replace(/^"|"$/g, '') : '';

    return axios.get(`${BASE_URL}/categorias`, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(response => { 
        if (Array.isArray(response.data)) {
            return response.data;
        }
        else {
            return response.data.map(item => item.Categoria || item);
        }
    });
}

}

export default new AlojamientoService();
