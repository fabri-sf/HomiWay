import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "servicio";

class ServicioService {

  getAll() {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    return axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getByAlojamiento(id) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    return axios.get(`${BASE_URL}/getByAlojamiento/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export default new ServicioService();