import React, {
  createContext,
  useReducer,
  useEffect,
  useContext,
  useState,
} from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";

import { useAuth } from "./AuthContext";
import { cartReducer, CART_ACTION } from "../reducers/cart";
import { useTranslation } from "react-i18next";

export const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de <CartProvider>");
  }
  return context;
}

export function CartProvider({ children }) {
  const { user, isAuthenticated, loaded } = useAuth();
  const { t } = useTranslation();
  // Determinar userId y storageKey
  const userId = !loaded ? null : isAuthenticated ? user.id : "guest";
  const storageKey = userId ? `cart_${userId}` : null;

  const [state, dispatch] = useReducer(cartReducer, []);
  // Bandera que indica si ya cargamos el carrito correspondiente
  const [initialized, setInitialized] = useState(false);

  // 1) Reiniciar el flag cada vez que cambie la key
  useEffect(() => {
    setInitialized(false);
  }, [storageKey]);

  // 2) Efecto de carga inicial (SET_CART)
  useEffect(() => {
    if (!loaded || !storageKey) return;

    let payload = [];
    try {
      const stored = localStorage.getItem(storageKey);
      payload = stored ? JSON.parse(stored) : [];
    } catch {
      payload = [];
    }

    dispatch({ type: CART_ACTION.SET_CART, payload });
    setInitialized(true);
  }, [loaded, storageKey]);

  // 3) Efecto de persistencia (solo tras la carga inicial)
  useEffect(() => {
    if (!loaded || !storageKey || !initialized) return;

    localStorage.setItem(storageKey, JSON.stringify(state));
  }, [loaded, storageKey, initialized, state]);

  // Métodos del carrito
  const addAlojamiento = (alojamiento) => {
    if (state.find((item) => item.id === alojamiento.id)) {
      toast.error(t("cart.itemExists", { name: alojamiento.name }));

      return;
    }
    dispatch({ type: CART_ACTION.ADD_ITEM, payload: alojamiento });
    toast.success(t("cart.itemAdded", { name: alojamiento.name }));
  };

  const removeAlojamiento = (alojamiento) => {
    dispatch({ type: CART_ACTION.REMOVE_ITEM, payload: alojamiento });
    toast(t("cart.itemRemoved", { name: alojamiento.name }), {
      icon: <RemoveShoppingCartIcon color="warning" />,
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTION.CLEAN_CART });
    if (storageKey) localStorage.removeItem(storageKey);
    toast(t("cart.cartCleared"), { icon: <DeleteIcon color="warning" /> });
  };

  const getTotal = () =>
    state.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);

  return (
    <CartContext.Provider
      value={{
        cart: state,
        addAlojamiento,
        removeAlojamiento,
        clearCart,
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
