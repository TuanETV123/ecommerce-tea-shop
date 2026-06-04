import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addAddressApi, getAddressesApi } from "../../services/addressApi";
import { getCartApi, normalizeCartProducts } from "../../services/cartApi";
import { checkoutOrderApi } from "../../services/orderApi";
import { setCartProducts } from "../../redux/cartSlice/cartSlice";

const formatVnd = (value) => `${Number(value || 0).toLocaleString("vi-VN")}đ`;

const flattenCartItems = (products) =>
  (products || []).flatMap(
    (product) =>
      product.productDetails?.map((detail) => ({
        ...detail,
        productId: product.productId,
        name: product.name,
        img: product.img || "https://via.placeholder.com/150",
      })) || [],
  );

const Checkout = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth || { isAuthenticated: false, user: null });
  const cartProducts = useSelector((state) => state.cart?.products || []);
  const dispatch = useDispatch();
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || "",
    phone: "",
    addressLine: "",
    city: "",
    district: "",
    ward: "",
    isDefault: false,
  });

  const selectedAddressLabel = useMemo(() => {
    if (!selectedAddress) {
      return "Chưa chọn địa chỉ";
    }
    return `${selectedAddress.ward}, ${selectedAddress.district}`;
  }, [selectedAddress]);

  const selectedAddressDetails = useMemo(() => {
    if (!selectedAddress) {
      return "";
    }
    return `${selectedAddress.addressLine}, ${selectedAddress.ward}, ${selectedAddress.district}, ${selectedAddress.city}`;
  }, [selectedAddress]);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await getAddressesApi();
      const list = Array.isArray(response?.data) ? response.data : [];
      setSavedAddresses(list);

      const defaultAddress = list.find((item) => item.isDefault) || list[0] || null;
      setSelectedAddress((prev) => prev || defaultAddress);
    } catch (error) {
      toast.error(error?.message || "Không tải được địa chỉ giao hàng.");
    } finally {
      setLoadingAddresses(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated]);

  const handleAddressInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddAddress = async (event) => {
    event.preventDefault();

    if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine || !addressForm.city || !addressForm.district || !addressForm.ward) {
      toast.error("Vui lòng nhập đầy đủ thông tin địa chỉ.");
      return;
    }

    try {
      setSavingAddress(true);
      const response = await addAddressApi({
        fullName: addressForm.fullName,
        phone: addressForm.phone,
        addressLine: addressForm.addressLine,
        city: addressForm.city,
        district: addressForm.district,
        ward: addressForm.ward,
        isDefault: addressForm.isDefault,
      });
      toast.success(response?.message || "Thêm địa chỉ thành công");

      setAddressForm({
        fullName: user?.name || "",
        phone: "",
        addressLine: "",
        city: "",
        district: "",
        ward: "",
        isDefault: false,
      });

      await fetchAddresses();
    } catch (error) {
      toast.error(error?.message || "Không thể thêm địa chỉ mới.");
    } finally {
      setSavingAddress(false);
    }
  };

  const orderItems = useMemo(() => flattenCartItems(cartProducts), [cartProducts]);

  const subtotal = useMemo(
    () => orderItems.reduce((sum, item) => sum + Number(item.unitPrice || 0) * Number(item.quantity || 0), 0),
    [orderItems],
  );

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.error("Vui long dang nhap de dat hang.");
      return;
    }

    if (!selectedAddress?.id) {
      toast.error("Vui long chon dia chi giao hang.");
      return;
    }

    try {
      setCheckingOut(true);

      const cartResponse = await getCartApi();
      const normalized = normalizeCartProducts(cartResponse?.data);
      dispatch(setCartProducts(normalized));

      const refreshedItems = flattenCartItems(normalized);
      const cartItemIds = refreshedItems
        .map((item) => item.cartItemId)
        .filter(Boolean);

      if (cartItemIds.length === 0) {
        toast.error("Khong tim thay san pham hop le trong gio hang de thanh toan.");
        return;
      }

      const response = await checkoutOrderApi({
        addressId: selectedAddress.id,
        cartItemIds,
      });

      const checkoutUrl = response?.data?.checkoutUrl;
      toast.success(response?.message || "Dat hang thanh cong.");

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      toast.error(error?.message || "Khong the thuc hien thanh toan.");
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12 font-display bg-background-light text-[#0d1b10] min-h-screen relative">
      
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-black text-[#0d1b10]">Chọn địa chỉ</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2">
              {savedAddresses.map((addr) => (
                <div 
                  key={addr.id} 
                  onClick={() => {
                    setSelectedAddress(addr);
                    setShowAddressModal(false);
                  }}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedAddress?.id === addr.id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white hover:border-primary/30'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedAddress?.id === addr.id ? 'border-primary' : 'border-gray-300'}`}>
                      {selectedAddress?.id === addr.id && <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-[#0d1b10]">{addr.fullName}</span>
                        {addr.isDefault && <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-md">Mặc định</span>}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{addr.addressLine}, {addr.ward}, {addr.district}, {addr.city}</p>
                      <p className="text-sm font-medium text-[#0d1b10] mt-2">{addr.fullName} • {addr.phone}</p>
                    </div>
                  </div>
                </div>
              ))}
              {loadingAddresses && <p className="text-sm text-gray-500">Đang tải địa chỉ...</p>}
              {!loadingAddresses && savedAddresses.length === 0 && (
                <p className="text-sm text-gray-500">Bạn chưa có địa chỉ nào.</p>
              )}
            </div>
            
            <form className="mt-6 space-y-3 border-t border-gray-100 pt-6" onSubmit={handleAddAddress}>
              <h4 className="text-sm font-bold text-[#0d1b10]">Thêm địa chỉ mới</h4>
              <input name="fullName" placeholder="Họ và tên" value={addressForm.fullName} onChange={handleAddressInputChange} className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 text-[#0d1b10]" />
              <input name="phone" placeholder="Số điện thoại" value={addressForm.phone} onChange={handleAddressInputChange} className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 text-[#0d1b10]" />
              <input name="addressLine" placeholder="Địa chỉ" value={addressForm.addressLine} onChange={handleAddressInputChange} className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 text-[#0d1b10]" />
              <div className="grid grid-cols-3 gap-2">
                <input name="ward" placeholder="Phường/Xã" value={addressForm.ward} onChange={handleAddressInputChange} className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-3 text-[#0d1b10]" />
                <input name="district" placeholder="Quận/Huyện" value={addressForm.district} onChange={handleAddressInputChange} className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-3 text-[#0d1b10]" />
                <input name="city" placeholder="Tỉnh/TP" value={addressForm.city} onChange={handleAddressInputChange} className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-3 text-[#0d1b10]" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input name="isDefault" type="checkbox" checked={addressForm.isDefault} onChange={handleAddressInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" />
                Đặt làm mặc định
              </label>
              <button type="submit" className="w-full py-3 rounded-xl bg-primary text-[#0d1b10] font-bold hover:bg-primary/90 transition-colors disabled:opacity-70" disabled={savingAddress}>
                {savingAddress ? "Đang lưu..." : "Lưu địa chỉ"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
        <div className="flex-1 flex flex-col gap-8 order-2 lg:order-1">
          <nav className="flex items-center flex-wrap gap-2 text-sm font-medium">
            <Link to="/cart" className="text-primary hover:underline">
              Giỏ hàng
            </Link>
            <span className="material-symbols-outlined text-gray-400 text-base">
              chevron_right
            </span>
            <span className="text-[#0d1b10]">Thông tin</span>
            <span className="material-symbols-outlined text-gray-400 text-base">
              chevron_right
            </span>
            <span className="text-gray-500">Vận chuyển</span>
            <span className="material-symbols-outlined text-gray-400 text-base">
              chevron_right
            </span>
            <span className="text-gray-500">Thanh toán</span>
          </nav>

          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold tracking-tight text-[#0d1b10]">
                Thông tin liên hệ
              </h3>
              {!isAuthenticated && (
                <div className="text-sm text-gray-600">
                  Đã có tài khoản?{" "}
                  <Link
                    to="/login"
                    className="text-primary hover:underline font-medium"
                  >
                    Đăng nhập
                  </Link>
                </div>
              )}
            </div>
            
            {isAuthenticated ? (
              <div className="p-4 rounded-xl border border-[#e7f3e9] bg-white flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black uppercase shrink-0">
                  {user?.name?.charAt(0) || "C"}
                </div>
                <div>
                  <p className="font-bold text-[#0d1b10]">{user?.name || "Khách hàng"}</p>
                  <p className="text-sm text-gray-500">{user?.email || "customer@teavault.com"}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">
                    Địa chỉ email
                  </span>
                  <input
                    className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10] placeholder:text-gray-400"
                    placeholder="ban@example.com"
                    type="email"
                  />
                </label>
              </div>
            )}
            
            <div className="flex items-center gap-2 mt-4">
              <input
                className="rounded border-gray-300 text-primary focus:ring-primary bg-white"
                id="newsletter"
                type="checkbox"
              />
              <label className="text-sm text-gray-600" htmlFor="newsletter">
                Gửi email cho tôi về tin tức và ưu đãi
              </label>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold tracking-tight text-[#0d1b10] mb-4">
              Địa chỉ giao hàng
            </h3>
            
            {isAuthenticated ? (
              <div className="rounded-2xl border-2 border-primary/20 bg-primary/5 p-6 relative">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                    <span className="font-bold text-[#0d1b10] text-lg">Giao đến: {selectedAddressLabel}</span>
                  </div>
                  <button 
                    onClick={() => setShowAddressModal(true)}
                    className="text-xs font-bold uppercase tracking-widest text-primary hover:text-[#0d1b10] transition-colors"
                  >
                    Đổi
                  </button>
                </div>
                <div className="ml-7">
                  <p className="font-bold text-[#0d1b10] mb-1">{selectedAddress?.fullName || user?.name || "Khách hàng"} <span className="text-gray-400 font-normal mx-2">|</span> {selectedAddress?.phone || "Chưa có số điện thoại"}</p>
                  <p className="text-sm text-gray-600 leading-relaxed max-w-md">
                    {loadingAddresses ? "Đang tải địa chỉ..." : selectedAddressDetails || "Bạn chưa có địa chỉ, bấm Đổi để thêm mới."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Tên</span>
                  <input className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]" type="text" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Họ</span>
                  <input className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]" type="text" />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Địa chỉ</span>
                  <input className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]" type="text" />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Căn hộ, phòng, v.v. (tùy chọn)</span>
                  <input className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]" type="text" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Thành phố</span>
                  <input className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]" type="text" />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Mã bưu chính</span>
                  <input className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]" type="text" />
                </label>
                <label className="block md:col-span-2">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Quốc gia/Khu vực</span>
                  <select className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10] appearance-none">
                    <option>Hoa Kỳ</option>
                    <option>Canada</option>
                    <option>Vương quốc Anh</option>
                    <option>Nhật Bản</option>
                    <option>Việt Nam</option>
                  </select>
                </label>
                <label className="block md:col-span-2 relative">
                  <span className="text-sm font-medium text-gray-700 mb-1 block">Điện thoại (tùy chọn)</span>
                  <input className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]" type="tel" />
                  <span className="material-symbols-outlined absolute right-3 top-9 text-gray-400 text-lg pointer-events-none">help</span>
                </label>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-xl font-bold tracking-tight text-[#0d1b10] mb-4">
              Phương thức vận chuyển
            </h3>
            <div className="rounded-lg border border-[#e7f3e9] bg-white overflow-hidden">
              <label className="relative flex items-center p-4 border-b border-[#e7f3e9] cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  defaultChecked
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  name="shipping"
                  type="radio"
                />
                <div className="ml-3 flex flex-1 flex-col">
                  <span className="block text-sm font-medium text-[#0d1b10]">
                    Giao hàng tiêu chuẩn
                  </span>
                  <span className="block text-xs text-gray-500">
                    5-8 ngày làm việc
                  </span>
                </div>
                <span className="text-sm font-medium text-[#0d1b10]">Miễn phí</span>
              </label>
              <label className="relative flex items-center p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                  name="shipping"
                  type="radio"
                />
                <div className="ml-3 flex flex-1 flex-col">
                  <span className="block text-sm font-medium text-[#0d1b10]">
                    Giao hàng nhanh
                  </span>
                  <span className="block text-xs text-gray-500">
                    1-3 ngày làm việc
                  </span>
                </div>
                <span className="text-sm font-medium text-[#0d1b10]">
                  $15.00
                </span>
              </label>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold tracking-tight text-[#0d1b10] mb-4">
              Thanh toán
            </h3>
            <div className="rounded-lg border border-[#e7f3e9] bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Thẻ tín dụng
                  </span>
                  <div className="flex gap-2 text-gray-400">
                    <span className="material-symbols-outlined">
                      credit_card
                    </span>
                    <span className="material-symbols-outlined">
                      account_balance_wallet
                    </span>
                  </div>
                </div>
                <label className="block">
                  <input
                    className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]"
                    placeholder="Số thẻ"
                    type="text"
                  />
                </label>
                <label className="block">
                  <input
                    className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]"
                    placeholder="Tên trên thẻ"
                    type="text"
                  />
                </label>
                <div className="flex gap-4">
                  <label className="block flex-1">
                    <input
                      className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]"
                      placeholder="Hết hạn (MM / YY)"
                      type="text"
                    />
                  </label>
                  <label className="block flex-1 relative">
                    <input
                      className="w-full h-12 px-4 rounded-lg bg-white border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10]"
                      placeholder="CVC"
                      type="text"
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">
                      lock
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </section>

          <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 pt-6 mt-4 border-t border-[#e7f3e9]">
            <Link
              to="/cart"
              className="flex items-center gap-1 text-primary hover:text-green-600 transition-colors text-sm font-medium"
            >
              <span className="material-symbols-outlined text-base">
                arrow_back
              </span>
              Quay lại giỏ hàng
            </Link>
          </div>
        </div>

        <div className="lg:w-[400px] xl:w-[440px] flex-none order-1 lg:order-2">
          <div className="sticky top-24">
            <div className="bg-white border border-[#e7f3e9] rounded-2xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-xl font-bold tracking-tight text-[#0d1b10] mb-6">
                Tổng đơn hàng
              </h2>

              <div className="space-y-4 mb-6">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex gap-4 items-start">
                    <div className="relative w-16 h-16 rounded-lg bg-white border border-[#e7f3e9] overflow-hidden flex-none">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                        {item.qty}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-[#0d1b10]">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {item.sizeLabel}
                      </p>
                    </div>
                    <div className="text-sm font-bold text-[#0d1b10]">
                      {formatVnd(item.unitPrice)}
                    </div>
                  </div>
                ))}
                {orderItems.length === 0 && (
                  <p className="text-sm text-gray-500">Gio hang dang trong.</p>
                )}
              </div>

              <div className="flex gap-2 mb-6 pt-6 border-t border-[#e7f3e9]">
                <input
                  className="flex-1 h-12 px-4 rounded-lg bg-[#f8fcf9] border border-[#e7f3e9] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-[#0d1b10] placeholder:text-gray-400 text-sm"
                  placeholder="Mã giảm giá"
                  type="text"
                />
                <button className="h-12 px-6 rounded-lg bg-gray-100 hover:bg-gray-200 text-[#0d1b10] font-bold text-sm transition-colors">
                  Áp dụng
                </button>
              </div>

              <div className="space-y-3 pt-6 border-t border-[#e7f3e9] text-sm">
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Tạm tính</span>
                  <span className="font-bold text-[#0d1b10]">{formatVnd(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="font-medium">Vận chuyển</span>
                  <span className="font-bold text-[#0d1b10]">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between items-end pt-6 mt-6 border-t border-[#e7f3e9]">
                <span className="text-base font-black text-[#0d1b10]">
                  Tổng
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-[#0d1b10]">
                    {formatVnd(subtotal)}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex justify-center ">
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut || orderItems.length === 0 || !isAuthenticated}
                  className="w-full sm:w-auto px-20 py-4 bg-primary hover:bg-[#0fd630] disabled:bg-gray-300 text-[#0d1b10] font-black tracking-wide rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  {checkingOut ? "Dang xu ly..." : "Thanh toán ngay"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;