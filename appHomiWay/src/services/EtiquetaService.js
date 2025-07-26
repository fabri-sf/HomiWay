import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'etiqueta';

class EtiquetaService {
    
    getToken() {
    const user = localStorage.getItem('user');
    return user ? user.replace(/^"|"$/g, '') : '';
  }

createPromocionAlojamientos(etiqueta) {
  const token = this.getToken();
  return axios.post(`${BASE_URL}/create`, etiqueta, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

   applyPromocionByCategoria(categoria, ID_Promocion) {
    const token = this.getToken();
    return axios.post(`${BASE_URL}/createByCategoria`, {
      categoria,
      ID_Promocion
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }


}

export default new EtiquetaService();
