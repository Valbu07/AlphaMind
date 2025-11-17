import axios from 'axios';

const API = 'http://localhost:3000/auth';

export const authService = {
  login: async ({ num_documento, contraseña }) => {
    const { data } = await axios.post(`${API}/login`, {
      funcionario: { num_documento },
      usuario: { contraseña }
    });
    return data;
  }
};