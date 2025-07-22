<?php
class UbicacionModel {
    public $enlace;
    public function __construct() {
        $this->enlace = new MySqlConnect();
    }
    public function all() {
        try {
            $sql = "
              SELECT 
                ID,
                Provincia,
                Canton,
                Distrito,
                DireccionExacta
              FROM ubicacion
            ";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create(
        $provincia,
        $canton,
        $distrito,
        $direccion,
        $codigoPostal = null,
        $api = null
    ) {
        try {
            $vSql = "
              INSERT INTO ubicacion
                (Provincia, Canton, Distrito, Direccion, CodigoPostal, API)
              VALUES
                (
                  '$provincia',
                  '$canton',
                  '$distrito',
                  '$direccion',
                  ". ($codigoPostal !== null ? "'$codigoPostal'" : "NULL") . ",
                  ". ($api          !== null ? "'$api'"         : "NULL") . "
                )
            ";
            return $this->enlace->executeSQL_DML_last($vSql);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function get($id) {
        $vSql = "SELECT * FROM ubicacion WHERE ID = $id";
        $res   = $this->enlace->ExecuteSQL($vSql);
        return $res[0] ?? null;
    }



    public function update($id, $provincia, $canton, $distrito, $direccion) {
        try {
            $sql = "
              UPDATE ubicacion
                 SET Provincia        = '$provincia',
                     Canton           = '$canton',
                     Distrito         = '$distrito',
                     DireccionExacta  = '$direccion'
               WHERE ID = $id
            ";
            return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}


