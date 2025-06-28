import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Typography, Tooltip, IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import AlojamientoService from '../../services/AlojamientoService';

export default function TableAlojamientos() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AlojamientoService.getAlojamientos()
      .then((response) => {
        setData(response.data);
        setError(response.error);
        setLoaded(true);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          setError(error);
          setLoaded(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);

  const update = (id) => {
    navigate(`/alojamiento/update/${id}`);
  };

  if (!loaded) return <p>Cargando...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Listado de Alojamientos
        <Tooltip title="Crear">
          <IconButton component={Link} to="/alojamiento/crear" color="success">
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      {data.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="tabla alojamientos">
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Ubicación</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.ubicacion}</TableCell>
                  <TableCell>{row.capacidad}</TableCell>
                  <TableCell align="right">
                    <Tooltip title="Actualizar">
                      <IconButton onClick={() => update(row.id)} color="success">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
