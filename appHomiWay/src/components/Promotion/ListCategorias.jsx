import React, { useState, useEffect } from 'react';
import { 
  Modal, Box, Typography, Button, Table, 
  TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Alert 
} from '@mui/material';
import AlojamientoService from '../../services/AlojamientoService';
import EtiquetaService from '../../services/EtiquetaService';
import PropTypes from 'prop-types';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '80vh',
  overflowY: 'auto'
};

const ListCategorias = ({ open, onClose, promotionId, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [applying, setApplying] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (open) {
      loadCategories();
      setError(null);
      setSuccess(null);
    }
  }, [open]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await AlojamientoService.getCategorias();
      
      // Asegúrate de que response sea un array
      if (!Array.isArray(response)) {
        throw new Error('Formato de datos inválido');
      }
      
      setCategories(response);
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      setError(err.message || 'Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPromotion = async (category) => {
    try {
      setApplying(category);
      setError(null);
      
      // Usar el método applyPromocionByCategoria del EtiquetaService
      await EtiquetaService.applyPromocionByCategoria(category, promotionId);
      
      // Mostrar mensaje de éxito
      setSuccess(`¡Promoción creada y asociada exitosamente a la categoría "${category}"!`);
      
      // Llamar al callback de éxito
      onSuccess();
      
      // Cerrar el modal después de 2 segundos
      setTimeout(() => {
        onClose();
        setSuccess(null);
      }, 2000);
      
    } catch (err) {
      console.error('Error al aplicar promoción a categoría:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        err.message || 
        'Error al aplicar promoción a la categoría'
      );
    } finally {
      setApplying(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2" gutterBottom>
          Seleccione una categoría para aplicar la promoción
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Categoría</TableCell>
                  <TableCell align="right">Acción</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories.map((category, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {category}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button 
                        variant="contained"
                        onClick={() => handleApplyPromotion(category)}
                        disabled={applying === category || success}
                        sx={{
                          backgroundColor: '#2e7d32',
                          '&:hover': { backgroundColor: '#1b5e20' },
                          minWidth: 150
                        }}
                      >
                        {applying === category ? (
                          <CircularProgress size={24} color="inherit" />
                        ) : (
                          'Aplicar Promoción'
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={onClose} disabled={applying}>
            Cancelar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

ListCategorias.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  promotionId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onSuccess: PropTypes.func.isRequired
};

export default ListCategorias;