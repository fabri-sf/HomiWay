<?php
require_once "vendor/autoload.php";
use Firebase\JWT\JWT;
class Usuario {
  public function index() {
    $response = new Response();
    $usuario = new UsuarioModel();
    $result = $usuario->all();
    $response->toJSON($result);
  }

  public function get($id) {
    $response = new Response();
    $usuario = new UsuarioModel();
    $result = $usuario->get($id);
    $response->toJSON($result);
  }    
  public function login()
    {
        $input = json_decode(file_get_contents('php://input'));
        $correo    = $input->Correo    ?? '';
        $contrasena = $input->Contrasena ?? '';

        if ($correo === '' || $contrasena === '') {
            http_response_code(400);
            echo json_encode([
                'status'  => 'error',
                'message' => 'Faltan Correo o Contrasena'
            ]);
            return;
        }

        $model = new UsuarioModel();
        $token = $model->login($correo, $contrasena);

        if ($token) {
            echo json_encode($token);
        } else {
            http_response_code(401);
            echo json_encode([
                'status'  => 'error',
                'message' => 'Usuario no valido'
            ]);
        }
    }


  public function create() {
    $response = new Response();
    $request = new Request();
    $data = $request->getJSON();

    $usuario = new UsuarioModel();
    $result = $usuario->create($data);
    $response->toJSON($result);
  }
}