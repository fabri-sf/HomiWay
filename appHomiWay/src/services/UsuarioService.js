import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "usuario";

class UsuarioService {
  getUsuarios() {
    return axios.get(BASE_URL);
  }

  getUsuarioPorID(idUsuario) {
    return axios.get(`${BASE_URL}/${idUsuario}`);
  }

  registrarUsuario(usuario) {
    console.log("→ PAYLOAD registrarUsuario:", usuario);
    return axios.post(BASE_URL, usuario);
  }

  loginUsuario(usuario) {
    return axios.post(`${BASE_URL}/login/`, JSON.stringify(usuario), {
      headers: { "Content-Type": "application/json" },
    });
  }

  updateRol(idUsuario, body) {
    console.log("POST /usuario (update)", idUsuario, body);
    const payload = { ID: idUsuario, ...body };
    return axios.post(BASE_URL, JSON.stringify(payload), {
      headers: { "Content-Type": "application/json" },
    });
  }

  changePassword(idUsuario, newPassword) {
    console.log("→ changePassword payload:", { idUsuario, newPassword });
    return axios.put(
      `${BASE_URL}/${idUsuario}/password`,
      { newPassword },
      { headers: { "Content-Type": "application/json" } }
    );
  }
}

export default new UsuarioService();
