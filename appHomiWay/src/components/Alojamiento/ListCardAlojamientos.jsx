import React from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';

ListCardAlojamientos.propTypes = {
  data: PropTypes.array.isRequired,
};

export function ListCardAlojamientos({ data }) {
  const BASE_URL = import.meta.env.VITE_BASE_URL + 'uploads/';

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        padding: 16,
      }}
    >
      {data.map((item) => {
        const imagenRuta =
          Array.isArray(item.imagenes) && item.imagenes.length > 0
            ? `${BASE_URL}${item.imagenes[0].url}`
            : '/monteVerde.jpg';

        return (
          <Card key={item.id} sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia
              sx={{ height: 140 }}
              image={imagenRuta}
              title={item.nombre}
            />
            <CardHeader title={item.nombre} />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="body2" color="text.secondary" noWrap>
                {item.descripcion}
              </Typography>
            </CardContent>
            <CardActions>
            <Button
              size="small"
              component={Link}
              to={`/alojamiento/${item.id}`}
              sx={{
                backgroundColor: '#2e7d32',
                color: '#ffffff',
                '&:hover': {
                  backgroundColor: '#1b5e20',
                },
              }}
            >
              Ver más
            </Button>
            </CardActions>
          </Card>
        );
      })}
    </div>
  );
}