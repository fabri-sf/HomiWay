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
  deleteImage(id) {
      const token = localStorage.getItem('user')?.replace(/^"|"$/g, '');
      return axios.delete(
        `${BASE_URL}/delete/${id}`,
        { headers: { Authorization: `Bearer ${token}` }}
      );
    }
     // <-- Nuevo método para descargar el binario de la imagen
  getFile(filename) {
    return axios.get(`${BASE_URL}/file/${filename}`, {
      responseType: "blob",
    });
  }

}

export default new ImageService();