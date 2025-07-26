<?php
class EtiquetaModel
{
    private $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

 

    public function create($obj)
    {
        try {
            if (!$this->exists($obj->ID_Alojamiento, $obj->ID_Promocion)) {
                $sql = "INSERT INTO Etiqueta (ID_Alojamiento, Nombre, Descripcion, ID_Promocion)
                        VALUES ($obj->ID_Alojamiento, '$obj->Nombre', '$obj->Descripcion', $obj->ID_Promocion)";
                return $this->enlace->executeSQL_DML_last($sql);
            } else {
                return ['error' => 'Ya existe la relación entre ese alojamiento y promoción.'];
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }


    private function exists($idAlojamiento, $idPromocion)
    {
        $sql = "SELECT ID FROM Etiqueta WHERE ID_Alojamiento = $idAlojamiento AND ID_Promocion = $idPromocion";
        $result = $this->enlace->ExecuteSQL($sql);
        return !empty($result);
    }

    public function createByCategoria($categoria, $idPromocion)
    {
        try {
            $sql = "SELECT ID FROM Alojamiento WHERE Categoria = '$categoria' AND Estado = 1";
            $alojamientos = $this->enlace->ExecuteSQL($sql);

            foreach ($alojamientos as $alojamiento) {
                if (!$this->exists($alojamiento->ID, $idPromocion)) {
                    $insertSQL = "INSERT INTO Etiqueta (ID_Alojamiento, ID_Promocion)
                                  VALUES ($alojamiento->ID, $idPromocion)";
                    $this->enlace->executeSQL_DML($insertSQL);
                }
            }

            return ['success' => true, 'mensaje' => "Promoción aplicada a categoría '$categoria'"];
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
