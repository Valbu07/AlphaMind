-- drop database alphamind;
-- Crear base de datos
CREATE DATABASE Alphamind;
USE Alphamind;

-- Crear tabla estado
CREATE TABLE estado (
	id_estado INT AUTO_INCREMENT PRIMARY KEY, 
    tipo_de_estado ENUM("Activo","Inactivo","Vacaciones") NOT NULL
);

-- Crear tabla usuario
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    contraseña VARCHAR(200) NOT NULL,
    id_estado INT,
	tipo_de_rol  ENUM("Funcionario","Administrador") NOT NULL,
	FOREIGN KEY (id_estado) REFERENCES estado(id_estado)
);

-- Crear tabla tipo_documento
CREATE TABLE tipo_documento (
	cod_tipo_doc INT AUTO_INCREMENT PRIMARY KEY, 
    tipo_doc VARCHAR (3) NOT NULL
);

-- Crear tabla cargo
CREATE TABLE cargo (
	codigo_cargo INT AUTO_INCREMENT PRIMARY KEY, 
    nombre_cargo VARCHAR (50) NOT NULL
);

-- Crear tabla funcionario
CREATE TABLE funcionario (
	num_documento INT PRIMARY KEY, 
    primer_nombre VARCHAR (30)  NOT NULL,
    segundo_nombre VARCHAR (30),
    primer_apellido VARCHAR (30) NOT NULL,
    segundo_apellido VARCHAR (30),
    correo_electronico VARCHAR (50)NOT NULL,
    numero_telefonico VARCHAR (10) NOT NULL,
    
    id_usuario INT,
    cod_tipo_doc INT,
    codigo_cargo INT,
	FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario),
	FOREIGN KEY (cod_tipo_doc) REFERENCES tipo_documento(cod_tipo_doc),
    FOREIGN KEY (codigo_cargo) REFERENCES cargo(codigo_cargo)
);

-- Comunicacion 
-- Crear tabla mensaje 
create table mensaje (
  idMensaje  int auto_increment PRIMARY KEY,
  txt_mensaje VARCHAR(500),
  fecha_hora datetime not null
);

 -- Crear tabla de chat
 create table chat (
 idChat int auto_increment PRIMARY KEY,
 tipo_de_Chat enum ("Directo","Grupal") NOT NULL,
 
 mensaje_idMensaje int,
 Usuario_id_Usuario int,
 foreign key (mensaje_idMensaje)  references mensaje(idMensaje),
 foreign key (Usuario_id_Usuario) references Usuario(id_Usuario)
 );
 
 -- Crear tabla archivo
 create table archivo (
  idArchivo int auto_increment primary key,
  url_archivo varchar(50),
  tipo_de_archivo varchar(30)
);

 -- Crear tabla archivo adjunto
  create table  archivo_adjunto (
  mensaje_idMensaje int,
  archivo_idArchivo int,
  foreign key (mensaje_idMensaje) references mensaje(idMensaje),
  foreign key (archivo_idArchivo) references archivo(idArchivo)
);

-- Tarea
-- Crear tabla tarea
create table tarea (
  id_tarea int auto_increment PRIMARY KEY,
  titulo varchar(45) not null,
  descripcion varchar(70),
  fecha_creacion datetime not null,
  fecha_vencimiento datetime not null,
  prioridad ENUM('Alta', 'Media', 'Bajo')
);

-- Crear tabla asignacion de tarea
create table asignacion_tarea (
  idAsignacion  int auto_increment primary key,
  Tarea_idTarea int,
  Asignado_por_idUsuario int not null,
  Asignado_a_idUsuario int not null,
  
  foreign key (Tarea_idTarea) references tarea(id_tarea),
  foreign key (Asignado_por_idUsuario) references usuario(id_usuario),
  foreign key (Asignado_a_idUsuario) references usuario(id_usuario)
);

-- Crear tabla estado de tarea
create table  estado_tarea (
  idEstado_Tarea  int auto_increment primary key,
  estado_actual ENUM('Pendiente', 'Entregado con retraso', 'Sin entregar', 'Completado') not null
);

-- Crear tabla entregable de tarea
create table entregable_tarea (
  Usuario_idUsuario int,
  Tarea_idTarea int,
  fecha_de_entrega datetime,
  Estado_Tarea_idEstado_Tarea int,
  primary key (Usuario_idUsuario, Tarea_idTarea),
  
  foreign key (Usuario_idUsuario) references usuario(id_usuario),
  foreign key (Tarea_idTarea) references tarea(id_tarea),
  foreign key (Estado_Tarea_idEstado_Tarea) references estado_tarea(idEstado_Tarea)
);


