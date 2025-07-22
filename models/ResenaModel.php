<?php
class ResenaModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
 public function getAll() {
    $sql = "SELECT 
              r.ID, 
              r.Calificacion, 
              r.Comentario, 
              r.Fecha, 
              r.Estado, 
              r.ID_Usuario, 
              u.Nombre AS UsuarioNombre, 
              r.ID_Alojamiento
            FROM resena r
            JOIN Usuario u ON r.ID_Usuario = u.ID
            WHERE r.Estado = 1
            ORDER BY r.Fecha DESC;";
    return $this->enlace->ExecuteSQL($sql);
    }

    public function getByAlojamiento($idAlojamiento) {
        try {
            $idAlojamiento = intval($idAlojamiento); 
           $sql = "SELECT 
                    r.ID,
                    r.ID_Usuario,
                    r.Comentario,
                    r.Calificacion,
                    r.Fecha,
                    CONCAT(u.Nombre, ' ', u.Apellido) AS UsuarioNombre
                    FROM resena r
                    JOIN Usuario u ON r.ID_Usuario = u.ID
                    WHERE r.ID_Alojamiento = $idAlojamiento
                    ORDER BY r.Fecha DESC";

         return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($objeto) {
    if (!$objeto->Comentario || !$objeto->Calificacion || !$objeto->ID_Usuario || !$objeto->ID_Alojamiento) {
        throw new Exception("Campos incompletos");
    }

    $sql = "INSERT INTO resena (Comentario, Calificacion, ID_Usuario, ID_Alojamiento, Estado, Fecha)
            VALUES (
                '$objeto->Comentario',
                $objeto->Calificacion,
                $objeto->ID_Usuario,
                $objeto->ID_Alojamiento,
                1,
                NOW()
            );";

    $newID = $this->enlace->executeSQL_DML_last($sql);
    return $this->getById($newID);
    }

    public function update($objeto, $idResena) {
    if (!$objeto->Comentario || !$objeto->Calificacion) {
        throw new Exception("Campos incompletos");
    }

    $sql = "UPDATE resena SET
                Comentario = '$objeto->Comentario',
                Calificacion = $objeto->Calificacion
            WHERE ID = $idResena;";
            
    $this->enlace->executeSQL_DML($sql);
    return $this->getById($idResena);
    }

    public function deleteLogico($idResena) {
    $sql = "UPDATE resena SET Estado = 0 WHERE ID = $idResena;";
    $this->enlace->executeSQL_DML($sql);
    return ['success' => true];
    }

    public function getById($idResena) {
    $sql = "SELECT * FROM resena WHERE ID = $idResena;";
    $result = $this->enlace->ExecuteSQL($sql);
    return $result[0] ?? null;
    }

}
