<?php  
class Factura {
    
    /* =======================
       LISTAR TODAS LAS FACTURAS
    ======================= */
    public function index() {
        try {
            $response = new Response();
            $factura = new FacturaModel();
            $result = $factura->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* =======================
       OBTENER UNA FACTURA
    ======================= */
    public function get($idFactura) {
        try {
            $response = new Response();
            $factura = new FacturaModel();
            $result = $factura->get($idFactura);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* =======================
       OBTENER FACTURAS POR USUARIO
    ======================= */
    public function facturasPorUsuario($usuarioId) {
        try {
            $response = new Response();
            $factura = new FacturaModel();
            $result = $factura->getByUsuario($usuarioId);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* =======================
       OBTENER RESERVAS FACTURABLES
    ======================= */
   public function reservasFacturables($usuarioId) {
    try {
        $response = new Response();
        $factura = new FacturaModel();
        $result = $factura->getReservasFacturables($usuarioId);
        $response->toJSON($result);
    } catch (Exception $e) {
        handleException($e);
    }
}

    /* =======================
       CREAR FACTURA
    ======================= */
    public function create() {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            
            if (!$data->ID_Usuario || !$data->Total || !isset($data->Detalles)) {
                throw new Exception("Datos incompletos para crear la factura");
            }
            
            $model = new FacturaModel();
            $result = $model->create($data);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* =======================
       REGISTRAR PAGO
    ======================= */
    public function registrarPago() {
        try {
            $response = new Response();
            $request = new Request();
            $data = $request->getJSON();
            
            if (!$data->ID_Factura || !$data->Monto || !$data->MetodoPago) {
                throw new Exception("Datos incompletos para registrar el pago");
            }
            
            $factura = new FacturaModel();
            $result = $factura->registrarPago($data);
            
            $response->toJSON([
                'success' => true,
                'mensaje' => 'Pago registrado correctamente',
                'idPago' => $result
            ]);
            
        } catch (Exception $e) {
            handleException($e);
        }
    }

    /* =======================
       OBTENER DETALLES DE FACTURA
    ======================= */
    public function getDetalles($idFactura) {
        try {
            $response = new Response();
            $factura = new FacturaModel();
            $result = $factura->getDetalles($idFactura);
            $response->toJSON($result);
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
                'mensaje' => 'Conexión exitosa con el controller de facturas',
                'timestamp' => date('Y-m-d H:i:s'),
                'method' => $_SERVER['REQUEST_METHOD'],
                'uri' => $_SERVER['REQUEST_URI']
            ]);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}