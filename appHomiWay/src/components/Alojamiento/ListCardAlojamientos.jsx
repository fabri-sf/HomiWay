import React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import PropTypes from 'prop-types';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

ListCardAlojamientos.propTypes = {
  data: PropTypes.array.isRequired,
};

export function ListCardAlojamientos({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads';

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
      {data.map((item) => (
        <Card key={item.id} style={{ width: 300 }}>
          <CardHeader title={item.nombre} subheader={item.descripcion_corta} />
          <CardMedia
            component="img"
            height="140"
            image={`${BASE_URL}/${item.imagen}`}
            alt={item.nombre}
          />
          <CardContent>
            <Typography variant="body2" color="text.secondary" noWrap>
              {item.descripcion_corta}
            </Typography>
          </CardContent>
          <Link to={`/alojamiento/${item.id}`}>Ver más</Link>
        </Card>
      ))}
    </div>
  );
}
