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
            $response = new Response();
            $ubicacionM = new UbicacionModel();
            $result = $ubicacionM->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}