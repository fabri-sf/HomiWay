<?php

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Firebase\JWT\JWT;

class UsuarioModel {
    private $enlace;
    private $secret = 'e0d17975bc9bd57eee132eecb6da6f11048e8a88506cc3bffc7249078cf2a77a'; // Replace with your actual secret key

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function all() {
        return $this->enlace->ExecuteSQL("SELECT * FROM usuario;");
    }

    public function get($id) {
        $rolM = new RolModel();
        $sql  = "SELECT * FROM usuario WHERE ID = $id;";
        $res  = $this->enlace->ExecuteSQL($sql) ?: [];
        if (empty($res)) {
            return null;
        }
        $user      = $res[0];
        $user->rol = $rolM->getRolUser($id);
        return $user;
    }   
     public function login(string $correo, string $contrasena)
    {
        $email = addslashes($correo);

        $sql  = "
            SELECT ID, ID_Rol AS rol, Correo, Contrasena, Estado
            FROM usuario
            WHERE Correo = '$email'
        ";
        
        $rows = $this->enlace->ExecuteSQL($sql) ?: [];
        if (empty($rows)) {
            return false;
        }

        $user = $rows[0];
        if ($user->Estado != 1 || $user->Contrasena !== $contrasena) {
            return false;
        }

        $payload = [
            'id'     => $user->ID,
            'correo' => $user->Correo,
            'rol'    => $user->rol,
            'iat'    => time(),
            'exp'    => time() + 3600
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
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