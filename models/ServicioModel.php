<?php
class ServicioModel {
    public $enlace;
    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function getByAlojamiento($idAlojamiento) {
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

      public function all() {
        try {
            $sql = "SELECT ID, Nombre, Tipo, Precio, Descripcion
                      FROM servicio";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

}
