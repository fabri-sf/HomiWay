<?php
class ReservaModel {
    public $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    /* ============================
       OBTENER TODAS LAS RESERVAS
    ============================ */
    public function all() {
        try {
            $sql = "SELECT ad.*, a.Nombre AS NombreAlojamiento, u.Nombre AS NombreCliente, u.Apellido 
                    FROM Alojamiento_Detalle ad
                    JOIN Alojamiento a ON ad.ID_Alojamiento = a.ID
                    JOIN Usuario u ON ad.ID_Usuario = u.ID
                    ORDER BY ad.Fecha_Inicio DESC";
            
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* ============================
       OBTENER RESERVA POR ID
    ============================ */
    public function get($id) {
        try {
            $sql = "SELECT ad.*, a.Nombre AS NombreAlojamiento, u.Nombre AS NombreCliente, u.Apellido 
                    FROM Alojamiento_Detalle ad
                    JOIN Alojamiento a ON ad.ID_Alojamiento = a.ID
                    JOIN Usuario u ON ad.ID_Usuario = u.ID
                    WHERE ad.ID = " . intval($id);
            
            $result = $this->enlace->ExecuteSQL($sql);
            return isset($result[0]) ? $result[0] : null;  // retorna objeto
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* ============================
       OBTENER RESERVAS POR USUARIO
    ============================ */
    public function getByUsuario($usuarioId) {
        try {
            $sql = "SELECT ad.*, a.Nombre AS NombreAlojamiento
                    FROM Alojamiento_Detalle ad
                    JOIN Alojamiento a ON ad.ID_Alojamiento = a.ID
                    WHERE ad.ID_Usuario = " . intval($usuarioId) . "
                    ORDER BY ad.Fecha_Inicio DESC";
            
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* ============================
       CREAR RESERVA DE ALOJAMIENTO
    ============================ */
    public function create($objeto) {
        try {
            // Validar disponibilidad
            if (!$this->verificarDisponibilidad($objeto->ID_Alojamiento, $objeto->Fecha_Inicio, $objeto->Fecha_Fin)) {
                throw new Exception("El alojamiento no está disponible en esas fechas");
            }

            $sql = "INSERT INTO Alojamiento_Detalle (ID_Alojamiento, ID_Usuario, Fecha_Inicio, Fecha_Fin, Estado) 
                    VALUES ($objeto->ID_Alojamiento, $objeto->ID_Usuario, '$objeto->Fecha_Inicio', '$objeto->Fecha_Fin', 'Reservado')";

            $id = $this->enlace->executeSQL_DML_last($sql);

            return $this->get($id);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* ============================
       CREAR RESERVA DE SERVICIO
    ============================ */
    public function createReservaServicio($objeto) {
        try {
            $sql = "INSERT INTO Reserva_Servicio 
                    (ID_AlojamientoDetalle, ID_Servicio, Fecha_Inicio, Fecha_Fin, Estado)
                    VALUES (
                        $objeto->ID_AlojamientoDetalle,
                        $objeto->ID_Servicio,
                        '$objeto->Fecha_Inicio',
                        " . (isset($objeto->Fecha_Fin) ? "'$objeto->Fecha_Fin'" : "NULL") . ",
                        'Reservado'
                    )";
            
            $id = $this->enlace->executeSQL_DML_last($sql);
            return $id;
            
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* ============================
       ACTUALIZAR ESTADO DE RESERVA
    ============================ */
    public function updateEstado($id, $estado) {
        try {
            $sql = "UPDATE Alojamiento_Detalle 
                    SET Estado = '$estado' 
                    WHERE ID = " . intval($id);
            
            $this->enlace->executeSQL_DML($sql);
            
            return $this->get($id);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* ============================
       VERIFICAR DISPONIBILIDAD DE ALOJAMIENTO
    ============================ */
    public function verificarDisponibilidad($idAlojamiento, $fechaInicio, $fechaFin) {
        try {
            $sql = "SELECT COUNT(*) as conflictos 
                    FROM Alojamiento_Detalle 
                    WHERE ID_Alojamiento = " . intval($idAlojamiento) . " 
                    AND Estado IN ('Reservado', 'Confirmado')
                    AND (
                        (Fecha_Inicio <= '$fechaInicio' AND Fecha_Fin > '$fechaInicio') OR
                        (Fecha_Inicio < '$fechaFin' AND Fecha_Fin >= '$fechaFin') OR
                        (Fecha_Inicio >= '$fechaInicio' AND Fecha_Fin <= '$fechaFin')
                    )";
            
            $result = $this->enlace->ExecuteSQL($sql);
            return isset($result[0]) && intval($result[0]->conflictos) == 0;
            
        } catch (Exception $e) {
            handleException($e);
            return false;
        }
    }

    /* ============================
       OBTENER SERVICIOS POR RESERVA
    ============================ */
    public function getServiciosByReserva($idAlojamientoDetalle) {
        try {
            $sql = "SELECT rs.*, s.Nombre AS NombreServicio, s.Descripcion, s.Tipo, s.Precio
                    FROM Reserva_Servicio rs
                    JOIN Servicio s ON rs.ID_Servicio = s.ID
                    WHERE rs.ID_AlojamientoDetalle = " . intval($idAlojamientoDetalle) . "
                    ORDER BY rs.Fecha_Inicio";
            
            return $this->enlace->ExecuteSQL($sql);
            
        } catch (Exception $e) {
            handleException($e);
            return [];
        }
    }
}
