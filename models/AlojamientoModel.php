<?php
class AlojamientoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

  public function allMinimal()
{
    try {
        $sql = "SELECT a.id, a.nombre, a.descripcion, a.categoria FROM alojamiento a  WHERE a.Estado = 1
";
        $result = $this->enlace->ExecuteSQL($sql);

        // Asociar imágenes a cada alojamiento
        $imagenM = new ImageModel();
        foreach ($result as &$alojamiento) {
        $alojamiento->imagenes = $imagenM->getImagesByAlojamientoId($alojamiento->id); 
        }

        return $result;
    } catch (Exception $e) {
        handleException($e);
    }
}

    public function get($id)
    {
        try {
            $imagenM = new ImageModel();
            $ubicacionM = new UbicacionModel();
            //$usuarioM = new UsuarioModel();
            $servicioM = new ServicioModel();

            $sql = "SELECT * FROM alojamiento WHERE ID = $id";
            $result = $this->enlace->ExecuteSQL($sql);

            if (!empty($result)) {
                $alojamiento = $result[0];

                $alojamiento->imagenes = $imagenM->getImagesByAlojamientoId($alojamiento->ID);
                $alojamiento->ubicacion = $ubicacionM->get($alojamiento->ID_Ubicacion);
                //$alojamiento->usuario = $usuarioM->get($alojamiento->ID_Usuario);
               $alojamiento->servicios = $servicioM->getByAlojamiento($alojamiento->ID);

                return $alojamiento;
            }
            return null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($objeto) {
    $sql = "INSERT INTO alojamiento (ID_Usuario, ID_Ubicacion, Nombre, Descripcion, PrecioNoche, Capacidad, Caracteristicas, Estado, Categoria)
            VALUES ($objeto->ID_Usuario, $objeto->ID_Ubicacion, '$objeto->Nombre', '$objeto->Descripcion',
                    $objeto->PrecioNoche, $objeto->Capacidad, '$objeto->Caracteristicas', $objeto->Estado, '$objeto->Categoria')";
    $newId = $this->enlace->executeSQL_DML_last($sql);
    return $this->get($newId);
}

    public function update($obj, $id) {
    $sql = "UPDATE alojamiento SET
                Nombre = '$obj->Nombre',
                Descripcion = '$obj->Descripcion',
                PrecioNoche = $obj->PrecioNoche,
                Capacidad = $obj->Capacidad,
                Caracteristicas = '$obj->Caracteristicas',
                Estado = $obj->Estado,
                Categoria = '$obj->Categoria',
                ID_Ubicacion = $obj->ID_Ubicacion
            WHERE ID = $id";
    $this->enlace->executeSQL_DML($sql);
    return $this->get($id);
    }

   public function deleteLogico(int $id) {
    $sql = "UPDATE alojamiento SET Estado = 0 WHERE ID = $id";
    $this->enlace->executeSQL_DML($sql);
    return ['success' => true];
    }

public function getCategorias() {
    try {
        $sql = "SELECT DISTINCT Categoria FROM alojamiento WHERE Estado = 1 AND Categoria IS NOT NULL";
        $result = $this->enlace->ExecuteSQL($sql);
        
        return array_map(function($item) {
            return $item->Categoria; // ← corrección aquí
        }, $result);
        
    } catch (Exception $e) {
        handleException($e);
    }
}
}
