<?php  
class reserva {
    
    /* =======================
       LISTAR TODAS LAS RESERVAS
    ======================= */
    public function index() {
        try {
            $response = new Response();
            $reserva = new ReservaModel();
            $result = $reserva->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* =======================
       OBTENER UNA RESERVA
    ======================= */
    public function get($idReserva) {
        try {
            $response = new Response();
            $reserva = new ReservaModel();
            $result = $reserva->get($idReserva);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* =======================
       OBTENER RESERVAS POR USUARIO
    ======================= */
    public function reservasPorUsuario($usuarioId) {
        try {
            $response = new Response();
            $reserva = new ReservaModel();
            $result = $reserva->getByUsuario($usuarioId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* =======================
       CREAR RESERVA DE ALOJAMIENTO
    ======================= */
    public function create() {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            
            if (!$data->ID_Alojamiento || !$data->ID_Usuario || !$data->Fecha_Inicio || !$data->Fecha_Fin) {
                throw new Exception("Campos incompletos");
            }
            
            $model = new ReservaModel();
            $result = $model->create($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* =======================
       CREAR RESERVA DE SERVICIO
    ======================= */
    public function createServicio() {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            
            if (!$data->ID_AlojamientoDetalle || !$data->ID_Servicio || !$data->Fecha_Inicio) {
                throw new Exception("Campos incompletos: ID_AlojamientoDetalle, ID_Servicio y Fecha_Inicio son requeridos");
            }
            
            $reserva = new ReservaModel();
            $result = $reserva->createReservaServicio($data);
            
            $response->toJSON([
                'success' => true,
                'mensaje' => 'Servicio agregado a la reserva correctamente',
                'idReservaServicio' => $result
            ]);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* =======================
       OBTENER SERVICIOS POR RESERVA
    ======================= */
    public function getServicios($idReserva) {
        try {
            $response = new Response();
            $reserva = new ReservaModel();
            $result = $reserva->getServiciosByReserva($idReserva);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* =======================
       ACTUALIZAR ESTADO RESERVA
    ======================= */
    public function updateEstado($idReserva) {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            
            if (!$data->Estado) {
                throw new Exception("Estado requerido");
            }
            
            $reserva = new ReservaModel();
            $reserva->updateEstado($idReserva, $data->Estado);
            
            $response->toJSON([
                'success' => true, 
                'mensaje' => 'Estado actualizado correctamente'
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* =======================
       CONFIRMAR RESERVA
    ======================= */
    public function confirmar($idReserva) {
        try {
            $response = new Response();
            $reserva = new ReservaModel();
            $reserva->updateEstado($idReserva, 'Confirmado');
            $response->toJSON([
                'success' => true, 
                'mensaje' => 'Reserva confirmada correctamente'
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* =======================
       CANCELAR RESERVA
    ======================= */
    public function cancelar($idReserva) {
        try {
            $response = new Response();
            $reserva = new ReservaModel();
            $reserva->updateEstado($idReserva, 'Cancelado');
            $response->toJSON([
                'success' => true, 
                'mensaje' => 'Reserva cancelada correctamente'
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* =======================
       MÉTODO DE PRUEBA PARA DEBUG
    ======================= */
    public function test() {
        try {
            $response = new Response();
            $response->toJSON([
                'success' => true,
                'mensaje' => 'Conexión exitosa con el controller de reservas',
                'timestamp' => date('Y-m-d H:i:s'),
                'method' => $_SERVER['REQUEST_METHOD'],
                'uri' => $_SERVER['REQUEST_URI']
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
