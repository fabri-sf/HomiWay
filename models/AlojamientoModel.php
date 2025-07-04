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
        $sql = "SELECT a.id, a.nombre, a.descripcion FROM alojamiento a";
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

    // Obtener un alojamiento con todos sus detalles
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
}
