import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL + "carrito";

class CarritoService {
  getCarritos() {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "") || "";
    console.log("🌐 GET", BASE_URL, "Token:", token);
    return axios.get(BASE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getCarritoByUsuario(usuarioId) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "") || "";
    const url = `${BASE_URL}/${usuarioId}`;
    console.log("🌐 GET", url, "Token:", token);
    return axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createCarrito({ usuario_id, alojamiento_id }) {
    const token = localStorage
      .getItem("user")
      ?.replace(/^"|"$/g, "") || "";

    return axios.post(
      `${BASE_URL}/create`,
      { usuario_id, alojamiento_id },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  deleteCarrito(carritoId) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "") || "";
    const url = `${BASE_URL}/delete/${carritoId}`;
    console.log("🌐 GET", url, "Token:", token);
    return axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  clearCarrito(usuarioId) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "") || "";
    const url = `${BASE_URL}/clear/${usuarioId}`;
    console.log("🌐 GET", url, "Token:", token);
    return axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

export default new CarritoService();

/////////////////////
