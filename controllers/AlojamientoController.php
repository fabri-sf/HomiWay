<?php
// localhost:81/apihomiway/alojamiento

class alojamiento
{
    // GET listar todos los alojamientos (versión minimal)
    public function index()
    {
        try {
            $response = new Response();
            $alojamientoM = new AlojamientoModel();
            $alojamientos = $alojamientoM->allMinimal(); // Método para datos mínimos con imagen principal
            $response->toJSON($alojamientos);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET obtener un alojamiento por ID
    public function get($id)
    {
        try {
            $response = new Response();
            $model = new AlojamientoModel();
            $resultado = $model->get($id); // Trae detalle completo con imágenes, ubicacion, etc.
            $response->toJSON($resultado);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
