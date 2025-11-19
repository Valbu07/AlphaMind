-- drop database alphamind;
-- Crear base de datos
CREATE DATABASE Alphamind;
USE Alphamind;

-- Usuarios
-- Crear tabla usuario
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    contraseña VARCHAR(200) NOT NULL,
    tipo_de_rol ENUM("Funcionario","Administrador") NOT NULL
);

-- Crear tabla tipo_documento
CREATE TABLE tipo_documento (
    cod_tipo_doc INT AUTO_INCREMENT PRIMARY KEY, 
    tipo_doc VARCHAR(3) NOT NULL
);

-- Crear tabla cargo
CREATE TABLE cargo (
    codigo_cargo INT AUTO_INCREMENT PRIMARY KEY, 
    nombre_cargo VARCHAR(50) NOT NULL
);

-- Crear tabla funcionario
CREATE TABLE funcionario (
    num_documento INT PRIMARY KEY, 
    primer_nombre VARCHAR(30) NOT NULL,
    segundo_nombre VARCHAR(30),
    primer_apellido VARCHAR(30) NOT NULL,
    segundo_apellido VARCHAR(30),
    correo_electronico VARCHAR(50) NOT NULL,
    numero_telefonico VARCHAR(10) NOT NULL,
    
    -- Relación uno a uno con usuario
    id_usuario INT UNIQUE NOT NULL,
    cod_tipo_doc INT,
    codigo_cargo INT,
    
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY (cod_tipo_doc) REFERENCES tipo_documento(cod_tipo_doc),
    FOREIGN KEY (codigo_cargo) REFERENCES cargo(codigo_cargo)
);

-- Comunicacion 
-- Crear tabla mensaje 
create table mensaje (
  id_Mensaje  int auto_increment PRIMARY KEY,
  txt_mensaje VARCHAR(500),
  fecha_hora datetime not null
);

 -- Crear tabla de chat
 create table chat (
 id_Chat int auto_increment PRIMARY KEY,
 tipo_de_Chat enum ("Directo","Grupal") NOT NULL,
 
 mensaje_idMensaje int,
 Usuario_id_Usuario int,
 foreign key (mensaje_idMensaje)  references mensaje(id_Mensaje),
 foreign key (Usuario_id_Usuario) references Usuario(id_Usuario)
 );
 
 -- Crear tabla archivo
 create table archivo (
  id_Archivo int auto_increment primary key,
  url_archivo varchar(50),
  tipo_de_archivo varchar(30)
);

 -- Crear tabla archivo adjunto
  create table  archivo_adjunto (
  mensaje_idMensaje int,
  archivo_idArchivo int,
  foreign key (mensaje_idMensaje) references mensaje(id_Mensaje),
  foreign key (archivo_idArchivo) references archivo(id_Archivo)
);

-- Actividad
-- Crear tabla Actividad
create table actividad (
  id_Actividad int auto_increment PRIMARY KEY,
  asunto varchar(45) not null,
  descripcion varchar(70),
  fecha_creacion datetime not null,
  fecha_vencimiento datetime not null,
  prioridad ENUM('Alta', 'Media', 'Bajo'),
 fecha_de_entrega datetime, 
  estado_actual ENUM('Pendiente', 'Entregado con retraso', 'Sin entregar', 'Completado') not null
);

-- Crear tabla asignacion de actividad
create table asignacion_actividad (  

  id_Asignacion  int auto_increment primary key,
  actividad_idActividad int,
  Asignado_por_idUsuario int not null,
  Asignado_a_idUsuario int not null,
  foreign key (actividad_idActividad) references actividad(id_Actividad),
  foreign key (Asignado_por_idUsuario) references usuario(id_usuario),
  foreign key (Asignado_a_idUsuario) references usuario(id_usuario)
);

-- Crear tabla asignacion de actividad
create table tarea (
  id_Tarea  int auto_increment primary key,
  tarea varchar(100),
  actividad_id_Actividad int not null,

  foreign key (actividad_id_Actividad) references actividad(id_Actividad)
);

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




