<?php
//class Genre
class imagen{
    //POST Crear
    public function create()
    {
        try {
            /* $file=null;
            if (isset($_FILES['file'])){
                $file = $_FILES['file'];
            } */
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputFILE = $request->getBody();
            //Instancia del modelo
            $movie = new ImageModel();
            //Acción del modelo a ejecutar
            $result = $movie->uploadFile($inputFILE);
           
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
      public function getByAlojamiento($idAlojamiento)
    {
        try {
            $response = new Response();
            $imagenM = new ImageModel();
            $result = $imagenM->getImageAlojamiento($idAlojamiento);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}