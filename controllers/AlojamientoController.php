<?php

class alojamiento
{
    public function index()
    {
        try {
            $response = new Response();
            $alojamientoM = new AlojamientoModel();
            $alojamientos = $alojamientoM->allMinimal(); 
            $response->toJSON($alojamientos);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $model = new AlojamientoModel();
            $resultado = $model->get($id);
            $response->toJSON($resultado);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create() {
    try {
        $request = new Request();
        $response = new Response();
        $json = $request->getJSON();

        $model = new AlojamientoModel();
        $nuevo = $model->create($json);
        $response->toJSON($nuevo);
    } catch (Exception $e) {
        handleException($e);
    }
    }

    public function update($id) {
    try {
        $request = new Request();
        $response = new Response();
        $json = $request->getJSON();

        $model = new AlojamientoModel();
        $actualizado = $model->update($json, $id);
        $response->toJSON($actualizado);
    } catch (Exception $e) {
        handleException($e);
    }
    }

    public function logico($id) {
    try {
        $response = new Response();
        $model = new AlojamientoModel();
        $result = $model->deleteLogico($id);
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
    }

public function categorias() {
    try {
        $response = new Response();
        $model = new AlojamientoModel();
        $categorias = $model->getCategorias();
        $response->toJSON($categorias); // Debe enviar: ["Hotel", "Casa", ...]
    } catch (Exception $e) {
        handleException($e);
    }
}

}
