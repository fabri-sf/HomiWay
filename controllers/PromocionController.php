<?php
class Promocion
{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $promocion = new PromocionModel();
            $result = $promocion->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function get($param)
    {
        try {
            $response = new Response();
            $promocion = new PromocionModel();
            $result = $promocion->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
   
     public function promocionesPorCategoria($categoria)
    {
        try {
            $response = new Response();
            $promocion = new PromocionModel();
            $result = $promocion->obtenerPromocionesPorCategoria($categoria);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function alojamientosConPromociones()
    {
        try {
            $response = new Response();
            $promocion = new PromocionModel();
            $result = $promocion->obtenerAlojamientosConPromociones();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function calcularPrecio($precioOriginal, $promocionID)
    {
        try {
            $response = new Response();
            $promocion = new PromocionModel();
            $result = $promocion->calcularPrecioConDescuento($precioOriginal, $promocionID);
            $response->toJSON(['precioDescuento' => $result]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
