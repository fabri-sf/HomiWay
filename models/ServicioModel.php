<?php
class ServicioModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function getByAlojamiento($idAlojamiento)
    {
        try {
            $sql = "SELECT s.*
                    FROM servicio s
                    JOIN servicio_alojamiento sa ON s.ID = sa.ID_Servicio
                    WHERE sa.ID_Alojamiento = $idAlojamiento";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function all()
    {
        try {
            $sql = "SELECT ID, Nombre, Tipo, Precio, Descripcion
                      FROM servicio";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function create($data)
    {
        $nombre = addslashes($data->Nombre);
        $tipo = addslashes($data->Tipo);
        $precio = floatval($data->Precio);
        $descripcion = addslashes($data->Descripcion);
        $sql = "
          INSERT INTO servicio (Nombre, Tipo, Precio, Descripcion)
          VALUES ('$nombre', '$tipo', $precio, '$descripcion')
        ";
        $newId = $this->enlace->executeSQL_DML_last($sql);
        // devolver objeto creado
        return array_merge(['ID' => $newId], [
            'Nombre' => $data->Nombre,
            'Tipo' => $data->Tipo,
            'Precio' => $data->Precio,
            'Descripcion' => $data->Descripcion
        ]);
    }
    public function find(int $id)
    {
        try {
            $sql = "SELECT ID, Nombre, Tipo, Precio, Descripcion
                   FROM servicio
                  WHERE ID = " . intval($id);
            $rows = $this->enlace->ExecuteSQL($sql);
            return $rows[0] ?? null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function update(int $id, $data)
    {
        $parts = [];

        if (isset($data->Nombre))
            $parts[] = "Nombre = '" . addslashes($data->Nombre) . "'";
        if (isset($data->Tipo))
            $parts[] = "Tipo = '" . addslashes($data->Tipo) . "'";
        if (isset($data->Precio))
            $parts[] = "Precio = " . floatval($data->Precio);
        if (isset($data->Descripcion))
            $parts[] = "Descripcion = '" . addslashes($data->Descripcion) . "'";

        if (isset($data->Imagen))
            $parts[] = "Imagen = '" . addslashes($data->Imagen) . "'";

        if ($parts) {
            $sql = "UPDATE servicio
                   SET " . implode(", ", $parts) . "
                 WHERE ID = $id";
            $this->enlace->executeSQL_DML($sql);
        }

        return array_merge(['ID' => $id], get_object_vars($data));
    }


    public function delete(int $id)
    {
        $sql = "DELETE FROM servicio WHERE ID = $id";
        $this->enlace->executeSQL_DML($sql);
    }

}
