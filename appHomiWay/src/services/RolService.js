import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BASE_URL + 'rol';

class RolService {
  getRoles() {
    return axios.get(BASE_URL); 
  }

  getRolById(rolID) {
    return axios.get(`${BASE_URL}/${rolID}`);
  }

  getRolByUserID(usuarioID) {
    return axios.get(`${BASE_URL}/getRolUser/${usuarioID}`);
  }
}

export default new RolService();