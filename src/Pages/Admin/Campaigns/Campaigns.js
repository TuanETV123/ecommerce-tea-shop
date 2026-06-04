import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  createAdminBannerApi,
  deleteAdminBannerApi,
  getAdminBannersApi,
  updateAdminBannerApi,
} from '../../../services/adminBannerApi';

const formatDateForInput = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
};

const formatDateDisplay = (value) => {
  if (!value) {
    return 'Chưa cập nhật';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Chưa cập nhật';
  }

  return date.toLocaleDateString('vi-VN');
};

const emptyForm = {
  redirectUrl: '/shop',
  displayOrder: 1,
  startDate: '',
  endDate: '',
  isActive: true,
  imageFile: null,
};

const Campaigns = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const loadBanners = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await getAdminBannersApi();
      setBanners(response?.data || []);
    } catch (apiError) {
      setError(apiError?.message || 'Không thể tải danh sách banner.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const history = useMemo(() => {
    return [...banners]
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .map((item, index) => ({
        id: `#BAN-${String(index + 1).padStart(3, '0')}`,
        title: item.redirectUrl || '/shop',
        duration: `${formatDateDisplay(item.startDate)} - ${formatDateDisplay(item.endDate)}`,
        owner: 'Admin',
        status: item.isDeleted ? 'Đã xóa' : item.isActive ? 'Đang hiển thị' : 'Tạm ẩn',
      }));
  }, [banners]);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingBanner(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (banner) => {
    setEditingBanner(banner);
    setFormData({
      redirectUrl: banner?.redirectUrl || '/shop',
      displayOrder: Number(banner?.displayOrder || 1),
      startDate: formatDateForInput(banner?.startDate),
      endDate: formatDateForInput(banner?.endDate),
      isActive: Boolean(banner?.isActive),
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.redirectUrl) {
      toast.warning('Vui lòng nhập RedirectUrl.');
      return;
    }

    if (!formData.startDate || !formData.endDate) {
      toast.warning('Vui lòng chọn StartDate và EndDate.');
      return;
    }

    if (!editingBanner && !formData.imageFile) {
      toast.warning('Banner mới cần có ảnh.');
      return;
    }

    try {
      setSubmitting(true);

      if (editingBanner?.id) {
        await updateAdminBannerApi({
          bannerId: editingBanner.id,
          imageFile: formData.imageFile,
          redirectUrl: formData.redirectUrl,
          displayOrder: formData.displayOrder,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isActive: formData.isActive,
        });
        toast.success('Cập nhật banner thành công.');
      } else {
        await createAdminBannerApi({
          imageFile: formData.imageFile,
          redirectUrl: formData.redirectUrl,
          displayOrder: formData.displayOrder,
          startDate: formData.startDate,
          endDate: formData.endDate,
        });
        toast.success('Tạo banner thành công.');
      }

      await loadBanners();
      handleCloseModal();
    } catch (apiError) {
      toast.error(apiError?.message || 'Không thể lưu banner.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (banner) => {
    if (!banner?.id) {
      return;
    }

    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa banner này?');
    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminBannerApi(banner.id);
      setBanners((prev) => prev.filter((item) => item.id !== banner.id));
      toast.success('Xóa banner thành công.');
    } catch (apiError) {
      toast.error(apiError?.message || 'Không thể xóa banner.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 text-slate-900 min-h-screen">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">edit</span>
                {editingBanner ? 'Cập nhật banner' : 'Tạo banner mới'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-4 mb-6">
              <input
                value={formData.redirectUrl}
                onChange={(e) => setFormData((prev) => ({ ...prev, redirectUrl: e.target.value }))}
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                placeholder="RedirectUrl (vd: /shop)"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="number"
                  min="1"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      displayOrder: Number(e.target.value || 1),
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                  placeholder="DisplayOrder"
                />
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))}
                  />
                  <span>IsActive</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                  placeholder="StartDate"
                />
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                  placeholder="EndDate"
                />
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      imageFile: e.target.files?.[0] || null,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm"
                />
                <p className="mt-2 text-xs text-slate-500">
                  {editingBanner
                    ? 'Cập nhật ảnh nếu muốn thay đổi banner image.'
                    : 'Banner mới bắt buộc phải có image.'}
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleCloseModal} className="flex-1 py-2.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm">
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm disabled:opacity-60"
              >
                {submitting ? 'Đang xử lý...' : 'Lưu banner'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Banner trang chủ</h1>
            <p className="mt-1 text-slate-500">Quản lý banner bằng API admin.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo banner
          </button>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Đang tải danh sách banner...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {!loading && !error && banners.map((banner) => (
            <div key={banner.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
              <div className="aspect-video bg-slate-100">
                <img src={banner.imageUrl} alt={banner.redirectUrl} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex flex-col gap-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  Thứ tự #{banner.displayOrder}
                </p>
                <h3 className="text-lg font-black text-slate-900 line-clamp-2">{banner.redirectUrl || '/shop'}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                  {formatDateDisplay(banner.startDate)} - {formatDateDisplay(banner.endDate)}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{banner.isActive ? 'Đang hiển thị' : 'Tạm ẩn'}</span>
                  <span className="font-bold text-blue-600">{formatDateDisplay(banner.updatedAt || banner.createdAt)}</span>
                </div>
                <div className="mt-1 flex items-center gap-3">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="inline-flex items-center gap-1 text-sm font-bold text-blue-600"
                  >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Chỉnh sửa
                  </button>
                  <button
                    onClick={() => handleDelete(banner)}
                    className="inline-flex items-center gap-1 text-sm font-bold text-red-600"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!loading && !error && banners.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
              Chưa có banner nào. Bấm "Tạo banner" để thêm mới.
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-600">history</span>
              Lịch sử banner
            </h2>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Gần đây</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Mã</th>
                  <th className="px-6 py-3">Tiêu đề</th>
                  <th className="px-6 py-3">Thời gian chạy</th>
                  <th className="px-6 py-3">Phụ trách</th>
                  <th className="px-6 py-3">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-mono text-sm font-bold text-slate-700">{item.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-900">{item.title}</td>
                    <td className="px-6 py-4 text-slate-500">{item.duration}</td>
                    <td className="px-6 py-4 text-slate-500">{item.owner}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
