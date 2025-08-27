<?php

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
