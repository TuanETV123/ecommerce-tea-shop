import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  removeItem,
  setCartProducts,
} from "../../redux/cartSlice/cartSlice.js";
import {
  addCartItemApi,
  getCartApi,
  normalizeCartProducts,
  removeCartItemApi,
  updateCartItemApi,
} from "../../services/cartApi";
import { toast } from "react-toastify";

const formatVnd = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const isLocalOnlyDetail = (detail) => !detail?.cartItemId && !detail?.productVariantId;

const extractLocalOnlyProducts = (products) => {
  const list = Array.isArray(products) ? products : [];

  return list
    .map((product) => {
      const details = (product?.productDetails || []).filter(isLocalOnlyDetail);

      if (details.length === 0) {
        return null;
      }

      return {
        productId: product.productId,
        name: product.name,
        img: product.img || null,
        productDetails: details,
      };
    })
    .filter(Boolean);
};

const mergeProductsByDetails = (serverProducts, localProducts) => {
  const merged = new Map();

  (Array.isArray(serverProducts) ? serverProducts : []).forEach((product) => {
    merged.set(product.productId, {
      ...product,
      productDetails: Array.isArray(product.productDetails)
        ? [...product.productDetails]
        : [],
    });
  });

  (Array.isArray(localProducts) ? localProducts : []).forEach((localProduct) => {
    const existing = merged.get(localProduct.productId);

    if (!existing) {
      merged.set(localProduct.productId, {
        ...localProduct,
        productDetails: Array.isArray(localProduct.productDetails)
          ? [...localProduct.productDetails]
          : [],
      });
      return;
    }

    localProduct.productDetails?.forEach((localDetail) => {
      const matchedDetail = existing.productDetails.find(
        (detail) => detail.id === localDetail.id,
      );

      if (matchedDetail) {
        matchedDetail.quantity += Number(localDetail.quantity || 0);
      } else {
        existing.productDetails.push({ ...localDetail });
      }
    });

    if (!existing.img && localProduct.img) {
      existing.img = localProduct.img;
    }
  });

  return Array.from(merged.values());
};

