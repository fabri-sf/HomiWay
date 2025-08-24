<?php
<<<<<<< HEAD

class CarritoModel
{
  private $enlace;

  public function __construct()
  {
    $this->enlace = new MySqlConnect();
  }

  public function allMinimal(): array
  {
    $db = new MySqlConnect();
    $sql = "
            SELECT
                id                   AS carrito_id,
                usuario_id,
                alojamiento_id,
                fecha_creacion,
                fecha_actualizacion
            FROM carrito
            ORDER BY fecha_creacion DESC
        ";
    return $db->ExecuteSQL($sql, []);
  }

  public function getByUsuario(int $usuarioId): array
  {
    $db = new MySqlConnect();
    $sql = "
            SELECT
                id                   AS carrito_id,
                usuario_id,
                alojamiento_id,
                fecha_creacion,
                fecha_actualizacion
            FROM carrito
            WHERE usuario_id = $usuarioId
            ORDER BY fecha_creacion DESC
        ";
    return $db->ExecuteSQL($sql, []);
  }

 public function create($data)
    {
        $usuarioId     = (int) $data->usuario_id;
        $alojamientoId = (int) $data->alojamiento_id;
        $sql = "
            INSERT INTO carrito (usuario_id, alojamiento_id)
            VALUES ($usuarioId, $alojamientoId)
        ";

        $newId = $this->enlace->executeSQL_DML_last($sql);
        return $this->get($newId);
    }


  public function get(int $carritoId): ?array
  {
    $db = new MySqlConnect();
    $sql = "
            SELECT
                id                   AS carrito_id,
                usuario_id,
                alojamiento_id,
                fecha_creacion,
                fecha_actualizacion
            FROM carrito
            WHERE id = $carritoId
            LIMIT 1
        ";
    $result = $db->ExecuteSQL($sql, []);
    return $result ? $result[0] : null;
  }

  public function delete(int $carritoId): bool
  {
    $db = new MySqlConnect();
    $sql = "DELETE FROM carrito WHERE id = $carritoId";
    return (bool) $db->executeSQL_DML($sql);
  }

  public function clear(int $usuarioId): bool
  {
    $db = new MySqlConnect();
    $sql = "DELETE FROM carrito WHERE usuario_id = $usuarioId";
    return (bool) $db->executeSQL_DML($sql);
  }
}
=======
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
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
