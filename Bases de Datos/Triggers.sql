use alphamind;

-- Crear automáticamente el estado “Pendiente” al insertar una nueva tarea
DELIMITER //
CREATE TRIGGER insertar_estado_automatico
AFTER INSERT ON Tarea
FOR EACH ROW
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM estado_tarea WHERE idEstado_Tarea = NEW.id_tarea
    ) THEN
        INSERT INTO estado_tarea (idEstado_Tarea, estado_actual)
        VALUES (NEW.id_tarea, 'Pendiente');
    END IF;
END;
//
DELIMITER ;

INSERT INTO Tarea (id_tarea, titulo, descripcion, fecha_creacion, fecha_vencimiento, prioridad)
VALUES (200, 'Preparar informe', 'Resumen mensual', NOW(), '2025-07-30', 'Alta');


-- Establecer automáticamente la fecha y hora en la tabla 
DELIMITER //
CREATE TRIGGER time_mensaje
BEFORE INSERT ON Mensaje
FOR EACH ROW
BEGIN
    SET NEW.fecha_hora = NOW();
END;
//
DELIMITER ;

INSERT INTO Mensaje (txt_mensaje)
VALUES ('Hola, ¿cómo va la tarea?');

-- Establecer automaticamente la hora de creación de una tarea
DELIMITER //
CREATE TRIGGER set_fecha_creacion_tarea
BEFORE INSERT ON Tarea
FOR EACH ROW
BEGIN
    SET NEW.fecha_creacion = NOW();
END;
//
DELIMITER ;

INSERT INTO Tarea (id_tarea, titulo, descripcion, fecha_vencimiento, prioridad)
VALUES (301, 'Revisar base de datos', 'Verificar integridad de tablas', '2025-08-01', 'Media');


