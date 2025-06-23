
<?php
//class G
class Servicio{
    //POST Crear
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
