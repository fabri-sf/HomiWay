
<?php
class Servicio{

       public function index() {
        try {
            $response = new Response();
            $model = new ServicioModel();
            $data  = $model->all();
            $response->toJSON($data);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function getByAlojamiento($idAlojamiento)
    {
        try {
            $response = new Response();
            $servicioM = new ServicioModel();
            $result = $servicioM->getByAlojamiento($idAlojamiento);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
