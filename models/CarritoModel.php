<?php
class CarritoModel {
    public $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function getByUsuario(int $usuarioId): array {
        $sql = "SELECT c.id AS carrito_id, c.usuario_id, c.alojamiento_id, 
                c.fecha_creacion, a.Nombre AS alojamiento_nombre, 
                a.PrecioNoche AS alojamiento_precio
                FROM carrito c
                JOIN alojamiento a ON a.ID = c.alojamiento_id
                WHERE c.usuario_id = ?
                ORDER BY c.fecha_creacion DESC";
        
        return $this->enlace->ExecuteSQL($sql, [$usuarioId]);
    }

    public function create(int $usuarioId, int $alojamientoId): array {
        $sql = "INSERT INTO carrito (usuario_id, alojamiento_id, fecha_creacion)
                VALUES (?, ?, NOW())";
        
        $this->enlace->executeSQL_DML($sql, [$usuarioId, $alojamientoId]);
        return $this->getByUsuario($usuarioId);
    }

    public function delete(int $carritoId): bool {
        $sql = "DELETE FROM carrito WHERE id = ?";
        return (bool)$this->enlace->executeSQL_DML($sql, [$carritoId]);
    }

    public function clear(int $usuarioId): bool {
        $sql = "DELETE FROM carrito WHERE usuario_id = ?";
        return (bool)$this->enlace->executeSQL_DML($sql, [$usuarioId]);
    }
}