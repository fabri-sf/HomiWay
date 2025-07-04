<?php
class Pedido {
    
    /* Listar todos los pedidos */
    public function index() {
        try {
            $pedido = new PedidoModel();
            $response = new Response();
            $response->toJSON($pedido->all());
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* Obtener un pedido por ID */
    public function get($id) {
        try {
            $pedido = new PedidoModel();
            $response = new Response();
            $response->toJSON($pedido->get($id));
        } catch (Exception $e) {
            handleException($e);
        }
    }
    
    /* Obtener factura completa con formato comercial */
    public function factura($id) {
        try {
            $pedido = new PedidoModel();
            $response = new Response();
            
            // Obtener datos básicos
            $factura = (array)$pedido->get($id);
            $cliente = (array)$pedido->getCliente($factura['ID_Usuario']);
            $metodoPago = (array)$pedido->getMetodoPago($id);
            
            // Obtener todos los detalles primero
            $detalles = $pedido->getDetalle($id);
            
            // Obtener productos personalizados usando el método específico
            $serviciosDetallados = $pedido->getProductosPersonalizados($id);
            
            // Separar productos y servicios correctamente
            $productos = [];
            $productosPersonalizados = [];
            
            // Procesar productos (alojamientos)
            if ($detalles && is_array($detalles)) {
                foreach ($detalles as $item) {
                    if ($item->TipoProducto === 'alojamiento') {
                        $productos[] = [
                            'nombre' => $item->NombreAlojamiento,
                            'descripcion' => '', // Añadir si hay descripción
                            'cantidad' => $item->Cantidad,
                            'precio_unitario' => $item->Cantidad > 0 ? $item->Subtotal / $item->Cantidad : 0,
                            'subtotal' => $item->Subtotal,
                            'impuesto' => $item->Impuesto
                        ];
                    }
                }
            }
            
            // Procesar servicios usando los datos detallados - VALIDAR QUE NO SEA NULL
            if ($serviciosDetallados && is_array($serviciosDetallados)) {
                foreach ($serviciosDetallados as $servicio) {
                    $productosPersonalizados[] = [
                        'Nombre' => $servicio->Nombre,
                        'Descripcion' => $servicio->Descripcion ?: 'Sin descripción',
                        'Total' => $servicio->Total,
                        'Duracion' => $servicio->Duracion ?: 'No especificada',
                        'Idiomas' => $servicio->Idiomas ?: 'No especificados',
                        'Tipo' => $servicio->Tipo ?: 'No especificado',
                        'Cantidad' => $servicio->Cantidad,
                        'PrecioUnitario' => $servicio->PrecioUnitario
                    ];
                }
            }
            
            // Calcular totales correctamente
            $subtotalProductos = array_sum(array_column($productos, 'subtotal'));
            $subtotalServicios = array_sum(array_column($productosPersonalizados, 'Total'));
            $subtotal = $subtotalProductos + $subtotalServicios;
            $impuestos = $subtotal * 0.13; // 13% de IVA
            $total = $subtotal + $impuestos;
            
            // Construir respuesta
            $facturaCompleta = [
                'encabezado' => [
                    'numero_pedido' => $factura['ID'],
                    'fecha_emision' => $factura['Fecha'],
                    'estado' => $factura['Estado']
                ],
                'cliente' => $cliente,
                'productos' => $productos,
                'productos_personalizados' => $productosPersonalizados,
                'resumen' => [
                    'subtotal' => $subtotal,
                    'impuestos' => $impuestos,
                    'total' => $total
                ],
                'metodo_pago' => [
                    'tipo' => $metodoPago['Estado'] ?? 'No especificado',
                    'banco' => $metodoPago['Banco'] ?? null,
                    'ultimos_digitos' => $metodoPago['Ultimos4_Digitos'] ?? null,
                    'MetodoPago' => $metodoPago['MetodoPago'] ?? 'No especificado'
                ]
            ];
            
            $response->toJSON($facturaCompleta);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}