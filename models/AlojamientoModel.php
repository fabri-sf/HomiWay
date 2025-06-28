<?php
class AlojamientoModel
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    // Obtener lista minimal de alojamientos (solo id, nombre, desc corta e imagen principal)
 public function allMinimal()
{
    try {
        $sql = "SELECT a.id, a.nombre, a.descripcion, i.URL AS imagen
                FROM alojamiento a
                LEFT JOIN imagen_alojamiento i ON a.id = i.ID_Alojamiento
                GROUP BY a.id, a.nombre, a.descripcion";
        $result = $this->enlace->ExecuteSQL($sql);
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
            $usuarioM = new UsuarioModel();
            $etiquetaM = new EtiquetaModel();
            $servicioM = new ServicioModel();

            $sql = "SELECT * FROM alojamiento WHERE ID = $id";
            $result = $this->enlace->ExecuteSQL($sql);

            if (!empty($result)) {
                $alojamiento = $result[0];

                $alojamiento->imagenes = $imagenM->getImagesByAlojamientoId($alojamiento->ID);
                $alojamiento->ubicacion = $ubicacionM->get($alojamiento->ID_Ubicacion);
                $alojamiento->usuario = $usuarioM->get($alojamiento->ID_Usuario);
                $alojamiento->etiquetas = $etiquetaM->getByAlojamiento($alojamiento->ID);
                $alojamiento->servicios = $servicioM->getByAlojamiento($alojamiento->ID);

                return $alojamiento;
            }
            return null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
