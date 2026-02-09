export function getPrimerNombre(usuario) {
  return usuario?.primer_nombre || "";
}

export function getPrimerApellido(usuario) {
  return usuario?.primer_apellido || "";
}

export function getNombreCorto(usuario) {
  if (!usuario) return "";
  return `${getPrimerNombre(usuario)} ${getPrimerApellido(usuario)}`.trim();
}
