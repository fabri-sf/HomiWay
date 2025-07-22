<?php
class ImageModel {
    private $upload_path       = 'uploads/';
    private $valid_extensions  = ['jpeg','jpg','png','gif'];
    public  $enlace;

    public function __construct() {
        $this->enlace = new MySqlConnect();
    }

    public function uploadFile($file, $alojamiento_id) {
        $name = $file['name'];
        $tmp  = $file['tmp_name'];
        $size = $file['size'];
        $err  = $file['error'];

        if (empty($name)) return false;
        $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
        if (!in_array($ext, $this->valid_extensions)) return false;
        if ($size > 2000000 || $err !== 0) return false;

        $newName = 'homi-' . uniqid() . '.' . $ext;
        if (!move_uploaded_file($tmp, $this->upload_path . $newName)) return false;

        $sql = "
          INSERT INTO imagen_alojamiento
            (ID_Alojamiento, URL)
          VALUES
            ($alojamiento_id, '$newName')
        ";
        $this->enlace->executeSQL_DML($sql);
        return $newName;
    }

    public function getImagesByAlojamientoId($idAloj) {
        $sql = "
          SELECT URL AS url
          FROM imagen_alojamiento
          WHERE ID_Alojamiento = $idAloj
        ";
        return $this->enlace->ExecuteSQL($sql);
    }

    public function getFirstImage($idAloj) {
        $sql = "
          SELECT URL AS url
          FROM imagen_alojamiento
          WHERE ID_Alojamiento = $idAloj
          LIMIT 1
        ";
        $res = $this->enlace->ExecuteSQL($sql);
        return !empty($res) ? $res[0] : null;
    }
}