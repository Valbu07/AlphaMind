use alphamind;

-- Buscar las Tareas Sin entregar
select titulo, (select estado_actual from estado_tarea where estado_actual like "%Sin%" ) AS Tareas_sin_entregar
from tarea;

-- Tareas Urgentes Antes del Último Plazo
select titulo, fecha_creacion
from tarea
where fecha_creacion < (select max(fecha_de_entrega) from entregable_tarea)and prioridad like 'Alta';


-- Funcionarios que tengan el mismo cargo que Sebastian
select primer_nombre, primer_apellido 
from funcionario 
where codigo_cargo = (
    select codigo_cargo 
    from funcionario 
    where primer_nombre = 'Sebastian'
);

-- Tareas con prioridad alta 
select id_tarea AS ID, titulo
from tarea
where prioridad = (
    select prioridad 
    from tarea 
    where id_tarea = 1
);

-- Funcionarios que tienen el mismo tipo de documento que Juan
select cod_tipo_doc AS CC,primer_nombre AS PRIMER_NOMBRE, primer_apellido AS PRIMER_APELLIDO
from funcionario 
where cod_tipo_doc = (
    select cod_tipo_doc 
    from funcionario 
    where primer_nombre = 'Juan'
);

-- Tareas que vencen despues de la tarea con id 6

select titulo, fecha_vencimiento 
from tarea 
where fecha_vencimiento > (
    select fecha_vencimiento 
    from tarea 
    where id_tarea = 6
);

-- Usuarios que tenga un rol diferente al usuario que tiene el id 2
select id_usuario, id_rol 
from  usuario 
where id_rol != (
    select id_rol 
    from usuario 
    where id_usuario = 2
);

-- Funcionarios que tengan un numero de documento mayor al de Carlos
select primer_nombre, primer_apellido, num_documento 
from funcionario 
where num_documento > (
    select num_documento 
    from funcionario 
    where primer_nombre = 'Carlos'
);

-- Mensajes enviados despues del primer mensaje 
select txt_mensaje, fecha_hora 
from mensaje 
where fecha_hora > (
    select MIN(fecha_hora) 
    from mensaje
);

 
-- Contar las tareas asignadas
select primer_nombre, (select count(Tarea_idTarea)  
from asignacion_tarea  where Asignado_a_idUsuario = funcionario.id_usuario) AS total_tareas
FROM funcionario;