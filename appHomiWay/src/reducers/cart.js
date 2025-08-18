// src/reducers/cart.js
export const CART_ACTION = {
  SET_CART:    'SET_CART',
  ADD_ITEM:    'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  CLEAN_CART:  'CLEAN_CART',
};

export function cartReducer(state, action) {
  switch (action.type) {
    case CART_ACTION.SET_CART:
      return Array.isArray(action.payload) ? action.payload : state;

    case CART_ACTION.ADD_ITEM:
      return [...state, { ...action.payload }];

    case CART_ACTION.REMOVE_ITEM:
      return state.filter(item => item.id !== action.payload.id);

    case CART_ACTION.CLEAN_CART:
      return [];

    default:
      return state;
  }
}
//yaaa