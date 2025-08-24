<?php
require_once "vendor/autoload.php";
use Firebase\JWT\JWT;
class Usuario
{
  public function index()
  {
    $response = new Response();
    $usuario = new UsuarioModel();
    $result = $usuario->all();
    $response->toJSON($result);
  }

  public function get($id)
  {
    $response = new Response();
    $usuario = new UsuarioModel();
    $result = $usuario->get($id);
    $response->toJSON($result);
  }
  public function login()
  {
    $input = json_decode(file_get_contents('php://input'));
    $correo = $input->Correo ?? '';
    $contrasena = $input->Contrasena ?? '';

    if ($correo === '' || $contrasena === '') {
      http_response_code(400);
      echo json_encode([
        'status' => 'error',
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
        'status' => 'error',
        'message' => 'Usuario no valido'
      ]);
    }
  }


  public function create()
  {
    $data = json_decode(file_get_contents('php://input'));

    // si viene ID → update de rol/estado
    if (!empty($data->ID)) {
      $updated = (new UsuarioModel())->update($data->ID, $data);
      (new Response())->toJSON($updated);
      return;
    }

    // si no viene ID → insert
    $created = (new UsuarioModel())->create($data);
    (new Response())->toJSON($created);
  }
  // en src/controllers/Usuario.php

  public function update($id)
  {
    $input = json_decode(file_get_contents('php://input'));
    $model = new UsuarioModel();
    $updated = $model->update($id, $input);
    (new Response())->toJSON($updated);
  }
public function changePassword($id)
{
    $input = json_decode(file_get_contents('php://input'));
    $newPassword = $input->newPassword ?? '';

    $model = new UsuarioModel();
    $user  = $model->get($id);

    if (!$user) {
        http_response_code(404);
        echo json_encode([
            'status'  => 'error',
            'message' => 'Usuario no encontrado'
        ]);
        return;
    }

    $updated = $model->updatePassword($id, $newPassword);
    (new Response())->toJSON($updated);
}
}