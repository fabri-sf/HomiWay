<<<<<<< HEAD
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
=======
// src/services/CarritoService.js

import axios from "axios";
//YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
const BASE = import.meta.env.VITE_BASE_URL.replace(/\/$/, "");
// El router usa el nombre exacto de la clase CarritoController como primer segmento
const CONTROLLER = "CarritoController";
const BASE_URL = `${BASE}/${CONTROLLER}`;

class CarritoService {
  /**
   * GET /CarritoController/index/:usuarioId
   */
  getByUsuario(usuarioId) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    return axios.get(
      `${BASE_URL}/index/${usuarioId}`,
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

<<<<<<< HEAD
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
=======
  /**
   * POST /CarritoController/store
   */
  addItem(usuarioId, alojamientoId) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    const url = `${BASE_URL}/store`;

    console.log("[CarritoService] POST →", url, {
      usuario_id: usuarioId,
      alojamiento_id: alojamientoId,
    });

    return axios.post(
      url,
      { usuario_id: usuarioId, alojamiento_id: alojamientoId },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  /**
   * DELETE /CarritoController/destroy/:carritoId
   */
  removeItem(carritoId) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    return axios.delete(
      `${BASE_URL}/destroy/${carritoId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  /**
   * DELETE /CarritoController/clear/:usuarioId
   */
  clear(usuarioId) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    return axios.delete(
      `${BASE_URL}/clear/${usuarioId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
}

export default new CarritoService();
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
