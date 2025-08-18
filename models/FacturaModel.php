<?php
class FacturaModel {
    public $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }


    public function all() {
        try {
            $sql = "SELECT f.*, u.Nombre AS NombreCliente, u.Apellido 
                    FROM Factura f
                    JOIN Usuario u ON f.ID_Usuario = u.ID
                    ORDER BY f.Fecha DESC";
            
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function get($id) {
        try {
            $sql = "SELECT f.*, u.Nombre AS NombreCliente, u.Apellido 
                    FROM Factura f
                    JOIN Usuario u ON f.ID_Usuario = u.ID
                    WHERE f.ID = " . intval($id);
            
            $result = $this->enlace->ExecuteSQL($sql);
            return isset($result[0]) ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function getByUsuario($usuarioId) {
        try {
            $sql = "SELECT f.* 
                    FROM Factura f
                    WHERE f.ID_Usuario = " . intval($usuarioId) . "
                    ORDER BY f.Fecha DESC";
            
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function create($objeto) {
        try {
            // Iniciar transacción
            $this->enlace->executeSQL_DML("START TRANSACTION");

            $sql = "INSERT INTO Factura (ID_Usuario, Total, Estado) 
                    VALUES ($objeto->ID_Usuario, $objeto->Total, 'Pendiente')";
            
            $idFactura = $this->enlace->executeSQL_DML_last($sql);

            // Insertar detalles de factura
            foreach ($objeto->Detalles as $detalle) {
                $sql = "INSERT INTO Factura_Detalle 
                        (ID_Factura, ID_Alojamiento, ID_Servicio, Cantidad, PrecioUnitario, Subtotal, Impuesto, Total)
                        VALUES (
                            $idFactura,
                            " . (isset($detalle->ID_Alojamiento) ? $detalle->ID_Alojamiento : "NULL") . ",
                            " . (isset($detalle->ID_Servicio) ? $detalle->ID_Servicio : "NULL") . ",
                            " . ($detalle->Cantidad ?? 1) . ",
                            $detalle->PrecioUnitario,
                            $detalle->Subtotal,
                            $detalle->Impuesto,
                            $detalle->Total
                        )";
                
                $this->enlace->executeSQL_DML($sql);
            }

            // Confirmar transacción
            $this->enlace->executeSQL_DML("COMMIT");

            return $this->get($idFactura);

        } catch (Exception $e) {
            // Revertir transacción en caso de error
            $this->enlace->executeSQL_DML("ROLLBACK");
            handleException($e);
        }
    }


public function registrarPago($objeto) {
    try {

        $this->enlace->executeSQL_DML("START TRANSACTION");

        // 1. Actualizar estado de factura
        $sql = "UPDATE Factura SET Estado = 'Pagada' WHERE ID = " . intval($objeto->ID_Factura);
        $this->enlace->executeSQL_DML($sql);

        // 2. Registrar pago
        $sql = "INSERT INTO Pagos 
                (Factura_ID, Monto, Estado, Banco, Fecha_Pago, Ultimos4_Digitos, PIN, Fecha_Exp, MetodoPago)
                VALUES (
                    $objeto->ID_Factura,
                    $objeto->Monto,
                    'Completado',
                    " . (isset($objeto->Banco) ? "'$objeto->Banco'" : "NULL") . ",
                    NOW(),
                    " . (isset($objeto->Ultimos4_Digitos) ? "'$objeto->Ultimos4_Digitos'" : "NULL") . ",
                    " . (isset($objeto->PIN) ? "'$objeto->PIN'" : "NULL") . ",
                    " . (isset($objeto->Fecha_Exp) ? "'$objeto->Fecha_Exp'" : "NULL") . ",
                    '$objeto->MetodoPago'
                )";
        
        $idPago = $this->enlace->executeSQL_DML_last($sql);

        $sql = "UPDATE Alojamiento_Detalle ad
                SET ad.Estado = 'Pagado'
                WHERE ad.ID_Alojamiento IN (
                    SELECT fd.ID_Alojamiento 
                    FROM Factura_Detalle fd 
                    WHERE fd.ID_Factura = " . intval($objeto->ID_Factura) . "
                    AND fd.ID_Alojamiento IS NOT NULL
                )";
        
        $this->enlace->executeSQL_DML($sql);


        $this->enlace->executeSQL_DML("COMMIT");

        return $idPago;

    } catch (Exception $e) {
     
        $this->enlace->executeSQL_DML("ROLLBACK");
        handleException($e);
    }
}


public function getReservasFacturables($usuarioId) {
    try {
        // Obtener reservas de alojamiento
        $sql = "SELECT ad.*, a.Nombre AS NombreAlojamiento, a.PrecioNoche,
                       DATEDIFF(ad.Fecha_Fin, ad.Fecha_Inicio) AS Noches,
                       (a.PrecioNoche * DATEDIFF(ad.Fecha_Fin, ad.Fecha_Inicio)) AS TotalAlojamiento
                FROM Alojamiento_Detalle ad
                JOIN Alojamiento a ON ad.ID_Alojamiento = a.ID
                WHERE ad.ID_Usuario = " . intval($usuarioId) . "
                AND ad.Estado IN ('Reservado', 'Confirmado')
                ORDER BY ad.Fecha_Inicio DESC";
        
        $reservas = $this->enlace->ExecuteSQL($sql);
        
        // VALIDAR que $reservas no sea null
        if (!$reservas || !is_array($reservas)) {
            return []; // Retornar array vacío si no hay reservas
        }
        
        // Para cada reserva, obtener servicios
        foreach ($reservas as $key => $reserva) {
            $sqlServicios = "SELECT rs.*, s.Nombre AS NombreServicio, s.Precio
                            FROM Reserva_Servicio rs
                            JOIN Servicio s ON rs.ID_Servicio = s.ID
                            WHERE rs.ID_AlojamientoDetalle = " . intval($reserva->ID) . "
                            AND rs.Estado = 'Reservado'";
            
            $servicios = $this->enlace->ExecuteSQL($sqlServicios);
            $reservas[$key]->servicios = $servicios ?: [];
            
            // Calcular total de servicios
            $totalServicios = 0;
            if ($servicios && is_array($servicios)) {
                foreach ($servicios as $servicio) {
                    $totalServicios += floatval($servicio->Precio);
                }
            }
            $reservas[$key]->TotalServicios = $totalServicios;
        }
        
        return $reservas;
        
    } catch (Exception $e) {
        handleException($e);
        return [];
    }
}


    public function getReservasFacturablesV2($usuarioId) {
        try {

            $sql = "SELECT ad.*, a.Nombre AS NombreAlojamiento, a.PrecioNoche,
                           DATEDIFF(ad.Fecha_Fin, ad.Fecha_Inicio) AS Noches,
                           (a.PrecioNoche * DATEDIFF(ad.Fecha_Fin, ad.Fecha_Inicio)) AS TotalAlojamiento
                    FROM Alojamiento_Detalle ad
                    JOIN Alojamiento a ON ad.ID_Alojamiento = a.ID
                    LEFT JOIN Factura_Detalle fd ON fd.ID_Alojamiento = a.ID
                    LEFT JOIN Factura f ON fd.ID_Factura = f.ID AND f.ID_Usuario = ad.ID_Usuario
                    WHERE ad.ID_Usuario = " . intval($usuarioId) . "
                    AND ad.Estado IN ('Reservado', 'Confirmado')
                    AND (f.ID IS NULL OR f.Estado = 'Cancelada')
                    GROUP BY ad.ID
                    ORDER BY ad.Fecha_Inicio DESC";
            
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getDetalles($idFactura) {
        try {
            $sql = "SELECT fd.*, 
                           COALESCE(a.Nombre, s.Nombre) AS NombreItem,
                           CASE 
                               WHEN fd.ID_Alojamiento IS NOT NULL THEN 'Alojamiento'
                               WHEN fd.ID_Servicio IS NOT NULL THEN 'Servicio'
                           END AS Tipo
                    FROM Factura_Detalle fd
                    LEFT JOIN Alojamiento a ON fd.ID_Alojamiento = a.ID
                    LEFT JOIN Servicio s ON fd.ID_Servicio = s.ID
                    WHERE fd.ID_Factura = " . intval($idFactura);
            
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function getReservasYaFacturadas($usuarioId) {
        try {
            $sql = "SELECT ad.*, a.Nombre AS NombreAlojamiento, f.ID as FacturaID, f.Estado as EstadoFactura
                    FROM Alojamiento_Detalle ad
                    JOIN Alojamiento a ON ad.ID_Alojamiento = a.ID
                    JOIN Factura_Detalle fd ON fd.ID_Alojamiento = a.ID
                    JOIN Factura f ON fd.ID_Factura = f.ID
                    WHERE ad.ID_Usuario = " . intval($usuarioId) . "
                    ORDER BY ad.Fecha_Inicio DESC";
            
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}