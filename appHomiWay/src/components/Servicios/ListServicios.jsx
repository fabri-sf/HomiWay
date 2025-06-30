import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ServicioService from '../../services/ServiciosService';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

export function ListServicios({ alojamientoId }) {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    ServicioService.getByAlojamiento(alojamientoId)
      .then((res) => {
        setServicios(res.data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener los servicios');
        setLoaded(false);
      });
  }, [alojamientoId]);

 if (!loaded) return null;

if (error || servicios.length === 0) {
  return <p><em>Este alojamiento no tiene servicios registrados.</em></p>;
}
  return (
    <div style={{ marginTop: '1rem' }}>
      <Typography variant="h6" gutterBottom>Servicios incluidos</Typography>
      <List dense>
        {servicios.map((s, i) => (
          <ListItem key={i}>
            <ListItemText primary={s.nombre || `Servicio ${i + 1}`} secondary={s.descripcion} />
          </ListItem>
          
        ))}
      </List>
      
    </div>
    
  );
}

ListServicios.propTypes = {
  alojamientoId: PropTypes.number.isRequired,
};