import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'promocion';

class PromocionService {
    
  getPromotions() {
    const user = localStorage.getItem('user')
    const token =user? user.replace(/^"|"$/g,''):''
    console.log("Token", token)
    return axios.get(BASE_URL,{
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
  }

    getToken() {
    const user = localStorage.getItem('user');
    return user ? user.replace(/^"|"$/g, '') : '';
  }

  getActorById(PromocionId) {
    return axios.get(BASE_URL + '/' + PromocionId);
  }
 // Obtener promociones por categoría de alojamiento
  getPromotionsByCategoria(categoria) {
    const token = this.getToken();
    return axios.get(`${BASE_URL}/promocionesPorCategoria/${categoria}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // Obtener alojamientos con promociones aplicadas
  getAlojamientosConPromociones() {
    const token = this.getToken();
    return axios.get(`${BASE_URL}/alojamientosConPromociones`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }

  // (Opcional) Calcular el precio con descuento usando la API
  calcularPrecio(precioOriginal, promocionID) {
    const token = this.getToken();
    return axios.post(`${BASE_URL}/calcularPrecio`, {
      precioOriginal,
      promocionID
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


}

export default new PromocionService();
