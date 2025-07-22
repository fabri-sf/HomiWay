import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'usuario';

class UsuarioService {
  getUsuarios() {
    return axios.get(BASE_URL);
  }

  getUsuarioPorID(idUsuario) {
    return axios.get(`${BASE_URL}/${idUsuario}`);
  }

  registrarUsuario(usuario) {
    return axios.post(BASE_URL, JSON.stringify(usuario), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  loginUsuario(usuario) {
    return axios.post(`${BASE_URL}/login/`, JSON.stringify(usuario), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export default new UsuarioService();