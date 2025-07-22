<?php
class RolModel {
    public $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function all() {
        try {
            $vSql = "SELECT * FROM rol;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function get($id) {
        try {
            $vSql = "SELECT * FROM rol WHERE ID = $id;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function getRolUser($idUsuario) {
        try {
            $vSql = "SELECT r.ID, r.Rol
                     FROM rol r
                     INNER JOIN usuario u ON r.ID = u.ID_Rol
                     WHERE u.ID = $idUsuario;";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            return $vResultado[0];
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }
}