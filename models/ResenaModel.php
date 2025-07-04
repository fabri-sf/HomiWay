<?php
class ResenaModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all(){
        try {
            //Consulta sql
			$vSql = "SELECT * FROM resena;";
			
            //Ejecutar la consulta
			$vResultado = $this->enlace->ExecuteSQL ($vSql);
				
			// Retornar el objeto
			return $vResultado;
		} catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener, MODIFICAR PARA QUE OBTENGA LA FOTO */ 

    public function getByAlojamiento($idAlojamiento) {
        try {
            $idAlojamiento = intval($idAlojamiento); 
           $sql = "SELECT r.ID, r.Calificacion, r.Comentario, r.Fecha, r.Estado, r.ID_Usuario,
               u.Nombre AS UsuarioNombre
                FROM resena r
                JOIN Usuario u ON r.ID_Usuario = u.ID
                WHERE r.ID_Alojamiento = $idAlojamiento
                ORDER BY r.Fecha DESC";

         return $this->enlace->ExecuteSQL($sql);
        } catch (Exception $e) {
            handleException($e);
        }
    }


}
