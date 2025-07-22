<?php
class Imagen {
    public function create() {
        $response         = new Response();
        $file             = $_FILES['file'] ?? null;
        $alojamiento_id   = $_POST['alojamiento_id'] ?? null;

        if (!$file || !$alojamiento_id) {
            $response->toJSON(['status'=>'error','message'=>'Faltan datos']);
            return;
        }

        $model = new ImageModel();
        $url   = $model->uploadFile($file, (int)$alojamiento_id);

        if ($url) {
            $response->toJSON(['status'=>'success','url'=>$url]);
        } else {
            $response->toJSON(['status'=>'error','message'=>'Upload fallido']);
        }
    }

    public function getByAlojamiento($idAloj) {
        $response = new Response();
        $model    = new ImageModel();
        $imgs     = $model->getImagesByAlojamientoId((int)$idAloj);
        $response->toJSON($imgs);
    }

    public function getFirst($idAloj) {
        $response = new Response();
        $model    = new ImageModel();
        $img      = $model->getFirstImage((int)$idAloj);
        $response->toJSON($img);
    }
}