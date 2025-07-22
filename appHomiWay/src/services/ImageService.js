import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "imagen";

class ImageService {
  upload(alojamientoId, file) {
    const form = new FormData();
    form.append("file", file);
    form.append("alojamiento_id", alojamientoId);
    return axios.post(BASE_URL, form, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }

  getByAlojamiento(idAloj) {
    return axios.get(`${BASE_URL}/getByAlojamiento/${idAloj}`);
  }

  getFirst(idAloj) {
    return axios.get(`${BASE_URL}/getFirst/${idAloj}`);
  }
}

export default new ImageService();