-- Crear base de datos
CREATE DATABASE Alphamind;
USE Alphamind;

-- Crear tabla rol 
CREATE TABLE rol (
	id_rol INT AUTO_INCREMENT PRIMARY KEY, 
    tipo_de_rol VARCHAR (15) NOT NULL
);


-- Crear tabla estado
CREATE TABLE estado (
	id_estado INT AUTO_INCREMENT PRIMARY KEY, 
    tipo_de_estado ENUM("Activo","Inactivo","Vacaciones") NOT NULL
);

-- Crear tabla usuario
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    contraseña VARCHAR(8) NOT NULL,
    
    id_rol INT,
    id_estado INT,
	FOREIGN KEY (id_rol) REFERENCES rol(id_rol),
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

 -- Insertacion de datos :

-- Persona  
-- Insertar datos en tabla rol 
 INSERT INTO Rol (id_rol, tipo_de_rol) VALUES
(1, 'Administrador'),
(2, 'Administrador'),
(3, 'Administrador'),
(4, 'Funcionario'),
(5, 'Funcionario'),
(6, 'Funcionario'),
(7, 'Funcionario'),
(8, 'Funcionario'),
(9, 'Administrador'),
(10, 'Funcionario'),
(11, 'Funcionario'),
(12, 'Funcionario'),
(13, 'Funcionario'),
(14, 'Administrador'),
(15, 'Funcionario');

-- Insertar datos en tabla estado 
 INSERT INTO Estado (id_estado, tipo_de_estado) VALUES
(1, 'Activo'),
(2, 'Activo'),
(3, 'Activo'),
(4, 'Inactivo'),
(5, 'Activo'),
(6, 'Activo'),
(7, 'Activo'),
(8, 'Inactivo'),
(9, 'Activo'),
(10, 'Activo'),
(11, 'Vacaciones'),
(12, 'Activo'),
(13, 'Activo'),
(14, 'Activo'),
(15, 'Vacaciones');
 
-- Insertar datos en tabla usuario 
INSERT INTO Usuario (id_Usuario, contraseña, id_rol, id_estado) VALUES
(1, 'f5454fs', 1, 1),
(2, 'j8k4c2x', 2, 2),
(3, 'd4g8h2k', 3, 3),
(4, 'u2v5g1k', 4, 4),
(5, 'm9q2z7a', 5, 5),
(6, 'w9z6p3b', 6, 6),
(7, 'x7t5p6w', 7, 7),
(8, 'a9d8s6e', 8, 8),
(9, 'r3v9b1l', 9, 9),
(10, 't8r3x9c', 10, 10),
(11, 'b5n2l6f', 11, 11),
(12, 'k7m3r1v', 12, 12),
(13, 'z1y8n3t', 13, 13),
(14, 'h4t2j7q', 14, 14),
(15, 'q3p7w9d', 15, 15);

-- Insertar datos en tabla tipo_documento
INSERT INTO tipo_documento (cod_tipo_doc, tipo_doc) VALUES
(1, 'CC'),
(2, 'CE');

-- Insertar datos en tabla cargo 
INSERT INTO cargo (codigo_cargo, nombre_cargo) VALUES
(1, 'Gerente'),
(2, 'Subgerente'),
(3, 'Directora Administrativa'),
(4, 'Contadora'),
(5, 'Auxiliar Administrativa'),
(6, 'Auxiliar Contable'),
(7, 'Coordinador de Talento Humano'),
(8, 'Archivista'),
(9, 'Recepcionista');

