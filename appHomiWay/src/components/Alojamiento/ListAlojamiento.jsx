import React, { useEffect, useState } from 'react';
import AlojamientoService from '../../services/AlojamientoService';
import { ListCardAlojamientos } from './ListCardAlojamientos';

export function ListAlojamiento() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    AlojamientoService.getAlojamientos()
      .then((res) => {
        setData(res.data);
        setError('');
        setLoaded(true);
      })
      .catch((err) => {
        setError(err.message || 'Error al obtener alojamientos');
        setLoaded(false);
      });
  }, []);

  if (!loaded) return <p>Cargando alojamientos...</p>;
  if (error) return <p>Error: {error}</p>;

  return <>{data && <ListCardAlojamientos data={data} />}</>;
}
