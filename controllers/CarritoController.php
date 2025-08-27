<?php

class carrito
{
    public function index()
    {
        try {
            $response = new Response();
            $carritoModel = new CarritoModel();
            $items = $carritoModel->allMinimal();
            $response->toJSON($items);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($usuarioId)
    {
        try {
            $response = new Response();
            $carritoModel = new CarritoModel();
            $items = $carritoModel->getByUsuario((int) $usuarioId);

            foreach ($items as &$item) {
                $item->imagenes = (new ImageModel())
                    ->getImagesByAlojamientoId((int) $item->alojamiento_id);
                $item->servicios = (new ServicioModel())
                    ->getByAlojamiento((int) $item->alojamiento_id);
            }

            $response->toJSON($items);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();

            $data = $request->getJSON();

            $model = new CarritoModel();
            $nuevo = $model->create($data);

            $response->toJSON($nuevo);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($carritoId)
    {
        try {
            $response = new Response();
            $carritoModel = new CarritoModel();
            $ok = $carritoModel->delete((int) $carritoId);
            $response->toJSON(['deleted' => $ok]);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function clear($usuarioId)
    {
        try {
            $response = new Response();
            $carritoModel = new CarritoModel();
            $ok = $carritoModel->clear((int) $usuarioId);
            $response->toJSON($ok);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
