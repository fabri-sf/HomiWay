<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Agregar todos los modelos*/
require_once "models/RolModel.php";
require_once "models/UsuarioModel.php";
require_once "models/DirectorModel.php";
require_once "models/ActorModel.php";
require_once "models/GenreModel.php";
require_once "models/ShopRentalModel.php";
require_once "models/RentalModel.php";
require_once "models/RentalMovieModel.php";

require_once "models/ImageModel.php";
require_once "models/AlojamientoModel.php";
require_once "models/PromocionModel.php";
require_once "models/UbicacionModel.php";
require_once "models/ServicioModel.php";
require_once "models/ResenaModel.php";
require_once "models/PedidoModel.php";
/***--- Agregar todos los controladores*/


//require_once "controllers/UserController.php";
require_once "controllers/DirectorController.php";
require_once "controllers/ActorController.php";
require_once "controllers/GenreController.php";
require_once "controllers/ShopRentalController.php";
require_once "controllers/InventoryController.php";
require_once "controllers/RentalController.php";

require_once "controllers/RolController.php";
require_once "controllers/AlojamientoController.php";
require_once "controllers/PromocionController.php";
require_once "controllers/UbicacionController.php";
require_once "controllers/UbicacionController.php";
require_once "controllers/servicioController.php";
require_once "controllers/ResenaController.php";
require_once "controllers/PedidoController.php";
//require_once "controllers/ImageController.php"; arreglar el porque no funciona al activarlo

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();