-- Insertar datos en tabla funcionario 
INSERT INTO funcionario (num_documento, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo_electronico, numero_telefonico, id_usuario, cod_tipo_doc, codigo_cargo) VALUES
(1032456789, 'Carlos', 'Andres', 'Virgüez', 'Martinez', 'andresvz@gmail.com', '3128765432', 1, 1, 2),
(79562431, 'Juan', 'Mauricio', 'Betancourt', 'Alonso', 'mauriciobetan8@gmail.com', '3147654321', 2, 1, 1),
(1004567890, 'Ana', 'Milena', 'Betancourt', 'Alonso', 'milebetan25@gmail.com', '3016789542', 3, 1, 3),
(1100234578, 'Sebastián', 'Alejandro', 'Torres', null, 'sebastiantc@gmail.com', '3203344556', 4, 1, 8),
(1234567890, 'Monica', 'Carolina', 'Bonilla', 'Velásquez', 'carobonilla@gmail.com', '3024567890', 5, 1, 6),
(501234567, 'Karla', 'Isabel', 'Tellez', 'Mora', 'karlaatellezmo@gmail.com', '3152233445', 6, 2, 9),
(1098456231, 'Lina', 'Marcela', 'Patiño', 'Torres', 'linampt11@gmail.com', '3112345678', 7, 1, 8),
(1023456798, 'Angel', null , 'Barrera', 'Leon', 'barreraleon233@gmail.com', '3004587213', 8, 1, 8),
(1876543210, 'Maria', 'Lucia', 'Morales', 'Mejia', 'marilumm@gmail.com', '3181122443', 9, 1, 4),
(765432189, 'Mariana', 'Alejandra', 'Navarro', 'Salazar', 'marialee88@gmail.com', '3214339986', 10, 1, 6),
(1001234567, 'Cristian', null , 'Ortega', 'Beltran', 'cristianortega09@gmail.com', '3171234567', 11, 1, 5),
(300456789, 'Jairo', 'Jose', 'Montoya', null , 'jairomontoya78@gmail.com', '3169988776', 12, 2, 9),
(701123456, 'Luz', 'Marina', 'Clavijo', 'Parrado', 'luzmaclavijo@gmail.com', '3195566778', 13, 2, 5),
(801234567, 'Jorge', 'Antonio', 'Laverde', 'Gallego', 'jorgitolaverde1966@gmail.com', '3059876543', 14, 1, 7),
(912345678, 'Camila', null , 'Castro', 'Herrera', 'camil4fer55@gmail.com', '3133456789', 15, 1, 9);

-- Comunicacion
-- Insertar datos en tabla mensaje
INSERT INTO mensaje (txt_mensaje, fecha_hora) VALUES
('Hola, ¿cómo estás', '2025-06-04 09:15:00'),
('Te envío el informe de ventas.','2025-06-04 10:02:45'),
('¿Nos reunimos mañana?','2025-06-04 11:30:12'),
('Jefe, hay varios turnos','2025-06-05 12:05:30'),
('Se necesita el informe para mañana a primera hora', '2025-06-05 13:00:00'),
('Adjunto el video de la presentación.',  '2025-06-06 14:20:05'),
('Cierre de proyecto el 30.', '2025-06-07 15:45:20'),
('Reunion, a la sala gerencial, por favor','2025-06-07 16:10:47'),
('Te mando los informes mañama','2025-06-07 16:35:10'),
('Buen trabajo','2025-06-08 17:00:00'),
('Archivo Excel con los datos actualizados.', '2025-06-08 17:25:33'),
('Invitación al Meet a las 9 AM.','2025-06-08 08:00:00'),
('Foto del diagrama UML.','2025-06-08 09:10:22'),
('Todo esta al Dia', '2025-06-08 10:30:55'),
('Hoja de vida de nuevo', '2025-06-09 11:05:40');

-- Insertar datos en tabla chat 
INSERT INTO chat (tipo_de_Chat, mensaje_idMensaje, Usuario_id_Usuario) VALUES
  ('Directo', 1,  1),
  ('Directo', 2,  2),
  ('Grupal',  3,  3),
  ('Directo', 4,  4),
  ('Grupal',  5,  5),
  ('Directo', 6,  6),
  ('Grupal',  7,  7),
  ('Grupal',  8,  8),
  ('Directo', 9,  9),
  ('Directo', 10, 10),
  ('Directo', 11, 11),
  ('Grupal',  12, 12),
  ('Directo', 13, 13),
  ('Grupal',  14, 14),
  ('Directo', 15, 15);
  
-- Insertar datos en tabla archivo 
insert into archivo (url_archivo, tipo_de_archivo) values
  ('/archivos/informe1.pdf', 'PDF'),
  ('/archivos/manual_usuario.pdf', 'PDF'),
  ('/archivos/presentacion.pdf', 'PDF'),
  ('/archivos/datos_financieros.pdf', 'PDF'),
  ('/archivos/diagrama_tareas.pdf', 'PDF'),
  ('/archivos/formato_reporte.pdf', 'PDF');
  
-- Insertar datos en tabla archivo adjunto 
INSERT INTO Archivo_adjunto (mensaje_idMensaje, Archivo_idArchivo) VALUES
  (2, 1),
  (6, 3),
  (11, 4),
  (13, 5),
  (15, 6);
  
