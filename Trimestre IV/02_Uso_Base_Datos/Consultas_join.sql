USE alphamind;

-- Nombres de funcionarios y el nombre del cargo que tienen.
SELECT f.primer_nombre, c.nombre_cargo
FROM funcionario f
INNER JOIN cargo c ON f.codigo_cargo = c.codigo_cargo;

-- Título de tarea y el nombre de a quien fue asignado.
SELECT t.titulo AS Tarea,  f.primer_nombre AS Asignado
FROM tarea t
INNER JOIN asignacion_tarea at ON t.id_tarea = at.Tarea_idTarea
INNER JOIN usuario u ON at.Asignado_a_idUsuario = u.id_usuario
INNER JOIN funcionario f ON f.id_usuario = u.id_usuario;

-- Mensajes y sus archivos adjuntos
SELECT m.txt_mensaje AS Mensaje, a.url_archivo AS Archivo_adjunto
FROM mensaje m
LEFT JOIN archivo_adjunto aa ON m.idMensaje = aa.mensaje_idMensaje
LEFT JOIN archivo a ON aa.archivo_idArchivo = a.idArchivo;

-- Nombre del usuario, tarea asignado y su estado actual
SELECT f.primer_nombre AS Nombre, t.titulo AS Tarea, et.estado_actual AS Estado
FROM entregable_tarea AS etg
JOIN usuario AS u ON etg.Usuario_idUsuario = u.id_usuario
JOIN funcionario AS f ON f.id_usuario = u.id_usuario
JOIN tarea AS  t ON etg.Tarea_idTarea = t.id_tarea
JOIN estado_tarea AS et ON etg.Estado_Tarea_idEstado_Tarea = et.idEstado_Tarea;

-- Nombre de usuario que envió mensajes en chat directo
SELECT c.tipo_de_chat AS Tipo_Chat, f.primer_nombre AS Nombre
FROM chat AS c
JOIN usuario AS u ON c.Usuario_id_Usuario = u.id_usuario
JOIN funcionario AS f ON f.id_usuario = u.id_usuario
WHERE c.tipo_de_chat = 'Directo';

-- Mensaje enviado y su url de archivo
SELECT m.txt_mensaje AS Mensaje, a.url_archivo AS URL
FROM mensaje AS m
JOIN archivo_adjunto AS aa ON m.idMensaje = aa.mensaje_idMensaje
JOIN archivo AS a ON aa.archivo_idArchivo = a.idArchivo;

-- Usuario y tipo de rol
SELECT u.id_usuario, r.tipo_de_rol
FROM usuario AS u
JOIN rol AS r ON u.id_rol = r.id_rol;

-- Nombre comleto con su cargo y rol 
SELECT 
  CONCAT(f.primer_nombre, ' ',
         IFNULL(f.segundo_nombre, ''), ' ',
         f.primer_apellido, ' ',
         IFNULL(f.segundo_apellido, '')) AS nombre_completo,
  c.nombre_cargo,
  r.tipo_de_rol
FROM funcionario f
JOIN cargo c ON f.codigo_cargo = c.codigo_cargo
JOIN usuario u ON f.id_usuario = u.id_usuario
JOIN rol r ON u.id_rol = r.id_rol;

-- Nombre completo de usuario y su estado
SELECT 
  CONCAT(f.primer_nombre, ' ', IFNULL(f.segundo_nombre, ''), ' ',
         f.primer_apellido, ' ', IFNULL(f.segundo_apellido, '')) AS nombre_completo,
  e.tipo_de_estado AS estado_usuario
FROM funcionario AS f
JOIN usuario u ON f.id_usuario = u.id_usuario
JOIN estado e ON u.id_estado = e.id_estado;

-- Nombre de funcionario, tipo de documento y documento
SELECT 
  CONCAT(f.primer_nombre, ' ', IFNULL(f.segundo_nombre, ''), ' ',
         f.primer_apellido, ' ', IFNULL(f.segundo_apellido, '')) AS nombre_completo,
  td.tipo_doc,
  f.num_documento
FROM funcionario AS f
JOIN tipo_documento AS td ON f.cod_tipo_doc = td.cod_tipo_doc;

-- Tarea y quien la asigno
SELECT 
  t.titulo,
  CONCAT(f.primer_nombre, ' ', f.primer_apellido) AS asignado_por
FROM asignacion_tarea at
JOIN tarea t ON at.Tarea_idTarea = t.id_tarea
JOIN usuario u ON at.Asignado_por_idUsuario = u.id_usuario
JOIN funcionario f ON u.id_usuario = f.id_usuario;

-- Nombre de funcionario y en que tipo de chat a participado
SELECT 
  CONCAT(f.primer_nombre, ' ', f.primer_apellido) AS nombre_usuario,
  c.tipo_de_chat
FROM chat AS c
JOIN usuario AS u ON c.Usuario_id_Usuario = u.id_usuario
JOIN funcionario AS f ON u.id_usuario = f.id_usuario;


-- Tarea, funcionario asignado y estado entregado
SELECT 
  t.titulo AS Tarea,
  CONCAT(f.primer_nombre, ' ', IFNULL(f.segundo_nombre, ''), ' ', f.primer_apellido, ' ', IFNULL(f.segundo_apellido, '')) AS Funcionario,
  et.estado_actual AS Estado
FROM entregable_tarea e
JOIN usuario u ON e.Usuario_idUsuario = u.id_usuario
JOIN funcionario f ON f.id_usuario = u.id_usuario
JOIN tarea t ON e.Tarea_idTarea = t.id_tarea
JOIN estado_tarea et ON e.Estado_Tarea_idEstado_Tarea = et.idEstado_Tarea
WHERE et.estado_actual IN ('Entregado con retraso', 'Completado');

-- Funcionario y cantidad de tareas asignadas
SELECT 
  CONCAT(f.primer_nombre, ' ', f.primer_apellido) AS nombre_funcionario,
  COUNT(at.idAsignacion) AS tareas_asignadas
FROM funcionario f
JOIN usuario u ON f.id_usuario = u.id_usuario
LEFT JOIN asignacion_tarea at ON u.id_usuario = at.Asignado_a_idUsuario
GROUP BY f.num_documento;
-- Funcionario, cargo y estado de vacaciones
SELECT 
  CONCAT(f.primer_nombre, ' ', IFNULL(f.segundo_nombre, ''), ' ', f.primer_apellido) AS Funcionario,
  c.nombre_cargo AS Cargo,
  e.tipo_de_estado AS Estado
FROM funcionario f
JOIN usuario u ON f.id_usuario = u.id_usuario
JOIN estado e ON u.id_estado = e.id_estado
JOIN cargo c ON f.codigo_cargo = c.codigo_cargo
WHERE e.tipo_de_estado = 'Vacaciones';
