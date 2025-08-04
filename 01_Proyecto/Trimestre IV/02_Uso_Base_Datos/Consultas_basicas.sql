use alphamind;

-- Nombres de los cargos ordenados alfabéticamente.
select nombre_cargo 
from cargo 
order by nombre_cargo asc;

-- Títulos de las tareas cuya prioridad sea 'Alta'.
select titulo 
from tarea 
where prioridad like 'Alta'
order by titulo asc;

-- Correos electrónicos de funcionarios cuyo primer apellido sea 'Betancourt'.
select correo_electronico 
from funcionario 
where primer_apellido like 'Betancourt';

-- Mensajes enviados entre el 5 y el 7 de junio de 2025.
select txt_mensaje 
from mensaje 
where fecha_hora between '2025-06-05' and '2025-06-07';

-- Nombres de los funcionarios que NO tienen segundo nombre.
select concat(primer_nombre, ' ', primer_apellido) as Nombre
from funcionario
where segundo_nombre is null
order by primer_apellido asc;

-- Tareas con prioridad diferente de 'Bajo'.
SELECT titulo , prioridad
FROM tarea
WHERE prioridad in ('Alta', 'Media'); 

-- Muestra los nombres de funcionarios cuyo número telefónico empiece por '31'.
select concat(primer_nombre, ' ', primer_apellido) as Nombre
from funcionario
where numero_telefonico like '31%';

-- Cargos que tengan más de 20 caracteres.
select nombre_cargo
from cargo
where length(nombre_cargo)> 20;

-- Nombres completos en mayúsculas
select upper(concat_ws(' ',primer_nombre, segundo_nombre, primer_apellido, segundo_apellido)) as Nombre
from funcionario;

-- Tareas con título que contiene la palabra "Actualizar".
select titulo 
from tarea 
where titulo like 'Actualizar%';

-- Usuarios cuyo id usuario no esté entre 5 y 10.
select id_usuario 
from usuario 
where id_usuario not in ('5','10');


-- Estados de tareas que no sean 'Pendiente' ni 'Completado'.
select estado_actual 
from estado_tarea
where estado_actual not in ('Pendiente','Completado');

-- Trae los cargos cuyo nombre termina en 'a'.
Select nombre_cargo 
from cargo 
where nombre_cargo like "%a";

-- Tipos de prioridad
select distinct prioridad 
from tarea;

-- Primeros 5 mensajes enviados 
select * 
from mensaje
order by fecha_hora asc
limit 5;

-- Funcionarios con correo mas largo 
SELECT primer_nombre, primer_apellido, correo_electronico, LENGTH(correo_electronico) AS largo
FROM funcionario
ORDER BY largo DESC
LIMIT 3;

-- Primeros 5 caracteres de correo
select correo_electronico, left(correo_electronico, 5) as inicio_correo
from funcionario;

-- Mensajes q comiencen en T
select txt_mensaje as mensaje
from mensaje
where left(txt_mensaje, 1) = 'T' or left(txt_mensaje, 1) = 'E';

-- Funcionarios que su primer nobre empieza en A
select concat_ws(' ',primer_nombre, segundo_nombre, primer_apellido, segundo_apellido) AS Nombre
from funcionario
where primer_nombre like 'A%';

-- Funcionarios con apellido terminado en Z
select primer_apellido
from funcionario
where primer_apellido like '%z';
