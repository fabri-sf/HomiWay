<?php


class UsuarioModel {
  private $enlace;

  public function __construct() {
    $this->enlace = new MySqlConnect();
  }

  public function all() {
    return $this->enlace->ExecuteSQL("SELECT * FROM usuario;");
  }

  public function get($id) {
    $rolM = new RolModel();
    $sql = "SELECT * FROM usuario WHERE ID = $id;";
    $result = $this->enlace->ExecuteSQL($sql);

    if ($result) {
      $user = $result[0];
      $user->rol = $rolM->getRolUser($id);
      return $user;
    }
    return null;
  }

  public function login($objeto) {
    $sql = "SELECT * FROM usuario WHERE Correo = '$objeto->Correo';";
    $result = $this->enlace->ExecuteSQL($sql);

    if (is_object($result[0])) {
      $user = $result[0];
      if ($user->Estado == 1 && $user->Contrasena == $objeto->Contrasena) {
        $usuario = $this->get($user->ID);
        if (!empty($usuario)) {
          $data = [
            'id' => $usuario->ID,
            'correo' => $usuario->Correo,
            'rol' => $usuario->rol,
            'iat' => time(),
            'exp' => time() + 3600
          ];
          return JWT::encode($data, config::get('SECRET_KEY'), 'HS256');
        }
      }
    }
    return false;
  }

  public function create($objeto) {
    $sql = "INSERT INTO usuario 
      (ID_Rol, Username, Contrasena, Estado, Nombre, Apellido, Correo) 
      VALUES (
        $objeto->ID_Rol,
        '$objeto->Username',
        '$objeto->Contrasena',
        1,
        '$objeto->Nombre',
        '$objeto->Apellido',
        '$objeto->Correo'
      );";

    $newID = $this->enlace->executeSQL_DML_last($sql);
    return $this->get($newID);
  }
}