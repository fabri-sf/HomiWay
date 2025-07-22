<?php
class Rol {
    public function index() {
        try {
            $response = new Response();
            $rolModel = new RolModel();
            $result = $rolModel->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id) {
        try {
            $response = new Response();
            $rolModel = new RolModel();
            $result = $rolModel->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getRolUser($idUsuario) {
        try {
            $response = new Response();
            $rolModel = new RolModel();
            $result = $rolModel->getRolUser($idUsuario);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}