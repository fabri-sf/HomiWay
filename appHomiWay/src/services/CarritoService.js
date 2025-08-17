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
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

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