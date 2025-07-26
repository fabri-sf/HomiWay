<?php 
class Promocion {
    
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
    
    public function create() 
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            
            if (!$data->Descripcion || !$data->Tipo || !$data->Valor || !$data->Inicio || !$data->Fin) {
                throw new Exception("Campos incompletos");
            }
            
            $model = new PromocionModel();
            $result = $model->create($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
  
    public function update($idPromocion) 
    {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            
            if (!$data->Codigo || !$data->Descripcion || !$data->Tipo || !$data->Valor || !$data->Inicio || !$data->Fin) {
                throw new Exception("Campos incompletos");
            }

            $data->ID = $idPromocion;

            $model = new PromocionModel();
            $result = $model->update($data);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    // Método nuevo para eliminar asociaciones
    public function eliminarAsociaciones($idPromocion) 
    {
        try {
            $response = new Response();
            $model = new PromocionModel();
            $result = $model->eliminarAsociaciones($idPromocion);
            
            if ($result) {
                $response->toJSON(['success' => true, 'mensaje' => 'Asociaciones eliminadas correctamente']);
            } else {
                $response->toJSON(['success' => false, 'mensaje' => 'Error al eliminar asociaciones']);
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
  
}