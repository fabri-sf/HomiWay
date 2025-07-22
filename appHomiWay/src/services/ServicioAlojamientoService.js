import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL + "servicio_alojamiento";

class ServicioAlojamientoService {

  createAssociation(idAloj, idServicio) {
    return axios.post(BASE_URL, {
      ID_Alojamiento: idAloj,
      ID_Servicio: idServicio
    });
  }

  getByAlojamiento(idAloj) {
    return axios.get(`${BASE_URL}/getByAlojamiento/${idAloj}`);
  }
}

export default new ServicioAlojamientoService();