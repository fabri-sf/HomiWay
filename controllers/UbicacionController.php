<?php


class Ubicacion {
    public function index() {
        try {
            $model = new UbicacionModel();
            $data  = $model->all();
            (new Response())->toJSON($data);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id) {
        try {
            $model = new UbicacionModel();
            $item  = $model->get($id);
            (new Response())->toJSON($item);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create() {
        $body = json_decode(file_get_contents("php://input"), true);

        $prov = $body['Provincia']    ?? '';
        $can  = $body['Canton']       ?? '';
        $dis  = $body['Distrito']     ?? '';
        $dir  = $body['Direccion']    ?? '';
        $cp   = $body['CodigoPostal'] ?? null;
        $api  = $body['API']          ?? null;

        if (!$prov || !$can || !$dis || !$dir) {
            (new Response())->toJSON([
                'status'  => 'error',
                'message' => 'Faltan datos obligatorios'
            ]);
            return;
        }

        $model = new UbicacionModel();
        $newId = $model->create($prov, $can, $dis, $dir, $cp, $api);
        $newUb = $model->get($newId);

        (new Response())->toJSON($newUb);
    }

    public function update($id) {
        try {
            $body = json_decode(file_get_contents('php://input'), true);
            $prov = $body['Provincia'] ?? '';
            $can  = $body['Canton']    ?? '';
            $dis  = $body['Distrito']  ?? '';
            $dir  = $body['Direccion'] ?? '';

            if (!$prov || !$can || !$dis || !$dir) {
                echo json_encode(['status'=>'error','message'=>'Datos incompletos']);
                return;
            }

            $model = new UbicacionModel();
            $model->update($id, $prov, $can, $dis, $dir);

            (new Response())->toJSON(['success' => true]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}