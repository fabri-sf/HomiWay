<?php

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

  public function login() {
    $response = new Response();
    $request = new Request();
    $data = $request->getJSON();

    $usuario = new UsuarioModel();
    $token = $usuario->login($data);

    if ($token) {
      $response->toJSON($token);
    } else {
      $response->toJSON($response, "Usuario no valido");
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