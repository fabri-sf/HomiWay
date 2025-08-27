import React, { createContext, useReducer, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import {
  cartReducer,
  cartInitialState,
  getTotal,
  getCountItems,
  CART_ACTION,
} from "../reducers/cart";
import CarritoService from "../services/CarritoService";
import { UserContext } from "./UserContext";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, cartInitialState);
  const { decodeToken } = useContext(UserContext);

  // 1) Cargar carrito de la API al montar / al cambiar usuario
  useEffect(() => {
    const loadCart = async () => {
      const { id } = decodeToken() || {};
      if (!id) return;
      try {
        const resp = await CarritoService.getCarrito(id);
        dispatch({ type: CART_ACTION.SET_CART, payload: resp.data });
      } catch (err) {
        console.error("Error cargando carrito:", err);
      }
    };
    loadCart();
  }, [decodeToken]);

  // 2) Acciones para agregar, quitar, limpiar
  const addItem = (alojamiento) => {
    dispatch({ type: CART_ACTION.ADD_ITEM, payload: alojamiento });
    toast.success(`${alojamiento.nombre} añadido al carrito`);
  };
  const removeItem = (alojamiento) => {
    dispatch({ type: CART_ACTION.REMOVE_ITEM, payload: alojamiento });
    toast(`${alojamiento.nombre} eliminado`, {
      icon: <RemoveShoppingCartIcon color="warning" />,
    });
  };
  const cleanCart = () => {
    dispatch({ type: CART_ACTION.CLEAN_CART });
    toast("Carrito vaciado", { icon: <DeleteIcon color="warning" /> });
  };

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addItem,
        removeItem,
        cleanCart,
        getCountItems,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
