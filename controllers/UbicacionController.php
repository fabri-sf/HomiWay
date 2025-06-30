<?php
// UbicacionModel.php
class Ubicacion
{
    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

       public function get($id)
    {
        try {
            require_once 'UbicacionModel.php'; 
            $ubicacionM = new UbicacionModel();
            $result = $ubicacionM->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}