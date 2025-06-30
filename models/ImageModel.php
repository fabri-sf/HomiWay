<?php
class ImageModel
{
    private $upload_path = 'uploads/';
    private $valid_extensions = array('jpeg', 'jpg', 'png', 'gif');

    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    // Subir imagen de un alojamiento registrado
    public function uploadFile($object)
    {
        try {
            $file = $object['file'];
            $alojamiento_id = $object['alojamiento_id'];

            $fileName = $file['name'];
            $tempPath = $file['tmp_name'];
            $fileSize = $file['size'];
            $fileError = $file['error'];

            if (!empty($fileName)) {
                $fileExt = explode('.', $fileName);
                $fileActExt = strtolower(end($fileExt));
                $fileName = "homi-" . uniqid() . "." . $fileActExt;

                if (in_array($fileActExt, $this->valid_extensions)) {
                    if (!file_exists($this->upload_path . $fileName)) {
                        if ($fileSize < 2000000 && $fileError == 0) {
                            if (move_uploaded_file($tempPath, $this->upload_path . $fileName)) {
                                $sql = "INSERT INTO imagen_alojamiento (ID_Alojamiento, URL)
                                        VALUES ($alojamiento_id, '$fileName')";
                                $vResultado = $this->enlace->executeSQL_DML($sql);
                                if ($vResultado > 0) {
                                    return 'Imagen creada';
                                }
                                return false;
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener TODAS las imágenes de un alojamiento
    public function getImagesByAlojamientoId($idAlojamiento)
    {
        try {
            $vSQL = "SELECT URL AS url FROM imagen_alojamiento WHERE ID_Alojamiento = $idAlojamiento";
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            return $vResultado;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // Obtener solo la primera imagen (opcional)
    public function getFirstImage($idAlojamiento)
    {
        try {
            $vSQL = "SELECT * FROM imagen_alojamiento 
                     WHERE ID_Alojamiento = $idAlojamiento 
                     LIMIT 1";
            $vResultado = $this->enlace->ExecuteSQL($vSQL);
            return !empty($vResultado) ? $vResultado[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
