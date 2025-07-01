<?php
//class rESEÑA
class Resena
{
    //Listar en el API
    public function getByAlojamiento($idAlojamiento) {
        try {
            $response = new Response();
            $model = new ResenaModel();
            $resenas = $model->getByAlojamiento($idAlojamiento); // ← este es seguro ahora
            $response->toJSON($resenas);
        } catch (Exception $e) {
            handleException($e);
        }
    }

}
