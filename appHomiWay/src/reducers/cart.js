// src/reducers/cart.js

// Estado inicial: lee del localStorage o arranca vacío
export const cartInitialState =
  JSON.parse(localStorage.getItem("cart")) || [];

// Acciones disponibles
export const CART_ACTION = {
  SET_CART:    "SET_CART",
  ADD_ITEM:    "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  CLEAN_CART:  "CLEAN_CART",
};

// Sincroniza el estado con localStorage
const updateLocalStorage = (arr) => {
  localStorage.setItem("cart", JSON.stringify(arr));
};

// Calcula subtotal por ítem
const calculateSubtotal = (item) => item.price * item.days;

// Calcula total del carrito
const calculateTotal = (cart) =>
  cart.reduce((sum, i) => sum + i.subtotal, 0);

// Reducer principal
export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTION.SET_CART: {
      updateLocalStorage(action.payload);
      return action.payload;
    }
    case CART_ACTION.ADD_ITEM: {
      const idx = state.findIndex((i) => i.id === action.payload.id);
      if (idx >= 0) {
        const copy = structuredClone(state);
        copy[idx].days += 1;
        copy[idx].subtotal = calculateSubtotal(copy[idx]);
        updateLocalStorage(copy);
        return copy;
      }
      const added = [
        ...state,
        { 
          ...action.payload,
          days: 1,
          subtotal: calculateSubtotal({ ...action.payload, days: 1 })
        },
      ];
      updateLocalStorage(added);
      return added;
    }
    case CART_ACTION.REMOVE_ITEM: {
      const filtered = state.filter((i) => i.id !== action.payload.id);
      updateLocalStorage(filtered);
      return filtered;
    }
    case CART_ACTION.CLEAN_CART: {
      updateLocalStorage([]);
      return [];
    }
    default:
      return state;
  }
}

// Contador de ítems: suma campo 'days'
export const getCountItems = (state) =>
  state.reduce((sum, i) => sum + (i.days ?? 1), 0);

// Total del carrito
export const getTotal = (state) => calculateTotal(state);
