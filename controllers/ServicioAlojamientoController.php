<?php
class ServicioAlojamiento {
    public function index() {
        $model  = new ServicioAlojamientoModel();
        $result = $model->all();
        (new Response())->toJSON($result);
    }

    public function getByAlojamiento($id) {
        $model  = new ServicioAlojamientoModel();
        $result = $model->getByAlojamiento((int)$id);
        (new Response())->toJSON($result);
    }

    public function create() {
        $body = json_decode(file_get_contents("php://input"), true);

        $idAloj     = $body["ID_Alojamiento"] ?? null;
        $idServicio = $body["ID_Servicio"]    ?? null;

        if (!$idAloj || !$idServicio) {
            (new Response())->toJSON([
                'status'  => 'error',
                'message' => 'Datos incompletos'
            ]);
            return;
        }

        $model = new ServicioAlojamientoModel();
        $newId = $model->create((int)$idAloj, (int)$idServicio);

        (new Response())->toJSON(['success' => true]);
    }
}