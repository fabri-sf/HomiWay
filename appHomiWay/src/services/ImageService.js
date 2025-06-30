import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'api/upload-image.php';

class ImageService {
  createImage(formData) {
    return axios.post(BASE_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}
export default new ImageService()