-- Tarea
-- Insertar datos en tabla tarea 
insert into tarea (titulo, descripcion, fecha_creacion, fecha_vencimiento, prioridad) values
('Actualizar plan de capacitación', 'Revisar y programar cursos de inducción y desarrollo', '2025-06-24 10:15:00', '2025-07-02 16:00:00', 'Alta'),
('Conciliación bancaria mensual', 'Comparar movimientos bancarios con registros contables', '2025-07-01 09:30:00', '2025-07-05 12:00:00', 'Alta'),
('Revisar nómina quincenal', 'Verificar horas, deducciones y pagos de empleados', '2025-06-28 14:45:00', '2025-07-03 11:00:00', 'Alta'),
('Elaborar informe de gastos administrativos', 'Compilar facturas y recibos del mes', '2025-06-30 08:20:00', '2025-07-07 17:00:00', 'Media'),
('Actualizar política de vacaciones', 'Incluir cambios de ley laboral reciente', '2025-06-27 12:00:00', '2025-07-04 15:30:00', 'Media'),
('Auditoría interna de cuentas por pagar', 'Evaluar procesos y aprobar ajustes', '2025-07-02 11:10:00', '2025-07-10 10:00:00', 'Alta'),
('Publicar anuncio de reclutamiento', 'Redactar y difundir vacante en portales', '2025-06-25 16:50:00', '2025-07-01 09:00:00', 'Media'),
('Generar pólizas contables', 'Registrar asiento de cierre de mes', '2025-07-03 13:25:00', '2025-07-08 14:00:00', 'Alta'),
('Revisar contratos de prestación de servicios', 'Verificar cláusulas y fechas de vencimiento', '2025-06-29 09:05:00', '2025-07-06 12:00:00', 'Bajo'),
('Capacitación en uso de sistema contable', 'Preparar material y coordinar sala', '2025-07-04 10:40:00', '2025-07-09 11:30:00', 'Media'),
('Actualizar organigrama de la empresa', 'Incorporar nuevas contrataciones', '2025-06-26 15:00:00', '2025-07-02 13:45:00', 'Bajo'),
('Cierre de libro de inventarios', 'Validar cantidades físicas vs sistema', '2025-07-05 08:50:00', '2025-07-12 16:00:00', 'Alta'),
('Preparar cheque de proveedores', 'Revisar facturas y autorizaciones', '2025-06-23 11:30:00', '2025-07-01 14:00:00', 'Alta'),
('Enviar encuestas de clima laboral', 'Crear formulario y distribuir por correo', '2025-07-06 14:10:00', '2025-07-10 18:00:00','Media'),
('Revisar políticas de gastos menores', 'Actualizar topes y procedimientos de reembolso', '2025-06-22 17:45:00', '2025-07-03 12:15:00', 'Bajo');

-- Insertar datos en tabla asignacion de tarea (evitando autasignación)
INSERT INTO asignacion_tarea (Tarea_idTarea, Asignado_por_idUsuario, Asignado_a_idUsuario) VALUES
(1, 2, 1),
(2, 3, 2),
(3, 4, 3),
(4, 5, 4),
(5, 6, 5),
(6, 7, 6),
(7, 8, 7),
(8, 9, 8),
(9, 10, 9),
(10, 11, 10),
(11, 12, 11),
(12, 13, 12),
(13, 14, 13),
(14, 15, 14),
(15, 1, 15);  


-- Insertar datos en tabla estado de tarea 
insert into estado_tarea (estado_actual) values
('Pendiente'),
('Entregado con retraso'),
('Sin entregar'),
('Completado');

-- Insertar datos en tabla entregable de tarea
INSERT INTO entregable_tarea (Usuario_idUsuario, Tarea_idTarea, fecha_de_entrega, Estado_Tarea_idEstado_Tarea) VALUES
(1, 1, '2025-07-01 15:00:00', 1),
(2, 2, '2025-07-05 11:59:00', 4),
(3, 3, '2025-07-04 10:45:00', 2),
(4, 4, '2025-07-06 14:00:00', 3),
(5, 5, '2025-07-04 13:15:00', 1),
(6, 6, '2025-07-10 09:00:00', 4),
(7, 7, '2025-07-01 08:30:00', 1),
(8, 8, '2025-07-08 12:45:00', 2),
(9, 9, '2025-07-05 17:00:00', 4),
(10, 10, '2025-07-09 10:30:00', 1),
(11, 11, '2025-07-02 12:00:00', 3),
(12, 12, '2025-07-12 16:00:00', 4),
(13, 13, '2025-07-01 13:30:00', 2),
(14, 14, '2025-07-10 17:59:00', 4),
(15, 15, '2025-07-03 12:00:00', 1);

