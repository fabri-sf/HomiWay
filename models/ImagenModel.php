<?php
class UbicacionModel {
    public $enlace;
    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function get($id) {
        try {
            $sql = "SELECT * FROM ubicacion WHERE ID = $id";
            $res = $this->enlace->ExecuteSQL($sql);
            return !empty($res) ? $res[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
