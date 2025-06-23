<?php
class EtiquetaModel {
    public $enlace;
    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function getByAlojamiento($idAlojamiento) {
        try {
            $sql = "SELECT * FROM etiqueta WHERE ID_Alojamiento = $idAlojamiento";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
