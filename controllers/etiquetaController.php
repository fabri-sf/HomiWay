<?php

class etiqueta
{


    // Obtener alojamientos que tienen una promoción específica

    // Crear una etiqueta (asignar una promoción a un alojamiento)
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            $json = $request->getJSON();

            $model = new EtiquetaModel();
            $data = $model->create($json);
            $response->toJSON($data);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Aplicar una promoción a una categoría completa de alojamientos
    public function createByCategoria()
    {
        try {
            $request = new Request();
            $response = new Response();
            $json = $request->getJSON(); // Debe traer: { categoria: "Casa", ID_Promocion: 5 }

            $categoria = $json->categoria;
            $idPromocion = $json->ID_Promocion;

            $model = new EtiquetaModel();
            $data = $model->createByCategoria($categoria, $idPromocion);
            $response->toJSON($data);
        } catch (Exception $e) {
            handleException($e);
        }
    }

 
}
