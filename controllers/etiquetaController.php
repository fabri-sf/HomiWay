<?php
class etiquetaController extends Controller
{  public function getByAlojamiento($idAlojamiento)
    {
        try {
            $response = new Response();
            $etiquetaM = new EtiquetaModel();
            $result = $etiquetaM->getByAlojamiento($idAlojamiento);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}