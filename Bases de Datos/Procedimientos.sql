use alphamind;

-- Tareas asignadas a un usuario que NO estén en estado 'Realizada'
DELIMITER //
CREATE PROCEDURE ObtenerTareasActivasPorUsuario(IN id_usuario INT)
BEGIN
    SELECT t.id_tarea, t.titulo, t.descripcion, t.fecha_vencimiento, et.estado_actual
    FROM tarea t
    JOIN asignacion_tarea a ON t.id_tarea = a.Tarea_idTarea
    JOIN estado_tarea et ON t.id_tarea = et.idEstado_Tarea
    WHERE a.Asignado_a_idUsuario = id_usuario AND et.estado_actual != 'Realizada';
END;
//
DELIMITER ;

CALL ObtenerTareasActivasPorUsuario(3);

-- Crea un registro en asignacion_tarea
DELIMITER //
CREATE PROCEDURE AsignarTarea(
    IN id_tarea INT,
    IN id_asignador INT,
    IN id_asignado INT
)
BEGIN
    INSERT INTO asignacion_tarea (Tarea_idTarea, Asignado_por_idUsuario, Asignado_a_idUsuario)
    VALUES (id_tarea, id_asignador, id_asignado);
END;
//
DELIMITER ;

CALL AsignarTarea(5, 1, 3);

-- Cambia el estado de una tarea en estado_tarea
DELIMITER //
CREATE PROCEDURE CambiarEstadoTarea(
    IN id_tarea_estado INT,
    IN nuevo_estado ENUM('Pendiente', 'En Proceso', 'Realizada', 'Vencida')
)
BEGIN
    UPDATE estado_tarea
    SET estado_actual = nuevo_estado
    WHERE idEstado_Tarea = id_tarea_estado;
END;
//
DELIMITER ;

CALL CambiarEstadoTarea(7, 'Realizada');
