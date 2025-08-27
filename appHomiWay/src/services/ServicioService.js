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
  createServicio(data) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    return axios.post(BASE_URL, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
  }

  getById(id) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    return axios.get(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteServicio(id) {
    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    return axios.delete(`${BASE_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateServicio(id, fields) {
    console.log("[ServicioService] → updateServicio() id:", id);
    console.log("[ServicioService] → updateServicio() fields:", fields);

    const formData = new FormData();
    formData.append("ID", id);

    Object.entries(fields).forEach(([key, value]) => {
      console.log("[ServicioService]   append", key, value);
      if (value != null) {
        formData.append(key, value);
      }
    });

    for (let [k, v] of formData.entries()) {
      console.log("[ServicioService]   formData entry:", k, "=", v);
    }

    const token = localStorage.getItem("user")?.replace(/^"|"$/g, "");
    return axios
      .post(BASE_URL, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("[ServicioService] ← response:", res.status, res.data);
        return res;
      })
      .catch((err) => {
        console.error(
          "[ServicioService] ← error.status:",
          err.response?.status
        );
        console.error(
          "[ServicioService] ← error.data:",
          err.response?.data || err.message
        );
        throw err;
      });
  }
}
export default new ServicioService();
