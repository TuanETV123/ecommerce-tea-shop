import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  blockAdminUserApi,
  getAdminUserDetailApi,
  getAdminUserReviewsApi,
  getAdminUserStatsApi,
  getAdminUsersApi,
  unblockAdminUserApi,
} from '../../../services/adminUserApi';

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`;

const normalizeStatus = (status) => String(status || '').toLowerCase();

const isBlockedStatus = (status) => {
  const normalized = normalizeStatus(status);
  return normalized === 'blocked' || normalized === 'inactive' || normalized === 'locked';
};

const mapStatusLabel = (status) => (isBlockedStatus(status) ? 'Đã khóa' : 'Hoạt động');

const formatCreatedAt = (createdAt) => {
  if (!createdAt || String(createdAt).startsWith('0001-01-01')) {
    return 'Chưa cập nhật';
  }

  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return 'Chưa cập nhật';
  }

  return date.toLocaleString('vi-VN');
};

const USERS_TAB = 'Danh sách người dùng';
const REVIEWS_TAB = 'Đánh giá sản phẩm';
const PAGE_SIZE = 10;

const normalizeReviewStatus = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized.includes('approve') || normalized.includes('duyet')) {
    return 'Đã duyệt';
  }
  if (normalized.includes('reject') || normalized.includes('tu choi')) {
    return 'Từ chối';
  }
  return 'Chờ duyệt';
};

const Customers = () => {
  const [activeTab, setActiveTab] = useState(USERS_TAB);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);

  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingReviews: 0,
    avgRating: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  const [users, setUsers] = useState([]);
  const [usersPaging, setUsersPaging] = useState({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
  });
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingCustomerDetail, setLoadingCustomerDetail] = useState(false);
  const [userActionLoadingId, setUserActionLoadingId] = useState('');
  const [userError, setUserError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewsPaging, setReviewsPaging] = useState({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
  });
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const loadUsers = async (pageNumber = 1) => {
    try {
      setLoadingUsers(true);
      setUserError('');
      const response = await getAdminUsersApi({ pageNumber, pageSize: PAGE_SIZE });

      const pagination = response?.data || {};
      setUsersPaging({
        pageNumber: Number(pagination?.pageNumber || pageNumber),
        pageSize: Number(pagination?.pageSize || PAGE_SIZE),
        totalItems: Number(pagination?.totalItems || 0),
        totalPages: Number(pagination?.totalPages || 0),
      });

      const mappedUsers = (pagination?.items || []).map((item) => ({
        id: item?.id || '',
        name: item?.name || 'Không tên',
        email: item?.email || '',
        orders: Number(item?.totalOrders || 0),
        lifetimeValue: Number(item?.lifetimeValue || 0),
        status: item?.status || 'Active',
      }));

      setUsers(mappedUsers);
    } catch (error) {
      setUserError(error?.message || 'Không tải được danh sách người dùng.');
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadStats = async () => {
    try {
      setLoadingStats(true);
      const response = await getAdminUserStatsApi();
      const data = response?.data || {};
      setStats({
        totalUsers: Number(data?.totalUsers || 0),
        pendingReviews: Number(data?.pendingReviews || 0),
        avgRating: Number(data?.avgRating || 0),
      });
    } catch (error) {
      toast.error(error?.message || 'Không tải được thống kê người dùng.');
    } finally {
      setLoadingStats(false);
    }
  };

  const loadReviews = async (pageNumber = 1) => {
    try {
      setLoadingReviews(true);
      setReviewError('');

      const response = await getAdminUserReviewsApi({
        pageNumber,
        pageSize: PAGE_SIZE,
      });
      const pagination = response?.data || {};

      setReviewsPaging({
        pageNumber: Number(pagination?.pageNumber || pageNumber),
        pageSize: Number(pagination?.pageSize || PAGE_SIZE),
        totalItems: Number(pagination?.totalItems || 0),
        totalPages: Number(pagination?.totalPages || 0),
      });

      const mapped = (pagination?.items || []).map((item, index) => ({
        id: item?.id || item?.reviewId || `review-${pageNumber}-${index}`,
        product: item?.productName || item?.product || item?.productTitle || 'Sản phẩm',
        customer: item?.customerName || item?.customer || item?.userName || item?.email || 'Người dùng',
        rating: Number(item?.rating || 0),
        text: item?.comment || item?.content || item?.text || '',
        status: normalizeReviewStatus(item?.status),
      }));

      setReviews(mapped);
    } catch (error) {
      setReviewError(error?.message || 'Không tải được danh sách đánh giá.');
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadStats();
    loadUsers(1);
  }, []);

  useEffect(() => {
    if (activeTab === REVIEWS_TAB) {
      loadReviews(reviewsPaging.pageNumber);
    }
  }, [activeTab, reviewsPaging.pageNumber]);

  const filteredCustomers = useMemo(() => {
    return users.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, users]);

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => 
      r.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
      r.customer.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, reviews]);

  const userSummary = useMemo(() => {
    const totalUsers = stats.totalUsers || usersPaging.totalItems || users.length;
    const activeUsers = users.filter((item) => !isBlockedStatus(item.status)).length;
    const blockedUsers = users.filter((item) => isBlockedStatus(item.status)).length;
    const totalLifetimeValue = users.reduce(
      (sum, item) => sum + Number(item.lifetimeValue || 0),
      0,
    );

    return {
      totalUsers,
      activeUsers,
      blockedUsers,
      totalLifetimeValue,
    };
  }, [users]);

  const handleUsersPageChange = (nextPage) => {
    const totalPages = Number(usersPaging.totalPages || 0);
    if (nextPage < 1 || (totalPages > 0 && nextPage > totalPages)) {
      return;
    }
    loadUsers(nextPage);
  };

  const handleReviewsPageChange = (nextPage) => {
    const totalPages = Number(reviewsPaging.totalPages || 0);
    if (nextPage < 1 || (totalPages > 0 && nextPage > totalPages)) {
      return;
    }
    setReviewsPaging((prev) => ({
      ...prev,
      pageNumber: nextPage,
    }));
  };

  const openCustomerProfile = async (customer) => {
    if (!customer?.id) {
      return;
    }

    setSelectedCustomer({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      orders: customer.orders,
      lifetimeValue: customer.lifetimeValue,
      status: customer.status,
      phone: null,
      createdAt: null,
      loadingDetail: true,
    });

    try {
      setLoadingCustomerDetail(true);
      const response = await getAdminUserDetailApi(customer.id);
      const detail = response?.data || {};

      setSelectedCustomer((prev) => ({
        ...(prev || {}),
        id: detail?.id || customer.id,
        name: detail?.fullName || customer.name,
        email: detail?.email || customer.email,
        orders: Number(detail?.totalOrders ?? customer.orders ?? 0),
        lifetimeValue: Number(customer.lifetimeValue || 0),
        status: detail?.status || customer.status,
        phone: detail?.phone || null,
        createdAt: detail?.createdAt || null,
        loadingDetail: false,
      }));
    } catch (error) {
      setSelectedCustomer((prev) => ({
        ...(prev || {}),
        loadingDetail: false,
      }));
      toast.error(error?.message || 'Không tải được chi tiết người dùng.');
    } finally {
      setLoadingCustomerDetail(false);
    }
  };

  const handleToggleUserBlock = async (customer) => {
    if (!customer?.id) {
      return;
    }

    const blocked = isBlockedStatus(customer.status);

    try {
      setUserActionLoadingId(customer.id);
      if (blocked) {
        await unblockAdminUserApi(customer.id);
      } else {
        await blockAdminUserApi(customer.id);
      }

      const nextStatus = blocked ? 'Active' : 'Blocked';

      setUsers((prev) =>
        prev.map((item) =>
          item.id === customer.id
            ? {
                ...item,
                status: nextStatus,
              }
            : item,
        ),
      );

      setSelectedCustomer((prev) => {
        if (!prev || prev.id !== customer.id) {
          return prev;
        }

        return {
          ...prev,
          status: nextStatus,
        };
      });

      toast.success(blocked ? 'Đã mở khóa tài khoản.' : 'Đã khóa tài khoản.');
      loadStats();
    } catch (error) {
      toast.error(error?.message || 'Không thể cập nhật trạng thái tài khoản.');
    } finally {
      setUserActionLoadingId('');
    }
  };

  return (
    <div className="flex-1 overflow-y-scroll p-4 md:p-8 bg-gray-50 text-slate-900 min-h-screen relative">
      
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-black text-xl">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-sm text-slate-500">{selectedCustomer.email}</p>
                  <p className="text-xs text-slate-500 mt-1">Trạng thái: {mapStatusLabel(selectedCustomer.status)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {selectedCustomer.loadingDetail && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 mb-4">
                Đang tải chi tiết người dùng...
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tổng đơn</p>
                <p className="text-2xl font-black text-slate-900">{selectedCustomer.orders}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Tổng chi</p>
                <p className="text-2xl font-black text-blue-600">{formatVnd(selectedCustomer.lifetimeValue)}</p>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Số điện thoại</span>
                <span className="font-bold text-slate-900">{selectedCustomer.phone || 'Chưa cập nhật'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-medium">Ngày tạo</span>
                <span className="font-bold text-slate-900">{formatCreatedAt(selectedCustomer.createdAt)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedCustomer(null)} 
                className="flex-1 py-2.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Đóng hồ sơ
              </button>
              <button 
                onClick={() => {
                  handleToggleUserBlock(selectedCustomer);
                }} 
                disabled={userActionLoadingId === selectedCustomer.id || loadingCustomerDetail}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
              >
                {isBlockedStatus(selectedCustomer.status) ? 'Mở khóa' : 'Khóa tài khoản'}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">rate_review</span>
                Duyệt đánh giá
              </h3>
              <button onClick={() => setSelectedReview(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 mb-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="text-sm font-bold text-slate-900">{selectedReview.product}</p>
                  <p className="text-xs text-slate-500">Bởi {selectedReview.customer}</p>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < selectedReview.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-700 italic">"{selectedReview.text}"</p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Phản hồi chính thức</label>
                <textarea 
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm resize-none" 
                  rows="3" 
                  placeholder="Viết phản hồi công khai cho khách hàng..."
                ></textarea>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => {
                  alert("Đã gắn cờ xóa đánh giá.");
                  setSelectedReview(null);
                }} 
                className="px-4 py-2.5 rounded-lg bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors"
              >
                Gắn cờ
              </button>
              <div className="flex-1 flex gap-3">
                <button 
                  onClick={() => setSelectedReview(null)} 
                  className="flex-1 py-2.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
                >
                  Hủy
                </button>
                <button 
                  onClick={() => {
                    alert("Đang mô phỏng duyệt đánh giá và đăng phản hồi...");
                    setSelectedReview(null);
                  }} 
                  className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
                >
                  Duyệt & phản hồi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Người dùng & đánh giá</h1>
            <p className="mt-1 text-slate-500">Quản lý tài khoản, theo dõi giá trị vòng đời và duyệt phản hồi công khai.</p>
          </div>
          <div className="flex items-center gap-3"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Tổng người dùng</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">
              {loadingStats ? '...' : userSummary.totalUsers}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Đánh giá chờ duyệt</p>
            <h3 className="text-2xl font-bold text-orange-600 mt-2">
              {loadingStats ? '...' : stats.pendingReviews}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Điểm trung bình</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-2">
              {loadingStats ? '...' : `${stats.avgRating.toFixed(1)} / 5`}
            </h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Người dùng đã khóa (trang hiện tại)</p>
            <h3 className="text-2xl font-bold text-red-600 mt-2">{userSummary.blockedUsers}</h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {[USERS_TAB, REVIEWS_TAB].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="relative group w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="material-symbols-outlined text-slate-400 group-focus-within:text-blue-600 transition-colors">search</span>
            </div>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border-none ring-1 ring-slate-200 rounded-lg bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" 
              placeholder={`Tìm ${activeTab === USERS_TAB ? 'tên hoặc email' : 'sản phẩm hoặc đánh giá'}...`} 
              type="text"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            {activeTab === USERS_TAB ? (
              <table className="w-full text-left border-collapse table-fixed min-w-[900px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 pl-6 text-sm font-semibold text-slate-600 w-[15%]">Mã người dùng</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 w-[25%]">Thông tin</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 w-[15%]">Tổng đơn</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 w-[15%]">Giá trị vòng đời</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 w-[15%]">Trạng thái</th>
                    <th className="p-4 pr-6 text-sm font-semibold text-slate-600 w-[15%] text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingUsers && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                        Đang tải danh sách người dùng...
                      </td>
                    </tr>
                  )}

                  {!loadingUsers && userError && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-red-600 font-medium">
                        {userError}
                      </td>
                    </tr>
                  )}

                  {!loadingUsers && !userError && filteredCustomers.map((customer, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 truncate">
                        <span className="font-mono font-bold text-slate-500">{customer.id}</span>
                      </td>
                      <td className="p-4 truncate">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 truncate">{customer.name}</span>
                          <span className="text-xs font-medium text-slate-500 truncate">{customer.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-900 truncate">{customer.orders}</td>
                      <td className="p-4 text-sm font-bold text-blue-600 truncate">{formatVnd(customer.lifetimeValue)}</td>
                      <td className="p-4 truncate">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isBlockedStatus(customer.status)
                            ? 'bg-red-100 text-red-800 border-red-200'
                            : 'bg-green-100 text-green-800 border-green-200'
                        }`}>
                          {mapStatusLabel(customer.status)}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button
                          onClick={() => openCustomerProfile(customer)}
                          className="text-blue-600 hover:bg-blue-50 transition-colors px-3 py-1.5 rounded-md text-xs font-bold border border-slate-200 hover:border-blue-200"
                        >
                          Xem hồ sơ
                        </button>
                        <button
                          onClick={() => handleToggleUserBlock(customer)}
                          disabled={userActionLoadingId === customer.id}
                          className="ml-2 text-red-600 hover:bg-red-50 transition-colors px-3 py-1.5 rounded-md text-xs font-bold border border-slate-200 hover:border-red-200 disabled:opacity-60"
                        >
                          {isBlockedStatus(customer.status) ? 'Mở khóa' : 'Khóa'}
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loadingUsers && !userError && filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                        Không tìm thấy người dùng phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 pl-6 text-sm font-semibold text-slate-600 w-[10%]">Mã đánh giá</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 w-[20%]">Sản phẩm</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 w-[30%]">Phản hồi</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 w-[15%]">Điểm</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 w-[10%]">Trạng thái</th>
                    <th className="p-4 pr-6 text-sm font-semibold text-slate-600 w-[15%] text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingReviews && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                        Đang tải danh sách đánh giá...
                      </td>
                    </tr>
                  )}

                  {!loadingReviews && reviewError && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-red-600 font-medium">
                        {reviewError}
                      </td>
                    </tr>
                  )}

                  {!loadingReviews && !reviewError && filteredReviews.map((review, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 truncate">
                        <span className="font-mono font-bold text-slate-500">{review.id}</span>
                      </td>
                      <td className="p-4 truncate">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 truncate">{review.product}</span>
                          <span className="text-xs font-medium text-slate-500 truncate">Bởi {review.customer}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-600 truncate italic">
                        "{review.text}"
                      </td>
                      <td className="p-4 truncate">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 truncate">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          review.status === 'Đã duyệt' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-orange-100 text-orange-800 border-orange-200'
                        }`}>
                          {review.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => setSelectedReview(review)}
                          className="text-blue-600 hover:bg-blue-50 transition-colors px-3 py-1.5 rounded-md text-xs font-bold border border-slate-200 hover:border-blue-200"
                        >
                          Duyệt
                        </button>
                      </td>
                    </tr>
                  ))}

                  {!loadingReviews && !reviewError && filteredReviews.length === 0 && (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                        Không có đánh giá nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {activeTab === USERS_TAB && usersPaging.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/50">
              <span className="text-sm text-slate-500 font-medium">
                Trang <span className="font-bold text-slate-900">{usersPaging.pageNumber}</span> / <span className="font-bold text-slate-900">{usersPaging.totalPages}</span> - Tổng <span className="font-bold text-slate-900">{usersPaging.totalItems}</span> người dùng
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleUsersPageChange(usersPaging.pageNumber - 1)}
                  disabled={usersPaging.pageNumber <= 1 || loadingUsers}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                </button>
                <button
                  onClick={() => handleUsersPageChange(usersPaging.pageNumber + 1)}
                  disabled={usersPaging.pageNumber >= usersPaging.totalPages || loadingUsers}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === REVIEWS_TAB && reviewsPaging.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/50">
              <span className="text-sm text-slate-500 font-medium">
                Trang <span className="font-bold text-slate-900">{reviewsPaging.pageNumber}</span> / <span className="font-bold text-slate-900">{reviewsPaging.totalPages}</span> - Tổng <span className="font-bold text-slate-900">{reviewsPaging.totalItems}</span> đánh giá
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleReviewsPageChange(reviewsPaging.pageNumber - 1)}
                  disabled={reviewsPaging.pageNumber <= 1 || loadingReviews}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                </button>
                <button
                  onClick={() => handleReviewsPageChange(reviewsPaging.pageNumber + 1)}
                  disabled={reviewsPaging.pageNumber >= reviewsPaging.totalPages || loadingReviews}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm font-bold">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Customers;
