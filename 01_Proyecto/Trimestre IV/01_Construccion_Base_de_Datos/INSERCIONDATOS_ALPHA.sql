use alphamind;

-- Inserción de datos basicos
-- Usuarios
-- Tabla usuario
INSERT INTO usuario (contraseña, tipo_de_rol) VALUES 
('admin123', 'Administrador'),
('func456', 'Funcionario');

-- Tabla tipo_documento
INSERT INTO tipo_documento (tipo_doc) VALUES
('CC'),
('PA');

-- Tabla cargo
INSERT INTO cargo (nombre_cargo) VALUES
('Gerente'),
('Secretaria');

-- Tabla funcionario
INSERT INTO funcionario (num_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo_electronico, numero_telefonico, id_usuario, cod_tipo_doc, codigo_cargo) VALUES
(1001, 'Mauricio', 'José', 'Pérez', 'Gómez', 'mauro.perez@cediplus.com', '3001112233', 1, 1, 1),
(1002, 'Carlos', 'Andrés', 'Ruiz', 'Torres', 'carlos.ruiz@cediplus.com', '3002223344', 2, 2, 2);

-- Comunucación 
-- Tabla mensaje
INSERT INTO mensaje (txt_mensaje, fecha_hora) VALUES
('Hola, ya revisé la documentación.', '2025-01-05 10:30:00'),
('¿Puedes verificar la actividad pendiente?', '2025-01-05 11:00:00');

-- Tabla chat
INSERT INTO chat (tipo_de_Chat, mensaje_idMensaje, Usuario_id_Usuario) VALUES
('Directo', 1, 1),
('Directo', 2, 2);

-- Tabla archivo
INSERT INTO archivo (url_archivo, tipo_de_archivo) VALUES
('docs/acta1.pdf', 'PDF'),
('imgs/evidencia1.png', 'Imagen');

-- Tabla archivo_adjunto
INSERT INTO archivo_adjunto (mensaje_idMensaje, archivo_idArchivo) VALUES
(1, 1),
(2, 2);

-- Actividad
-- Tabla actividad
INSERT INTO actividad (asunto, descripcion, fecha_creacion, fecha_vencimiento, prioridad, fecha_de_entrega, estado_actual) VALUES
('Revisión de estados financieros', 'Revisar ingresos y egresos hasta el momento de 2025', '2025-11-17 08:00:00', '2025-11-20 17:00:00', 'Alta', NULL, 'Pendiente'),
('Actualización de base de datos', 'Migrar tablas y actualizar', '2025-11-18 09:00:00', '2025-11-21 17:00:00', 'Media', NULL, 'Pendiente');

-- Tabla asignacion_actividad
INSERT INTO asignacion_actividad (actividad_idActividad, Asignado_por_idUsuario, Asignado_a_idUsuario) VALUES
(1, 1, 2), 
(2, 1, 2); 

-- Tabla tarea
INSERT INTO tarea (tarea, actividad_id_Actividad) VALUES
('Preparar balance general', 1),
('Depurar registros duplicados', 2);
