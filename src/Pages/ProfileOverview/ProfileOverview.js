import React, { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { changePasswordApi } from '../../services/authApi';
import { addAddressApi, deleteAddressApi, getAddressesApi } from '../../services/addressApi';
import { getMyOrdersApi, getOrderByCodeApi } from '../../services/orderApi';
import { getTransactionsApi } from '../../services/transactionApi';

const formatVnd = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const formatDateTime = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('vi-VN');
};

const mapOrderStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'paid') {
    return { label: 'Đã thanh toán', color: 'text-primary' };
  }
  if (normalized === 'pending') {
    return { label: 'Đang chờ', color: 'text-amber-500' };
  }
  return { label: status || 'Không xác định', color: 'text-gray-500' };
};

const mapTransactionStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'success') {
    return { label: 'Thanh toán thành công', color: 'text-primary' };
  }
  if (normalized === 'pending') {
    return { label: 'Đang xử lý giao dịch', color: 'text-amber-500' };
  }
  return { label: status || 'Chưa thanh toán', color: 'text-gray-500' };
};

const ProfileOverview = () => {
  const { isAuthenticated, user, accessToken } = useSelector((state) => state.auth || { isAuthenticated: false, user: null, accessToken: null });
  
  const [activeView, setActiveView] = useState('overview');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [deletingAddressId, setDeletingAddressId] = useState(null);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: '',
    addressLine: '',
    city: '',
    district: '',
    ward: '',
    isDefault: false,
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const isGoogleUser = (user?.authProvider || '').toLowerCase() === 'google';
  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await getAddressesApi();
      const list = Array.isArray(response?.data) ? response.data : [];
      setAddresses(list);
    } catch (error) {
      toast.error(error?.message || 'Không tải được danh sách địa chỉ.');
    } finally {
      setLoadingAddresses(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await getMyOrdersApi();
      const list = Array.isArray(response?.data) ? response.data : [];
      setOrders(list);
    } catch (error) {
      toast.error(error?.message || 'Không tải được danh sách đơn hàng.');
    } finally {
      setLoadingOrders(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const response = await getTransactionsApi();
      const list = Array.isArray(response?.data) ? response.data : [];
      setTransactions(list);
    } catch (error) {
      toast.error(error?.message || 'Không tải được lịch sử giao dịch.');
    } finally {
      setLoadingTransactions(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
      fetchOrders();
      fetchTransactions();
    }
  }, [isAuthenticated]);

  const transactionsByOrderId = useMemo(() => {
    const map = new Map();
    transactions.forEach((transaction) => {
      if (transaction?.orderId) {
        map.set(transaction.orderId, transaction);
      }
    });
    return map;
  }, [transactions]);

  const recentOrders = orders.slice(0, 2);

  const handleViewOrder = async (orderCode) => {
    try {
      const response = await getOrderByCodeApi(orderCode);
      const detail = response?.data;
      toast.success(`Đơn #${detail?.orderCode} - ${detail?.status || 'Pending'}`);
    } catch (error) {
      toast.error(error?.message || 'Không tải được chi tiết đơn hàng.');
    }
  };

  const handlePasswordInputChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  const closeAddressModal = () => {
    setShowAddressModal(false);
    setAddressForm({
      fullName: user?.name || '',
      phone: '',
      addressLine: '',
      city: '',
      district: '',
      ward: '',
      isDefault: false,
    });
  };

  const handleAddressInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddAddress = async (event) => {
    event.preventDefault();

    if (!addressForm.fullName || !addressForm.phone || !addressForm.addressLine || !addressForm.city || !addressForm.district || !addressForm.ward) {
      toast.error('Vui lòng nhập đầy đủ thông tin địa chỉ.');
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
      toast.success(response?.message || 'Thêm địa chỉ thành công.');
      closeAddressModal();
      await fetchAddresses();
    } catch (error) {
      toast.error(error?.message || 'Không thể thêm địa chỉ.');
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      setDeletingAddressId(id);
      const response = await deleteAddressApi(id);
      toast.success(response?.message || 'Xóa địa chỉ thành công.');
      await fetchAddresses();
    } catch (error) {
      toast.error(error?.message || 'Không thể xóa địa chỉ.');
    } finally {
      setDeletingAddressId(null);
    }
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Vui long nhap day du thong tin mat khau.');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      toast.error('Mat khau moi can it nhat 8 ky tu.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Xac nhan mat khau moi khong khop.');
      return;
    }

    if (!accessToken) {
      toast.error('Ban can dang nhap lai de doi mat khau.');
      return;
    }

    try {
      setChangingPassword(true);
      const response = await changePasswordApi({
        accessToken,
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success(response?.message || 'Doi mat khau thanh cong.');
      closePasswordModal();
    } catch (error) {
      toast.error(error?.message || 'Doi mat khau that bai.');
    } finally {
      setChangingPassword(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="w-full max-w-[1440px] mx-auto flex flex-col lg:flex-row gap-12 px-4 md:px-10 py-12 font-display bg-background-light relative">
      
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black text-[#0d1b10] mb-2">Đổi mật khẩu</h3>
            <p className="text-sm text-gray-500 mb-6">Tạo mật khẩu mới an toàn cho tài khoản của bạn.</p>
            <form className="space-y-4" onSubmit={handleChangePassword}>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Mật khẩu hiện tại</label>
                <input name="currentPassword" type="password" value={passwordForm.currentPassword} onChange={handlePasswordInputChange} required className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 font-semibold text-[#0d1b10] focus:ring-2 focus:ring-primary focus:border-transparent mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Mật khẩu mới</label>
                <input name="newPassword" type="password" value={passwordForm.newPassword} onChange={handlePasswordInputChange} required className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 font-semibold text-[#0d1b10] focus:ring-2 focus:ring-primary focus:border-transparent mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Xác nhận mật khẩu mới</label>
                <input name="confirmPassword" type="password" value={passwordForm.confirmPassword} onChange={handlePasswordInputChange} required className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 font-semibold text-[#0d1b10] focus:ring-2 focus:ring-primary focus:border-transparent mt-1" />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closePasswordModal} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors" disabled={changingPassword}>Hủy</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-[#0d1b10] font-bold hover:bg-primary/90 transition-transform hover:scale-[1.02] shadow-sm disabled:opacity-70" disabled={changingPassword}>{changingPassword ? 'Dang cap nhat...' : 'Cập nhật'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-2xl font-black text-[#0d1b10] mb-2">Địa chỉ giao hàng</h3>
            <p className="text-sm text-gray-500 mb-6">Cập nhật nơi bạn muốn nhận trà.</p>
            <form className="space-y-4" onSubmit={handleAddAddress}>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Họ và tên</label>
                <input name="fullName" type="text" value={addressForm.fullName} onChange={handleAddressInputChange} required className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 font-semibold text-[#0d1b10] focus:ring-2 focus:ring-primary focus:border-transparent mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Số điện thoại</label>
                <input name="phone" type="text" value={addressForm.phone} onChange={handleAddressInputChange} required className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 font-semibold text-[#0d1b10] focus:ring-2 focus:ring-primary focus:border-transparent mt-1" />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">Địa chỉ</label>
                <input name="addressLine" type="text" value={addressForm.addressLine} onChange={handleAddressInputChange} required className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 font-semibold text-[#0d1b10] focus:ring-2 focus:ring-primary focus:border-transparent mt-1" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input name="ward" placeholder="Phường/Xã" type="text" value={addressForm.ward} onChange={handleAddressInputChange} required className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 font-semibold text-[#0d1b10] focus:ring-2 focus:ring-primary focus:border-transparent" />
                <input name="district" placeholder="Quận/Huyện" type="text" value={addressForm.district} onChange={handleAddressInputChange} required className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 font-semibold text-[#0d1b10] focus:ring-2 focus:ring-primary focus:border-transparent" />
                <input name="city" placeholder="Tỉnh/Thành phố" type="text" value={addressForm.city} onChange={handleAddressInputChange} required className="w-full rounded-xl border border-gray-200 bg-surface-light py-3 px-4 font-semibold text-[#0d1b10] focus:ring-2 focus:ring-primary focus:border-transparent" />
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input name="isDefault" type="checkbox" checked={addressForm.isDefault} onChange={handleAddressInputChange} className="rounded border-gray-300 text-primary focus:ring-primary" />
                Đặt làm địa chỉ mặc định
              </label>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={closeAddressModal} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors" disabled={savingAddress}>Hủy</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-primary text-[#0d1b10] font-bold hover:bg-primary/90 transition-transform hover:scale-[1.02] shadow-sm disabled:opacity-70" disabled={savingAddress}>{savingAddress ? 'Đang lưu...' : 'Lưu địa chỉ'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <aside className="w-full shrink-0 lg:w-64">
        <nav className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveView('overview')} 
            className={`flex items-center gap-3 rounded-xl px-5 py-4 font-bold transition-all w-full text-left ${activeView === 'overview' ? 'bg-primary/10 text-[#0d1b10] border border-primary/20' : 'text-gray-500 hover:text-[#0d1b10] hover:bg-surface-light'}`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeView === 'overview' ? 'text-primary' : ''}`}>person</span>
            <span className="text-sm">Tổng quan tài khoản</span>
          </button>
          
          <button 
            onClick={() => setActiveView('orders')} 
            className={`flex items-center gap-3 rounded-xl px-5 py-4 font-bold transition-all w-full text-left ${activeView === 'orders' ? 'bg-primary/10 text-[#0d1b10] border border-primary/20' : 'text-gray-500 hover:text-[#0d1b10] hover:bg-surface-light'}`}
          >
            <span className={`material-symbols-outlined text-[22px] ${activeView === 'orders' ? 'text-primary' : ''}`}>package_2</span>
            <span className="text-sm">Đơn hàng của tôi</span>
          </button>
          
          {!isGoogleUser && (
            <button 
              onClick={() => setShowPasswordModal(true)} 
              className="w-full flex items-center gap-3 rounded-xl px-5 py-4 text-gray-500 hover:text-[#0d1b10] hover:bg-surface-light transition-all font-medium text-left"
            >
              <span className="material-symbols-outlined text-[22px]">lock_reset</span>
              <span className="text-sm">Đổi mật khẩu</span>
            </button>
          )}
        </nav>
      </aside>

      <section className="flex flex-1 flex-col gap-8">
        
        {activeView === 'overview' && (
          <>
            <div className="rounded-3xl bg-white border border-gray-100 p-8 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-6 md:gap-8">
                  <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-primary/10 text-primary flex items-center justify-center text-4xl font-black uppercase ring-4 ring-surface-light">
                    {user?.name?.charAt(0) || "C"}
                  </div>
                  <div>
                    <h2 className="text-2xl md:text-3xl font-black text-[#0d1b10]">{user?.name || "Khách hàng"}</h2>
                    <p className="mt-2 text-gray-500 font-medium text-sm">{user?.email || "customer@teavault.com"}</p>
                  </div>
                </div>
                
                <Link to="/profile/edit" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-8 py-3 text-sm font-bold text-[#0d1b10] hover:border-primary hover:bg-primary/5 transition-all mt-4 md:mt-0 whitespace-nowrap">
                  Chỉnh sửa hồ sơ
                </Link>
              </div>

              <div className="mt-12 grid grid-cols-1 gap-12 md:grid-cols-2 pt-10 border-t border-gray-100">
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Thông tin cá nhân</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Họ và tên</label>
                      <p className="text-base font-bold text-[#0d1b10] group-hover:text-primary transition-colors">{user?.name || "Khách hàng"}</p>
                    </div>
                    <div className="group">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block">Số điện thoại</label>
                      <p className="text-base font-bold text-[#0d1b10] group-hover:text-primary transition-colors">+84 987 654 321</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">Địa chỉ giao hàng</h3>
                    <button onClick={() => setShowAddressModal(true)} className="text-xs font-bold text-primary hover:underline">Thêm mới</button>
                  </div>
                  {loadingAddresses ? (
                    <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-500">Đang tải địa chỉ...</div>
                  ) : addresses.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-gray-200 bg-white p-4 text-sm text-gray-500">Bạn chưa có địa chỉ giao hàng.</div>
                  ) : (
                    <div className="space-y-3">
                      {addresses.map((address) => (
                        <div key={address.id} className={`rounded-xl border p-4 relative group transition-colors ${address.isDefault ? 'border-primary/20 bg-primary/5 hover:border-primary' : 'border-gray-200 bg-white hover:border-primary/30'}`}>
                          {address.isDefault && (
                            <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest text-primary bg-white px-2 py-1 rounded-md shadow-sm">Mặc định</span>
                          )}
                          <p className="font-bold text-[#0d1b10] mb-1">{address.fullName} • {address.phone}</p>
                          <p className="text-sm text-gray-600 leading-relaxed">{address.addressLine}, {address.ward}, {address.district}, {address.city}</p>
                          <div className="mt-4 flex gap-3 relative z-10">
                            <button onClick={() => handleDeleteAddress(address.id)} className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors disabled:opacity-60" disabled={deletingAddressId === address.id}>{deletingAddressId === address.id ? 'Đang xóa...' : 'Xóa'}</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-3xl bg-white border border-gray-100 p-8 md:p-10 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black text-[#0d1b10]">Hoạt động gần đây</h3>
                <button onClick={() => setActiveView('orders')} className="text-xs font-bold uppercase tracking-widest text-primary hover:underline transition-all">Xem lịch sử</button>
              </div>
              <div className="flex flex-col">
                {loadingOrders && (
                  <p className="text-sm text-gray-500">Đang tải đơn hàng...</p>
                )}
                {!loadingOrders && recentOrders.length === 0 && (
                  <p className="text-sm text-gray-500">Bạn chưa có đơn hàng nào.</p>
                )}
                {!loadingOrders && recentOrders.map((order, index) => {
                  const statusMeta = mapOrderStatus(order?.status);
                  const transaction = transactionsByOrderId.get(order?.id);
                  const txStatusMeta = mapTransactionStatus(transaction?.status);
                  return (
                    <div key={order?.id || index} className={`flex items-center justify-between py-5 ${index === 0 ? 'border-b border-gray-100' : ''}`}>
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-surface-light flex items-center justify-center text-[#0d1b10]">
                          <span className="material-symbols-outlined text-2xl">shopping_bag</span>
                        </div>
                        <div>
                          <p className="text-base font-bold text-[#0d1b10]">#{order?.orderCode}</p>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{formatDateTime(order?.orderDate)}</p>
                          {transaction?.transactionCode && (
                            <p className="text-xs text-gray-400 mt-0.5">Mã GD: {transaction.transactionCode}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-base font-bold text-[#0d1b10]">{formatVnd(order?.totalPrice)}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest mt-1 block ${statusMeta.color}`}>{statusMeta.label}</span>
                        {transaction && (
                          <span className={`text-[10px] font-black uppercase tracking-widest mt-1 block ${txStatusMeta.color}`}>{txStatusMeta.label}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {loadingTransactions && !loadingOrders && (
                  <p className="text-xs text-gray-400 mt-3">Đang tải thông tin thanh toán...</p>
                )}
              </div>
            </div>
          </>
        )}

        {activeView === 'orders' && (
          <div className="rounded-3xl bg-white border border-gray-100 p-8 md:p-10 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-[#0d1b10] mb-2">Lịch sử đơn hàng</h2>
            <p className="text-sm text-gray-500 mb-8">Theo dõi và quản lý các lần mua trước đây.</p>
            
            <div className="space-y-4">
              {loadingOrders && (
                <p className="text-sm text-gray-500">Đang tải đơn hàng...</p>
              )}
              {!loadingOrders && orders.length === 0 && (
                <p className="text-sm text-gray-500">Bạn chưa có đơn hàng nào.</p>
              )}
              {!loadingOrders && orders.map((order) => {
                const statusMeta = mapOrderStatus(order?.status);
                const transaction = transactionsByOrderId.get(order?.id);
                const txStatusMeta = mapTransactionStatus(transaction?.status);
                const itemSummary = Array.isArray(order?.items) && order.items.length > 0
                  ? `${order.items[0].productName} (${order.items[0].gram}g)`
                  : 'Không có sản phẩm';

                return (
                <div key={order?.id} className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-2xl border border-gray-100 hover:border-primary/30 transition-colors gap-4">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-surface-light flex items-center justify-center text-[#0d1b10] shrink-0">
                      <span className="material-symbols-outlined text-2xl">local_shipping</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-base font-black text-[#0d1b10]">#{order?.orderCode}</p>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${statusMeta.color}`}>{statusMeta.label}</span>
                        {transaction && (
                          <span className={`text-[10px] font-black uppercase tracking-widest ${txStatusMeta.color}`}>{txStatusMeta.label}</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-600 mt-1">{itemSummary}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDateTime(order?.orderDate)}</p>
                      {transaction?.transactionCode && (
                        <p className="text-xs text-gray-400 mt-1">Mã giao dịch: {transaction.transactionCode}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-2 border-t md:border-none border-gray-100 pt-4 md:pt-0">
                    <p className="text-lg font-black text-[#0d1b10]">{formatVnd(order?.totalPrice)}</p>
                    <button onClick={() => handleViewOrder(order?.orderCode)} className="text-xs font-bold text-primary hover:underline">Xem hóa đơn</button>
                  </div>
                </div>
              )})}
            </div>
          </div>
        )}

      </section>
    </div>
  );
};

export default ProfileOverview;