import { getUsersApi } from "../api/usersApi";

export const getUsers = async () => {
  const data = await getUsersApi();

  return data.map(user => ({
    id: user.id,
    nombre: user.name,
    correo: user.email,
    telefono: user.phone
  }));
};
