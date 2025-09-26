-- drop database alphamind;
-- Crear base de datos
CREATE DATABASE Alphamind;
USE Alphamind;

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


create table tarea (
  id_Tarea  int auto_increment primary key,
  tarea varchar(100),
  actividad_id_Actividad int not null,

  foreign key (actividad_id_Actividad) references actividad(id_Actividad)
);

