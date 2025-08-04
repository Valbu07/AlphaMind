use alphamind;

-- Devuelve los días que faltan para entregar una tarea
DELIMITER //
CREATE FUNCTION DiasRestantesEntrega(fecha_venc DATE)
RETURNS INT
DETERMINISTIC
BEGIN
    RETURN DATEDIFF(fecha_venc, CURDATE());
END;
//
DELIMITER ;

SELECT DiasRestantesEntrega('2025-07-20') AS dias_restantes;
 
-- Devuelve el nombre completo de un funcionario
DELIMITER //
CREATE FUNCTION NombreCompletoFuncionario(p_id_usuario INT)
RETURNS VARCHAR(100)
DETERMINISTIC
BEGIN
    DECLARE nombre VARCHAR(100);
    SELECT CONCAT_WS(' ', primer_nombre, segundo_nombre, primer_apellido, segundo_apellido)
    INTO nombre
    FROM funcionario
    WHERE id_usuario = p_id_usuario
    LIMIT 1; -- Por si acaso
    RETURN nombre;
END;
//
DELIMITER ;

SELECT NombreCompletoFuncionario(5) AS nombre_funcionario;

-- Función que devuelve el número total de tareas asignadas a un usuario
DELIMITER //
CREATE FUNCTION TotalTareasAsignadas(id_usuario INT)
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE total INT;

    SELECT COUNT(*) INTO total
    FROM asignacion_tarea
    WHERE Asignado_a_idUsuario = id_usuario;

    RETURN total;
END;
//
DELIMITER ;

SELECT TotalTareasAsignadas(7) AS total_tareas;




