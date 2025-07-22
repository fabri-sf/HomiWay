<?php
class ServicioAlojamientoModel {
    public $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function all() {
        $sql = "SELECT * FROM servicio_alojamiento";
        return $this->enlace->ExecuteSQL($sql);
    }

    public function getByAlojamiento($idAloj) {
        $sql = "
          SELECT s.*
            FROM servicio s
            JOIN servicio_alojamiento sa
              ON sa.ID_Servicio = s.ID
           WHERE sa.ID_Alojamiento = $idAloj
        ";
        return $this->enlace->ExecuteSQL($sql);
    }

    public function create($idAloj, $idServicio) {
        $sql = "
          INSERT INTO servicio_alojamiento
            (ID_Alojamiento, ID_Servicio)
          VALUES ($idAloj, $idServicio)
        ";
        return $this->enlace->executeSQL_DML_last($sql);
    }
}