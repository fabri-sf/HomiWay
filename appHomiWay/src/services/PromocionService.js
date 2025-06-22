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

  getActorById(PromocionId) {
    return axios.get(BASE_URL + '/' + PromocionId);
  }
}

export default new PromocionService();
