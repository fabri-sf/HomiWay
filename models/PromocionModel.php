<?php
class PromocionModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all()
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM Promocion;";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);

            // Retornar el objeto
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    /*Obtener */
    public function get($id)
    {
        try {
            //Consulta sql
            $vSql = "SELECT * FROM Promocion where id=$id";

            //Ejecutar la consulta
            $vResultado = $this->enlace->ExecuteSQL($vSql);
            // Retornar el objeto
            return $vResultado[0];
        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function obtenerAlojamientosConPromociones()
    {
        try {
            //Consulta SQL
              $vSQL = "SELECT a.ID as AlojamientoID,
                       a.Nombre as AlojamientoNombre,
                       a.Descripcion,
                       a.PrecioNoche,
                       a.Capacidad,
                       a.Categoria,
                       a.Estado as AlojamientoEstado,
                       p.ID as PromocionID,
                       p.Codigo,
                       p.Descripcion as PromocionDescripcion,
                       p.Tipo,
                       p.Valor,
                       p.Inicio,
                       p.Fin,
                       p.Requisitos,
                       e.Nombre as EtiquetaNombre,
                       e.Descripcion as EtiquetaDescripcion,
                       CASE 
                           WHEN p.Tipo = 'Porcentaje' THEN 
                               ROUND(a.PrecioNoche * (1 - p.Valor/100), 2)
                           WHEN p.Tipo = 'Monto' THEN 
                               ROUND(a.PrecioNoche - p.Valor, 2)
                           ELSE a.PrecioNoche
                       END as PrecioConDescuento,
                       CASE 
                           WHEN CURDATE() BETWEEN p.Inicio AND p.Fin THEN 'Vigente'
                           WHEN CURDATE() > p.Fin THEN 'Aplicado'
                           WHEN CURDATE() < p.Inicio THEN 'Pendiente'
                           ELSE 'Sin promoción'
                       END AS EstadoPromocion
                FROM Alojamiento a
                INNER JOIN Etiqueta e ON a.ID = e.ID_Alojamiento
                INNER JOIN Promocion p ON e.ID_Promocion = p.ID
                WHERE a.Estado = 1
                ORDER BY a.ID;";

            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSQL);

            //Retornar el resultado
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function calcularPrecioConDescuento($precioOriginal, $promocionID)
    {
        try {
            //Consulta SQL para obtener datos de la promoción
            $vSQL = "SELECT Tipo, Valor 
                    FROM Promocion 
                    WHERE ID = $promocionID 
                    AND CURDATE() BETWEEN Inicio AND Fin;";

            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSQL);

            if (count($vResultado) > 0) {
                $promocion = $vResultado[0];

                if ($promocion['Tipo'] == 'Porcentaje') {
                  return round ($precioOriginal - ( ($promocion['Valor']/100) * $precioOriginal));
                } elseif ($promocion['Tipo'] == 'Monto') {
                    return round($precioOriginal - $promocion['Valor'], 2);
                }
            }

            //Si no hay promoción válida, retornar precio original
            return $precioOriginal;

        } catch (Exception $e) {
            handleException($e);
            return $precioOriginal;
        }
    }

    public function obtenerPromocionesPorCategoria($categoria)
    {
        try {
            //Consulta SQL
            $vSQL = "SELECT DISTINCT p.*, a.Categoria,
                           CASE 
                               WHEN CURDATE() BETWEEN p.Inicio AND p.Fin THEN 'Vigente'
                               WHEN CURDATE() > p.Fin THEN 'Aplicado'
                               WHEN CURDATE() < p.Inicio THEN 'Pendiente'
                               ELSE 'Sin definir'
                           END AS EstadoCalculado
                    FROM Promocion p
                    INNER JOIN Etiqueta e ON p.ID = e.ID_Promocion
                    INNER JOIN Alojamiento a ON e.ID_Alojamiento = a.ID
                    WHERE a.Categoria = '$categoria' 
                    AND a.Estado = 1
                    ORDER BY p.Inicio DESC;";

            //Ejecutar la consulta
            $vResultado = $this->enlace->executeSQL($vSQL);

            //Retornar el resultado
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

public function create($objeto)
{
    try {
        // Insertar la promoción
        $vSql = "INSERT INTO Promocion (Codigo, Descripcion, Tipo, Valor, Inicio, Fin, Requisitos) 
                 VALUES ('$objeto->Codigo', '$objeto->Descripcion', '$objeto->Tipo', $objeto->Valor, 
                         '$objeto->Inicio', '$objeto->Fin', '$objeto->Requisitos')";

        // Ejecutar la consulta y obtener el ID insertado
        $vResultado = $this->enlace->executeSQL_DML_last($vSql);

        // Retornar la promoción recién creada
        return $this->get($vResultado);
    } catch (Exception $e) {
        handleException($e);
    }
}

public function eliminarAsociaciones($promocionID)
{
    try {
        $vSql = "DELETE FROM Etiqueta WHERE ID_Promocion = $promocionID";
        $this->enlace->executeSQL_DML($vSql);
        return true;
    } catch (Exception $e) {
        handleException($e);
        return false;
    }
}


public function update($objeto)
{
    try {
        // Actualizar la promoción
        $vSql = "UPDATE Promocion 
                 SET Codigo = '$objeto->Codigo',
                     Descripcion = '$objeto->Descripcion',
                     Tipo = '$objeto->Tipo',
                     Valor = $objeto->Valor,
                     Inicio = '$objeto->Inicio',
                     Fin = '$objeto->Fin',
                     Requisitos = '$objeto->Requisitos'
                 WHERE ID = $objeto->ID";

        // Ejecutar la consulta
        $this->enlace->executeSQL_DML($vSql);

        // Si se está cambiando el tipo de aplicación, eliminar asociaciones anteriores
        if (isset($objeto->EliminarAsociaciones) && $objeto->EliminarAsociaciones === true) {
            $this->eliminarAsociaciones($objeto->ID);
        }

        // Retornar la promoción actualizada
        return $this->get($objeto->ID);
    } catch (Exception $e) {
        handleException($e);
    }
}






}

