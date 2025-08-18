<?php
require_once 'vendor/autoload.php';
use Firebase\JWT\JWT;

class JwtHelper {
    private static $secret = 'e0d17975bc9bd57eee132eecb6da6f11048e8a88506cc3bffc7249078cf2a77a';

    public static function getTokenFromHeaders() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            return $matches[1];
        }
        
        throw new Exception('Token no proporcionado');
    }

    public static function validateToken($token) {
        try {
            return JWT::decode($token, self::$secret, ['HS256']);
        } catch (Exception $e) {
            throw new Exception('Token inválido: ' . $e->getMessage());
        }
    }
}