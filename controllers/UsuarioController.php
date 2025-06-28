<?php
//Cargar todos los paquetes
require_once "vendor/autoload.php";

use Firebase\JWT\JWT;

class usuario
{

    private $secret_key = 'e0d17975bc9bd57eee132eecb6da6f11048e8a88506cc3bffc7249078cf2a77a';
    //Listar en el API
    public function index()
    {
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario = new UsuarioModel();
        $result = $usuario->all();
        //Dar respuesta
        $response->toJSON($result);
    }
    public function get($param)
    {
        $response = new Response();
        $usuario = new UsuarioModel();
        $result = $usuario->get($param);
        //Dar respuesta
        $response->toJSON($result);
    }
    public function allCustomer()
    {
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario = new UsuarioModel();
        $result = $usuario->allCustomer();
        //Dar respuesta
        $response->toJSON($result);
    }
    public function customerbyShopRental($idShopRental)
    {
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario = new UsuarioModel();
        $result = $usuario->customerbyShopRental($idShopRental);
        //Dar respuesta
        $response->toJSON($result);
    }
    public function login()
    {
        $response = new Response();
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON();
        $usuario = new UsuarioModel();
        $result = $usuario->login($inputJSON);
        if (isset($result) && !empty($result) && $result != false) {
            $response->toJSON($result);
        } else {
            $response->toJSON($response, "Usuario no valido");
        }
    }
    public function create()
    {
        $response = new Response();
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON();
        $usuario = new UsuarioModel();
        $result = $usuario->create($inputJSON);
        //Dar respuesta
        $response->toJSON($result);
    }
}
