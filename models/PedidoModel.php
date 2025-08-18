  <?php
class PedidoModel {
    public $enlace;
    
    public function __construct() {
        $this->enlace = new MySqlConnect();
    }
    
    /* Listar todos los pedidos */
    public function all() {
        try {
            $vSql = "SELECT * FROM Factura ORDER BY Fecha DESC;";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* Obtener un pedido por ID */
    public function get($id) {
        try {
            $vSql = "SELECT * FROM Factura WHERE ID = $id";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result[0] ?? null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* Obtener detalles básicos de un pedido */
    public function getDetalle($facturaId) {
        try {
            $vSql = "
                SELECT 
                    fd.*,
                    a.Nombre as NombreAlojamiento,
                    s.Nombre as NombreServicio,
                    CASE 
                        WHEN fd.ID_Alojamiento IS NOT NULL THEN 'alojamiento'
                        WHEN fd.ID_Servicio IS NOT NULL THEN 'servicio'
                        ELSE 'desconocido'
                    END as TipoProducto
                FROM Factura_Detalle fd
                LEFT JOIN Alojamiento a ON fd.ID_Alojamiento = a.ID
                LEFT JOIN Servicio s ON fd.ID_Servicio = s.ID
                WHERE fd.ID_Factura = $facturaId
            ";
            return $this->enlace->ExecuteSQL($vSql);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* Obtener productos personalizados (servicios) de un pedido - MÉTODO CORREGIDO */
    public function getProductosPersonalizados($facturaId) {
        try {
            $vSql = "
                SELECT 
                    fd.ID,
                    s.ID as ID_Servicio,
                    s.Nombre,
                    s.Descripcion,
                    s.Tipo,
                    s.Precio as PrecioUnitario,
                    fd.Cantidad,
                    fd.Subtotal,
                    fd.Impuesto,
                    fd.Total,
                    COALESCE(sd.Duracion, 'No especificada') as Duracion,
                    COALESCE(sd.Idiomas, 'No especificados') as Idiomas
                FROM Factura_Detalle fd
                JOIN Servicio s ON fd.ID_Servicio = s.ID
                LEFT JOIN Servicio_Detalle sd ON s.ID = sd.ID_Servicio
                WHERE fd.ID_Factura = $facturaId
                    AND fd.ID_Servicio IS NOT NULL
            ";
            $result = $this->enlace->ExecuteSQL($vSql);
            
            return $result ?: [];
        } catch (Exception $e) {
            handleException($e);
            return []; 
        }
    }
    
    /* Obtener información del cliente */
    public function getCliente($usuarioId) {
        try {
            $vSql = "SELECT ID, CONCAT(Nombre, ' ', Apellido) as nombre_completo,
                     Correo as correo, Telefono as telefono
                     FROM Usuario WHERE ID = $usuarioId";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result[0] ?? null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* Obtener método de pago */
    public function getMetodoPago($facturaId) {
        try {
            $vSql = "SELECT Estado, Banco, Ultimos4_Digitos,MetodoPago FROM Pagos WHERE Factura_ID = $facturaId";
            $result = $this->enlace->ExecuteSQL($vSql);
            return $result[0] ?? null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}