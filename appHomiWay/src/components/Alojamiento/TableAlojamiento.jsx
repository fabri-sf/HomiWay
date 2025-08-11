import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Tooltip,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AlojamientoService from '../../services/AlojamientoService';

export default function TableAlojamientos() {
  const { t } = useTranslation();
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
      .catch((err) => {
        if (err instanceof SyntaxError) {
          setError(err);
          setLoaded(false);
          throw new Error('Respuesta no válida del servidor');
        }
      });
  }, []);

  const update = (id) => {
    navigate(`/alojamiento/update/${id}`);
  };

  if (!loaded) {
    return <p>{t('alojamientos.table.loading')}</p>;
  }

  if (error) {
    return (
      <p>
        {t('alojamientos.table.errorPrefix')} {error.message}
      </p>
    );
  }

  return (
    <>
      <Typography variant="h5" gutterBottom>
        {t('alojamientos.table.title')}
        <Tooltip title={t('alojamientos.table.buttons.create')}>
          <IconButton
            component={Link}
            to="/alojamiento/crear"
            color="success"
            sx={{ ml: 1 }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Typography>

      {data.length > 0 && (
        <TableContainer component={Paper}>
          <Table aria-label="tabla alojamientos">
            <TableHead>
              <TableRow>
                <TableCell>
                  {t('alojamientos.table.columns.title')}
                </TableCell>
                <TableCell>
                  {t('alojamientos.table.columns.location')}
                </TableCell>
                <TableCell>
                  {t('alojamientos.table.columns.capacity')}
                </TableCell>
                <TableCell align="right">
                  {t('alojamientos.table.columns.actions')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.nombre}</TableCell>
                  <TableCell>{row.ubicacion}</TableCell>
                  <TableCell>{row.capacidad}</TableCell>
                  <TableCell align="right">
                    <Tooltip title={t('alojamientos.table.buttons.update')}>
                      <IconButton
                        onClick={() => update(row.id)}
                        color="success"
                      >
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