<?php
//class Genre
class imagen{
    //POST Crear
  public function create()
{
    try {
        $file = $_FILES;
        $alojamiento_id = $_POST['alojamiento_id'];

        $imageModel = new ImageModel();
        $result = $imageModel->uploadFile([
            'file' => $file['file'],
            'alojamiento_id' => $alojamiento_id
        ]);

        $response = new Response();
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
            $result = $imagenM->getImagesByAlojamientoId($idAlojamiento);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}