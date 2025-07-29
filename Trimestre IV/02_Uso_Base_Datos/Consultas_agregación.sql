use alphamind;

-- Cuantos usuarios hay registrados 
select count(*) AS total_usuarios 
from usuario;

-- Cuantos funcionarios tienen segundo nombre 
select count(segundo_nombre) AS Segundo_nombre
from funcionario;

-- Cual es el total de tareas registradas
select count(*) AS Total_tareas
from tarea;

-- cual es la tarea con fecha de vecimiento mas lejano
select max(fecha_vencimiento) AS tarea_mas_lejana
from tarea;

-- Cual es la tarea mas reciente que se creo
select max(fecha_creacion) AS ultima_creada
from tarea;

-- 6 Cuantos archivos pdf hay?
select count(*) AS Total_pdf 
from archivo 
where tipo_de_archivo = 'PDF';

-- Cuantas funcionarios no tienen segundo apellido
select count(*) AS Segundo_apellido
from funcionario
where Segundo_apellido is null;

-- Cual fue la primera tarea que se creo
select min(fecha_creacion) AS primera_tarea 
from tarea;

-- Cuántos mensajes se han enviado por tipo de chat?
select tipo_de_Chat,count(*) AS total
from chat
group by tipo_de_Chat;

-- Cual es el nombre de cargo mas largo 
SELECT nombre_cargo
FROM cargo
ORDER BY CHAR_LENGTH(nombre_cargo) DESC
limit 1;

-- Cuántos usuarios tienen contraseña que empieza con la letra a
select COUNT(*) AS contraseñas_letra
from usuario
where contraseña REGEXP 'a';

-- A cuantos usuarios su nombre termina por la letra e
select count(*) AS Nombre
from funcionario
where primer_nombre like '%a';

-- Cuantos cargos contiene la palabra "Auxiliar"
select count(*) AS cargos_auxiliares
from cargo
where nombre_cargo like '%Auxiliar%';

-- Cuántos funcionarios tienen número de documento que termina en 7
select count(*) AS D_terminan_7
from funcionario
where num_documento like '%7';

-- Todos los datos de un funcionario por su numero de documento
select * 
from funcionario 
where num_documento = 1234567890;