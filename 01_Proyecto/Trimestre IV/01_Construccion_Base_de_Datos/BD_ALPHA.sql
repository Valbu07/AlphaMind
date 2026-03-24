-- drop database alphamind;

-- Crear base de datos
CREATE DATABASE Alphamind;
USE Alphamind;

-- =========================
-- USUARIOS
-- =========================

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    contraseña VARCHAR(200) NOT NULL,
    tipo_de_rol ENUM("Funcionario","Administrador") NOT NULL,
    estado ENUM('activo','inactivo') DEFAULT 'activo',
    foto_perfil varchar(255)
);

-- =========================
-- TABLAS BASE
-- =========================


-- =========================
-- FUNCIONARIO
-- =========================

CREATE TABLE funcionario (
    num_documento INT PRIMARY KEY, 
    primer_nombre VARCHAR(30) NOT NULL,
    segundo_nombre VARCHAR(30),
    primer_apellido VARCHAR(30) NOT NULL,
    segundo_apellido VARCHAR(30),
    correo_electronico VARCHAR(50) NOT NULL,
    numero_telefonico VARCHAR(10) NOT NULL,
    
    documento VARCHAR(25),
    cargo VARCHAR(50),

    id_usuario INT UNIQUE NOT NULL,

    estado ENUM('activo','inactivo') DEFAULT 'activo',

    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
);

-- =========================
-- COMUNICACIÓN
-- =========================

CREATE TABLE mensaje (
  id_Mensaje INT AUTO_INCREMENT PRIMARY KEY,
  txt_mensaje VARCHAR(500),
  fecha_hora DATETIME NOT NULL
);

CREATE TABLE chat (
 id_Chat INT AUTO_INCREMENT PRIMARY KEY,
 tipo_de_Chat ENUM ("Directo","Grupal") NOT NULL,
 
 mensaje_idMensaje INT,
 Usuario_id_Usuario INT,

 FOREIGN KEY (mensaje_idMensaje) REFERENCES mensaje(id_Mensaje),
 FOREIGN KEY (Usuario_id_Usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE archivo (
  id_Archivo INT AUTO_INCREMENT PRIMARY KEY,
  url_archivo VARCHAR(100),
  tipo_de_archivo VARCHAR(30)
);

CREATE TABLE archivo_adjunto (
  mensaje_idMensaje INT,
  archivo_idArchivo INT,

  FOREIGN KEY (mensaje_idMensaje) REFERENCES mensaje(id_Mensaje),
  FOREIGN KEY (archivo_idArchivo) REFERENCES archivo(id_Archivo)
);

-- =========================
-- ACTIVIDADES
-- =========================

CREATE TABLE actividad (
  id_Actividad INT AUTO_INCREMENT PRIMARY KEY,
  asunto VARCHAR(45) NOT NULL,
  descripcion VARCHAR(70),

  fecha_creacion DATETIME NOT NULL,
  fecha_vencimiento DATETIME NOT NULL,

  prioridad ENUM('Alta','Media','Bajo'),

  fecha_de_entrega DATETIME,

  estado_actual ENUM(
  'Pendiente',
  'Entregado con retraso',
  'Sin entregar',
  'Completado'
  ) NOT NULL
);

-- =========================
-- ASIGNACION DE ACTIVIDAD
-- =========================

CREATE TABLE asignacion_actividad (  

  id_Asignacion INT AUTO_INCREMENT PRIMARY KEY,

  actividad_idActividad INT,

  Asignado_por_idUsuario INT NOT NULL,
  Asignado_a_idUsuario INT NOT NULL,

  FOREIGN KEY (actividad_idActividad) REFERENCES actividad(id_Actividad),
  FOREIGN KEY (Asignado_por_idUsuario) REFERENCES usuario(id_usuario),
  FOREIGN KEY (Asignado_a_idUsuario) REFERENCES usuario(id_usuario)
);

-- =========================
-- TAREAS
-- =========================

CREATE TABLE tarea (

  id_Tarea INT AUTO_INCREMENT PRIMARY KEY,

  tarea VARCHAR(100),

  actividad_id_Actividad INT NOT NULL,

  FOREIGN KEY (actividad_id_Actividad) REFERENCES actividad(id_Actividad)
);