<?php
//class rESEÑA
class Resena {
    public function getByAlojamiento($id) {
        $response = new Response();
        $model = new ResenaModel();
        $data = $model->getByAlojamiento($id);
        $response->toJSON($data);
    }

    public function create() {
        $response = new Response();
        $request = new Request();
        $data = $request->getJSON();

        $model = new ResenaModel();
        $result = $model->create($data);
        $response->toJSON($result);
    }

    public function update($idResena) {
        $response = new Response();
        $request = new Request();
        $data = $request->getJSON();

        $model = new ResenaModel();
        $result = $model->update($data, $idResena);
        $response->toJSON($result);
    }

 public function delete($idResena)
    {
        $response = new Response();
        $model    = new ResenaModel();
        $result   = $model->deleteLogico($idResena);
        $response->toJSON($result);
    }

    public function index() {
    $response = new Response();
    $model = new ResenaModel();
    $data = $model->getAll();
    $response->toJSON($data);
}
}


