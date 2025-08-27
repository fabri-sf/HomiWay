<?php
class Servicio
{

    public function index()
    {
        try {
            $response = new Response();
            $model = new ServicioModel();
            $data = $model->all();
            $response->toJSON($data);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        return $this->getById($id);
    }
    public function getByAlojamiento($idAlojamiento)
    {
        try {
            $response = new Response();
            $servicioM = new ServicioModel();
            $result = $servicioM->getByAlojamiento($idAlojamiento);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function create()
    {
        // DEBUG: graba todo lo que llega
        $rawInput = file_get_contents('php://input');
        error_log("----- Servicio::create() DEBUG -----");
        error_log("RAW php://input:\n" . $rawInput);
        error_log("_POST:\n" . print_r($_POST, true));
        error_log("_FILES:\n" . print_r($_FILES, true));
        error_log("-----------------------------------");

        try {
            $jsonBody = json_decode($rawInput);
            if (
                (is_object($jsonBody) && isset($jsonBody->ID)) ||
                isset($_POST['ID'])
            ) {
                $id = isset($jsonBody->ID)
                    ? (int) $jsonBody->ID
                    : (int) $_POST['ID'];
                return $this->update($id);
            }

            $data = json_decode($rawInput);
            if (!$data) {
                $data = new stdClass();
                $data->Nombre = $_POST['Nombre'] ?? null;
                $data->Tipo = $_POST['Tipo'] ?? null;
                $data->Precio = $_POST['Precio'] ?? null;
                $data->Descripcion = $_POST['Descripcion'] ?? null;
            }

            if (
                !$data->Nombre ||
                !$data->Tipo ||
                !$data->Precio ||
                !$data->Descripcion
            ) {
                return (new Response())->toJSON([
                    'status' => 'error',
                    'message' => 'Datos incompletos'
                ]);
            }

            $model = new ServicioModel();
            $created = $model->create($data);
            return (new Response())->toJSON($created);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function getById($id)
    {
        try {
            $response = new Response();
            $model = new ServicioModel();
            $data = $model->find((int) $id);
            $response->toJSON($data);
        } catch (Exception $e) {
            handleException($e);
        }
    }
    public function update($id)
    {
        try {
            $response = new Response();

            $rawInput = file_get_contents('php://input');
            $jsonBody = json_decode($rawInput);

            $data = new stdClass();
            $data->Nombre = $jsonBody->Nombre ?? null;
            $data->Tipo = $jsonBody->Tipo ?? null;
            $data->Precio = $jsonBody->Precio ?? null;
            $data->Descripcion = $jsonBody->Descripcion ?? null;
            if (empty($jsonBody)) {
                $data->Nombre = $_POST['Nombre'] ?? $data->Nombre;
                $data->Tipo = $_POST['Tipo'] ?? $data->Tipo;
                $data->Precio = $_POST['Precio'] ?? $data->Precio;
                $data->Descripcion = $_POST['Descripcion'] ?? $data->Descripcion;
            }
            if (
                isset($_FILES['Imagen']) &&
                $_FILES['Imagen']['error'] === UPLOAD_ERR_OK
            ) {
                $uploadDir = __DIR__ . '/../../uploads/servicios/';
                if (!is_dir($uploadDir))
                    mkdir($uploadDir, 0755, true);

                $origName = basename($_FILES['Imagen']['name']);
                $uniqName = uniqid('svc_') . '_' . preg_replace('/\s+/', '_', $origName);
                $target = $uploadDir . $uniqName;

                if (move_uploaded_file($_FILES['Imagen']['tmp_name'], $target)) {
                    $data->Imagen = '/uploads/servicios/' . $uniqName;
                }
            }

            $model = new ServicioModel();
            $updated = $model->update((int) $id, $data);

            $response->toJSON($updated);

        } catch (Exception $e) {
            handleException($e);
        }
    }


    public function delete($id)
    {
        $model = new ServicioModel();
        $model->delete((int) $id);
        (new Response())->toJSON(['success' => true]);
    }
}
