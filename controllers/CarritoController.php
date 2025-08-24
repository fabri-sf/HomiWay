<?php

<<<<<<< HEAD
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
=======
class CarritoController
{
    private $model;
//yaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
    public function __construct()
    {
        $this->model = new CarritoModel();
    }

    /**
     * GET /CarritoController/index/{usuarioId}
     */
    public function index($usuarioId)
    {
        $response = new Response();

        try {
            $items = $this->model->getByUsuario((int) $usuarioId);

            foreach ($items as &$item) {
                $item->imagenes   = (new ImageModel())->getImagesByAlojamientoId((int) $item->alojamiento_id);
                $item->servicios  = (new ServicioModel())->getByAlojamiento((int) $item->alojamiento_id);
            }

            return $response->toJSON($items, 200);
        } catch (\Throwable $e) {
            error_log("[CarritoController::index] " . $e->getMessage());
            return $response->toJSON(
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * POST /CarritoController/store
     */
    public function store()
    {
        $raw  = file_get_contents("php://input");
        $data = json_decode($raw, true);
        $response = new Response();

        // Validar payload
        if (!$data || !isset($data['usuario_id'], $data['alojamiento_id'])) {
            return $response->toJSON(
                [
                    'error' => 'Payload inválido',
                    'raw'   => $raw
                ],
                400
            );
        }

        try {
            $items = $this->model->create(
                (int) $data['usuario_id'],
                (int) $data['alojamiento_id']
            );

            return $response->toJSON($items, 201);
        } catch (\Throwable $e) {
            error_log("[CarritoController::store] " . $e->getMessage());
            return $response->toJSON(
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * DELETE /CarritoController/destroy/{carritoId}
     */
    public function destroy($carritoId)
    {
        $response = new Response();

        try {
            $ok = $this->model->delete((int) $carritoId);
            return $response->toJSON(['success' => $ok], 200);
        } catch (\Throwable $e) {
            error_log("[CarritoController::destroy] " . $e->getMessage());
            return $response->toJSON(
                ['error' => $e->getMessage()],
                500
            );
        }
    }

    /**
     * DELETE /CarritoController/clear/{usuarioId}
     */
    public function clear($usuarioId)
    {
        $response = new Response();

        try {
            $ok = $this->model->clear((int) $usuarioId);
            return $response->toJSON(['success' => $ok], 200);
        } catch (\Throwable $e) {
            error_log("[CarritoController::clear] " . $e->getMessage());
            return $response->toJSON(
                ['error' => $e->getMessage()],
                500
            );
        }
    }
}
>>>>>>> 27051188f360108f780a3cbcdf8e005158c721d0
