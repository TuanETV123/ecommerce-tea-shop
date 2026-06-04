import { createSlice } from "@reduxjs/toolkit";

// 1. Get initial data from localStorage (using 'products' to match your logic)
const storedProducts =
  localStorage.getItem("cartList") !== null
    ? JSON.parse(localStorage.getItem("cartList"))
    : [];

const initialState = {
  products: storedProducts, // Make sure this matches the key you use in reducers
  selectedCoupon: {},
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  initialState, // Use the merged initialState here
  reducers: {
    setCartProducts: (state, action) => {
      state.products = Array.isArray(action.payload) ? action.payload : [];
      localStorage.setItem("cartList", JSON.stringify(state.products));
    },

    addToCart: (state, action) => {
      const newItem = action.payload;

      // Ensure state.products exists
      if (!state.products) state.products = [];

      const existingProduct = state.products.find(
        (p) => p.productId === newItem.productId,
      );

      if (existingProduct) {
        // Fix: Use 'id' to match your ProductDetail model
        const existingDetail = existingProduct.productDetails.find(
          (d) => d.id === newItem.productDetail.id,
        );

        if (!existingDetail) {
          existingProduct.productDetails.push({
            ...newItem.productDetail,
            quantity: newItem.quantity || 1,
          });
        } else {
          existingDetail.quantity += newItem.quantity || 1;
        }
      } else {
        state.products.push({
          productId: newItem.productId,
          name: newItem.name,
          img: newItem.img,
          productDetails: [
            {
              ...newItem.productDetail,
              quantity: newItem.quantity || 1,
            },
          ],
        });
      }

      localStorage.setItem("cartList", JSON.stringify(state.products));
    },

    increaseQuantity: (state, action) => {
      const { productId, detailId } = action.payload;
      const product = state.products.find((p) => p.productId === productId);
      if (product) {
        const detail = product.productDetails.find((d) => d.id === detailId);
        if (detail) {
          detail.quantity += 1;
          state.totalAmount += detail.unitPrice;
          localStorage.setItem("cartList", JSON.stringify(state.products));
        }
      }
    },

    decreaseQuantity: (state, action) => {
      const { productId, detailId } = action.payload;
      const product = state.products.find((p) => p.productId === productId);
      if (product) {
        const detail = product.productDetails.find((d) => d.id === detailId);
        if (detail && detail.quantity > 1) {
          detail.quantity -= 1;
          state.totalAmount -= detail.unitPrice;
        } else if (detail) {
          // Remove detail if quantity would be 0
          state.totalAmount -= detail.unitPrice;
          product.productDetails = product.productDetails.filter(
            (d) => d.id !== detailId,
          );
        }

        // Remove product if no details left
        if (product.productDetails.length === 0) {
          state.products = state.products.filter(
            (p) => p.productId !== productId,
          );
        }
        localStorage.setItem("cartList", JSON.stringify(state.products));
      }
    },

    removeItem: (state, action) => {
      const { productId, detailId } = action.payload;
      const product = state.products.find((p) => p.productId === productId);
      if (product) {
        const detail = product.productDetails.find((d) => d.id === detailId);
        if (detail) {
          state.totalAmount -= detail.unitPrice * detail.quantity;
          product.productDetails = product.productDetails.filter(
            (d) => d.id !== detailId,
          );
        }
        if (product.productDetails.length === 0) {
          state.products = state.products.filter(
            (p) => p.productId !== productId,
          );
        }
        localStorage.setItem("cartList", JSON.stringify(state.products));
      }
    },

    applyCoupon: (state, action) => {
      state.selectedCoupon =
        state.selectedCoupon.id === action.payload.id ? {} : action.payload;
    },
  },
});

export const {
  setCartProducts,
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  applyCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;
