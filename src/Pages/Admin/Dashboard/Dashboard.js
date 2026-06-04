import React, { useEffect, useMemo, useState } from 'react';
import {
  getAdminDashboardRevenueApi,
  getAdminDashboardSummaryApi,
  getAdminDashboardTransactionsApi,
} from '../../../services/adminDashboardApi';

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`;

const mapTransactionStatus = (statusCode) => {
  switch (Number(statusCode)) {
    case 0:
      return {
        label: 'Chờ xử lý',
        color: 'bg-orange-100 text-orange-800',
      };
    case 1:
      return {
        label: 'Đang xử lý',
        color: 'bg-blue-100 text-blue-800',
      };
    case 2:
      return {
        label: 'Hoàn tất',
        color: 'bg-green-100 text-green-800',
      };
    default:
      return {
        label: 'Khác',
        color: 'bg-slate-100 text-slate-700',
      };
  }
};

const toLabel = (item, index) => {
  const fallback = `Mốc ${index + 1}`;
  const raw = item?.label || item?.name || item?.period || item?.date || item?.day;
  if (!raw) {
    return fallback;
  }

  const date = new Date(raw);
  if (!Number.isNaN(date.getTime())) {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  return String(raw);
};

const Dashboard = () => {
  const [summary, setSummary] = useState({
    salesRevenue: 0,
    processingOrders: 0,
    lowStockProducts: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [revenueType, setRevenueType] = useState('week');
  const [revenueData, setRevenueData] = useState([]);

  const [loadingSummary, setLoadingSummary] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingRevenue, setLoadingRevenue] = useState(true);

  const [summaryError, setSummaryError] = useState('');
  const [transactionsError, setTransactionsError] = useState('');
  const [revenueError, setRevenueError] = useState('');

  useEffect(() => {
    const loadSummary = async () => {
      try {
        setLoadingSummary(true);
        setSummaryError('');
        const response = await getAdminDashboardSummaryApi();
        const data = response?.data || {};
        setSummary({
          salesRevenue: Number(data?.salesRevenue || 0),
          processingOrders: Number(data?.processingOrders || 0),
          lowStockProducts: Number(data?.lowStockProducts || 0),
        });
      } catch (error) {
        setSummaryError(error?.message || 'Không tải được tổng quan dashboard.');
      } finally {
        setLoadingSummary(false);
      }
    };

    const loadTransactions = async () => {
      try {
        setLoadingTransactions(true);
        setTransactionsError('');
        const response = await getAdminDashboardTransactionsApi();
        setTransactions(response?.data || []);
      } catch (error) {
        setTransactionsError(error?.message || 'Không tải được giao dịch gần đây.');
      } finally {
        setLoadingTransactions(false);
      }
    };

    loadSummary();
    loadTransactions();
  }, []);

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        setLoadingRevenue(true);
        setRevenueError('');
        const response = await getAdminDashboardRevenueApi({ type: revenueType });
        setRevenueData(response?.data || []);
      } catch (error) {
        setRevenueError(error?.message || 'Không tải được dữ liệu doanh thu.');
      } finally {
        setLoadingRevenue(false);
      }
    };

    loadRevenue();
  }, [revenueType]);

  const revenueBars = useMemo(() => {
    const mapped = (revenueData || []).map((item, index) => {
      const amount = Number(
        item?.amount ?? item?.revenue ?? item?.value ?? item?.total ?? item?.salesRevenue ?? 0,
      );

      return {
        label: toLabel(item, index),
        amount,
      };
    });

    const maxAmount = Math.max(...mapped.map((item) => item.amount), 0);

    return mapped.map((item) => ({
      ...item,
      percent: maxAmount > 0 ? Math.max(6, Math.round((item.amount / maxAmount) * 100)) : 0,
    }));
  }, [revenueData]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 text-[#102213] min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black tracking-tight text-[#102213]">Tổng quan hệ thống</h2>
            <p className="text-gray-500 mt-1">Bảng điều khiển quản trị & phân tích TeaVault.</p>
          </div>
        </div>

        {summaryError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {summaryError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <span className="material-symbols-outlined">payments</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Doanh thu</p>
            <h3 className="text-2xl font-bold mt-1">
              {loadingSummary ? '...' : formatVnd(summary.salesRevenue)}
            </h3>
          </div>

          <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <span className="material-symbols-outlined">receipt_long</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Đơn đang xử lý</p>
            <h3 className="text-2xl font-bold mt-1">
              {loadingSummary ? '...' : summary.processingOrders}
            </h3>
          </div>

          <div className="p-6 rounded-xl bg-white border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
            </div>
            <p className="text-sm font-medium text-gray-500">Sản phẩm sắp hết</p>
            <h3 className="text-2xl font-bold mt-1">
              {loadingSummary ? '...' : summary.lowStockProducts}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col rounded-xl bg-white border border-gray-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-bold text-lg">Doanh thu theo kỳ</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-gray-500">
                    {revenueType === 'week' ? 'Đang xem theo tuần' : 'Đang xem theo tháng'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRevenueType('week')}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    revenueType === 'week' ? 'bg-gray-100' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Tuần
                </button>
                <button
                  type="button"
                  onClick={() => setRevenueType('month')}
                  className={`px-3 py-1 text-sm font-medium rounded-lg transition-colors ${
                    revenueType === 'month' ? 'bg-gray-100' : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  Tháng
                </button>
              </div>
            </div>

            {loadingRevenue && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Đang tải dữ liệu doanh thu...
              </div>
            )}

            {!loadingRevenue && revenueError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {revenueError}
              </div>
            )}

            {!loadingRevenue && !revenueError && revenueBars.length === 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                Chưa có dữ liệu doanh thu cho kỳ này.
              </div>
            )}

            {!loadingRevenue && !revenueError && revenueBars.length > 0 && (
              <div className="space-y-4">
                {revenueBars.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-700">{item.label}</span>
                      <span className="font-bold text-slate-900">{formatVnd(item.amount)}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col rounded-xl bg-white border border-gray-100 shadow-sm p-6">
              <h3 className="font-bold text-lg mb-6">Tổng kết nhanh</h3>
              <div className="space-y-4">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Doanh thu hiện tại</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {loadingSummary ? '...' : formatVnd(summary.salesRevenue)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Đơn đang xử lý</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {loadingSummary ? '...' : summary.processingOrders}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-xs font-medium text-slate-500">Sản phẩm sắp hết</p>
                  <p className="text-lg font-bold text-slate-900 mt-1">
                    {loadingSummary ? '...' : summary.lowStockProducts}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-xl bg-white border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-lg">Giao dịch gần đây</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Mã đơn</th>
                  <th className="px-6 py-4">Khách hàng</th>
                  <th className="px-6 py-4">Ngày</th>
                  <th className="px-6 py-4">Số tiền</th>
                  <th className="px-6 py-4">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loadingTransactions && (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-slate-500 font-medium">
                      Đang tải giao dịch...
                    </td>
                  </tr>
                )}

                {!loadingTransactions && transactionsError && (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-red-600 font-medium">
                      {transactionsError}
                    </td>
                  </tr>
                )}

                {!loadingTransactions && !transactionsError && transactions.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-slate-500 font-medium">
                      Chưa có giao dịch nào.
                    </td>
                  </tr>
                )}

                {!loadingTransactions && !transactionsError && transactions.map((transaction) => {
                  const status = mapTransactionStatus(transaction?.status);
                  const date = new Date(transaction?.date || '');
                  const displayDate = Number.isNaN(date.getTime())
                    ? 'Không rõ'
                    : date.toLocaleString('vi-VN');

                  return (
                    <tr key={String(transaction?.orderCode)} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium">#{transaction?.orderCode}</td>
                      <td className="px-6 py-4 font-medium">{transaction?.customer || 'Khách lẻ'}</td>
                      <td className="px-6 py-4 text-gray-500">{displayDate}</td>
                      <td className="px-6 py-4 font-bold">{formatVnd(transaction?.amount)}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