const Cart = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // 1. Get data from Redux
  const products = useSelector((state) => state.cart.products);

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCartApi();
      const normalizedProducts = normalizeCartProducts(response?.data);

      const storedProducts =
        localStorage.getItem("cartList") !== null
          ? JSON.parse(localStorage.getItem("cartList"))
          : [];
      const localOnlyProducts = extractLocalOnlyProducts(storedProducts);
      const mergedProducts = mergeProductsByDetails(
        normalizedProducts,
        localOnlyProducts,
      );

      dispatch(setCartProducts(mergedProducts));
    } catch (error) {
      const message = error?.message || "Khong tai duoc gio hang.";
      if (message.includes("Giỏ hàng trống")) {
        const storedProducts =
          localStorage.getItem("cartList") !== null
            ? JSON.parse(localStorage.getItem("cartList"))
            : [];
        const localOnlyProducts = extractLocalOnlyProducts(storedProducts);
        dispatch(setCartProducts(localOnlyProducts));
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleIncreaseQuantity = async (item) => {
    if (item?.cartItemId) {
      try {
        await updateCartItemApi({
          cartItemId: item.cartItemId,
          quantity: Number(item.quantity || 0) + 1,
        });
        await loadCart();
      } catch (error) {
        toast.error(error?.message || "Khong the cap nhat so luong san pham.");
      }
      return;
    }

    if (!item?.productVariantId) {
      dispatch(
        addToCart({
          productId: item.productId,
          name: item.name,
          img: item.img,
          quantity: 1,
          productDetail: {
            id: item.id,
            sizeLabel: item.sizeLabel,
            unitPrice: item.unitPrice,
            addonId: item.addonId || null,
            addonName: item.addonName || null,
          },
        }),
      );
      return;
    }

    try {
      await addCartItemApi({
        productVariantId: item.productVariantId,
        quantity: 1,
      });
      await loadCart();
    } catch (error) {
      toast.error(error?.message || "Khong the cap nhat so luong san pham.");
    }
  };

  const handleDecreaseQuantity = async (item) => {
    if (item?.cartItemId) {
      try {
        if (Number(item.quantity || 0) <= 1) {
          await removeCartItemApi(item.cartItemId);
        } else {
          await updateCartItemApi({
            cartItemId: item.cartItemId,
            quantity: Number(item.quantity || 0) - 1,
          });
        }
        await loadCart();
      } catch (error) {
        toast.error(error?.message || "Khong the cap nhat so luong san pham.");
      }
      return;
    }

    dispatch(
      decreaseQuantity({
        productId: item.productId,
        detailId: item.id,
      }),
    );
  };

  const handleRemoveCartItem = async (item) => {
    if (item?.cartItemId) {
      try {
        await removeCartItemApi(item.cartItemId);
        await loadCart();
      } catch (error) {
        toast.error(error?.message || "Khong the xoa san pham khoi gio hang.");
      }
      return;
    }

    dispatch(
      removeItem({
        productId: item.productId,
        detailId: item.id,
      }),
    );
  };

  // 2. Flatten nested structure for the UI list
  const flatCartItems =
    products?.flatMap(
      (product) =>
        product.productDetails?.map((detail) => ({
          ...detail,
          productId: product.productId,
          name: product.name,
          img: product.img || null,
        })) || [],
    ) || [];

  const calculatedTotal = flatCartItems.reduce((acc, item) => {
    return acc + item.unitPrice * item.quantity;
  }, 0);

  const cartItemCount = flatCartItems.length;

  return (
    <div className="flex-1 flex justify-center py-8 px-4 md:px-10 lg:px-20 font-display bg-background-light text-[#102213] min-h-screen">
      <div className="flex flex-col max-w-[1200px] w-full">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 pb-6 px-1">
          <Link
            to="/"
            className="text-gray-500 hover:text-primary text-sm font-medium transition-colors"
          >
            Trang chủ
          </Link>
          <span className="text-gray-400 text-sm font-medium">/</span>
          <span className="text-[#102213] text-sm font-medium">Giỏ hàng</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Left Side: Cart Items */}
          <div className="flex-1 w-full flex flex-col gap-6">
            <div className="flex justify-between items-end border-b border-[#e7f3e9] pb-4">
              <h1 className="text-[#0d1b10] text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Giỏ hàng của bạn ({cartItemCount} món)
              </h1>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Dang tai gio hang...</p>
              </div>
            ) : flatCartItems.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-500 text-lg">Giỏ hàng của bạn đang trống.</p>
                <Link
                  to="/shop"
                  className="text-primary font-bold mt-4 inline-block underline"
                >
                  Tiếp tục mua sắm
                </Link>
              </div>
            ) : (
              flatCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-6 bg-white p-6 rounded-xl shadow-sm border border-transparent hover:border-[#e7f3e9] transition-all"
                >
                  <div className="shrink-0">
                    {item.img ? (
                      <div
                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-full sm:w-28 h-28"
                        style={{ backgroundImage: `url("${item.img}")` }}
                      ></div>
                    ) : (
                      <div className="rounded-lg w-full sm:w-28 h-28 bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-xs font-bold px-2 text-center">
                        Không yêu cầu ảnh
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between h-full min-h-[112px]">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="text-[#0d1b10] text-lg font-bold leading-tight">
                          {item.name}
                        </h3>
                        <p className="text-gray-500 text-sm font-normal mt-1">
                          {item.sizeLabel}
                        </p>
                        {item.addonName && (
                          <p className="text-gray-500 text-sm font-normal mt-1">
                            Add-on: {item.addonName}
                          </p>
                        )}
                      </div>
                      <p className="text-[#0d1b10] text-lg font-bold">
                        {formatVnd(item.unitPrice)}
                      </p>
                    </div>

                    <div className="flex justify-between items-end mt-4 sm:mt-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-[#e7f3e9] bg-background-light h-9">
                          <button
                            onClick={() => handleDecreaseQuantity(item)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#0d1b10] transition-colors"
                          >
                            -
                          </button>
                          <input
                            className="w-8 h-full text-center bg-transparent border-none text-sm font-medium focus:ring-0 p-0 text-[#0d1b10]"
                            type="number"
                            readOnly
                            value={item.quantity}
                          />
                          <button
                            onClick={() => handleIncreaseQuantity(item)}
                            className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-[#0d1b10] transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveCartItem(item)}
                        className="text-sm font-medium text-gray-400 hover:text-red-500 transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          delete
                        </span>
                        <span className="hidden sm:inline">Xóa</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Side: Order Summary */}
          <div className="w-full lg:w-[380px] shrink-0 lg:sticky lg:top-24">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-[#e7f3e9]">
              <h3 className="font-bold text-xl mb-6 text-[#0d1b10]">
                Tổng đơn hàng
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tạm tính</span>
                  <span className="font-medium text-[#0d1b10]">
                    {formatVnd(calculatedTotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Phí vận chuyển dự kiến</span>
                  <span className="font-medium text-primary">Miễn phí</span>
                </div>
              </div>

              <div className="border-t border-[#e7f3e9] my-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-[#0d1b10]">
                    Tổng
                  </span>
                  <span className="text-2xl font-black text-[#0d1b10]">
                    {formatVnd(calculatedTotal)}
                  </span>
                </div>
              </div>

              <Link to="/checkout">
                <button
                  disabled={flatCartItems.length === 0}
                  className="w-full bg-primary disabled:bg-gray-300 text-[#102213] text-lg font-bold py-3.5 rounded-lg hover:bg-[#10d430] active:scale-[0.99] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <span>Thanh toán</span>
                  <span className="material-symbols-outlined text-[20px]">
                    arrow_forward
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
