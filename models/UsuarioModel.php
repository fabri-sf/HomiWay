<?php

require_once dirname(__DIR__) . '/vendor/autoload.php';

use Firebase\JWT\JWT;

class UsuarioModel
{
    private $enlace;
    private $secret = 'e0d17975bc9bd57eee132eecb6da6f11048e8a88506cc3bffc7249078cf2a77a'; // Replace with your actual secret key

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        return $this->enlace->ExecuteSQL("SELECT * FROM usuario;");
    }

    public function get($id)
    {
        $rolM = new RolModel();
        $sql = "SELECT * FROM usuario WHERE ID = $id;";
        $res = $this->enlace->ExecuteSQL($sql) ?: [];
        if (empty($res)) {
            return null;
        }
        $user = $res[0];
        $user->rol = $rolM->getRolUser($id);
        return $user;
    }
    public function login(string $correo, string $contrasena)
    {
        $email = addslashes($correo);

        $sql = "
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
            'id' => $user->ID,
            'correo' => $user->Correo,
            'rol' => $user->rol,
            'iat' => time(),
            'exp' => time() + 3600
        ];

        return JWT::encode($payload, $this->secret, 'HS256');
    }
    public function create($objeto)
    {
        // Si no mandan Username, lo tomamos del Correo
        $username = isset($objeto->Username)
            ? addslashes($objeto->Username)
            : addslashes($objeto->Correo);

        $sql = "INSERT INTO usuario 
        (ID_Rol, Username, Contrasena, Estado, Nombre, Apellido, Correo)
     VALUES (
        " . intval($objeto->ID_Rol) . ",
        '$username',
        '" . addslashes($objeto->Contrasena) . "',
        1,
        '" . addslashes($objeto->Nombre) . "',
        '" . addslashes($objeto->Apellido) . "',
        '" . addslashes($objeto->Correo) . "'
     );";

        error_log("[UsuarioModel::create] SQL → $sql");
        $newID = $this->enlace->executeSQL_DML_last($sql);
        return $this->get($newID);
    }
    public function update(int $id, $data)
    {
        $fields = [];
        if (isset($data->ID_Rol)) {
            $fields[] = "ID_Rol = " . intval($data->ID_Rol);
        }
        if (isset($data->Estado)) {
            $fields[] = "Estado = " . intval($data->Estado);
        }
        if (empty($fields)) {
            return $this->get($id);
        }

        $sql = "UPDATE usuario SET " . implode(', ', $fields) . " WHERE ID = " . intval($id) . ";";
        $this->enlace->executeSQL_DML($sql);

        return $this->get($id);
    }

 public function updatePassword(int $id, string $newPassword)
{
    $pass = addslashes($newPassword);
    $sql  = "UPDATE usuario SET Contrasena = '$pass' WHERE ID = $id;";
    $this->enlace->executeSQL_DML($sql);
    return $this->get($id);
}
}