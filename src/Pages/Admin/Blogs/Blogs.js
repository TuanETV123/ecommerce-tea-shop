import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import {
  createAdminBlogApi,
  deleteAdminBlogApi,
  getAdminBlogsApi,
  updateAdminBlogApi,
} from '../../../services/adminBlogApi';

const PAGE_SIZE = 10;

const formatDateDisplay = (value) => {
  if (!value) {
    return 'Chưa đặt';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Chưa đặt';
  }

  return date.toLocaleDateString('vi-VN');
};

const formatDateInput = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
};

const emptyForm = {
  title: '',
  content: '',
  publishDate: '',
  isPublished: true,
  thumbnail: null,
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState('');
  const [formData, setFormData] = useState(emptyForm);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [paging, setPaging] = useState({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    totalItems: 0,
    totalPages: 0,
  });

  const loadBlogs = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await getAdminBlogsApi({ pageNumber, pageSize: PAGE_SIZE });
      const data = response?.data || {};

      setBlogs(data?.items || []);
      setPaging({
        pageNumber: Number(data?.pageNumber || pageNumber),
        pageSize: Number(data?.pageSize || PAGE_SIZE),
        totalItems: Number(data?.totalItems || 0),
        totalPages: Number(data?.totalPages || 0),
      });
    } catch (apiError) {
      setError(apiError?.message || 'Không tải được danh sách blog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs(1);
  }, []);

  const resetForm = () => {
    setEditingId('');
    setFormData(emptyForm);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const filteredBlogs = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return blogs;
    }

    return blogs.filter((item) => {
      const title = String(item?.title || '').toLowerCase();
      const content = String(item?.content || '').toLowerCase();
      const id = String(item?.id || '').toLowerCase();
      return title.includes(query) || content.includes(query) || id.includes(query);
    });
  }, [blogs, searchQuery]);

  const startEdit = (blog) => {
    const blogId = String(blog?.id || '');

    setEditingId(blogId);
    setFormData({
      title: blog?.title || '',
      content: blog?.content || '',
      publishDate: formatDateInput(blog?.publishDate),
      isPublished: Boolean(blog?.isPublished),
      thumbnail: null,
    });

    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast.warning('Vui lòng nhập tiêu đề blog.');
      return;
    }

    if (!formData.content.trim()) {
      toast.warning('Vui lòng nhập nội dung blog.');
      return;
    }

    if (!editingId && !formData.thumbnail) {
      toast.warning('Blog mới cần có ảnh thumbnail.');
      return;
    }

    try {
      setSubmitting(true);

      if (editingId) {
        await updateAdminBlogApi({
          blogId: editingId,
          title: formData.title.trim(),
          content: formData.content.trim(),
          publishDate: formData.publishDate || undefined,
          isPublished: formData.isPublished,
          thumbnail: formData.thumbnail || undefined,
        });
        toast.success('Cập nhật blog thành công.');
      } else {
        await createAdminBlogApi({
          title: formData.title.trim(),
          content: formData.content.trim(),
          publishDate: formData.publishDate || undefined,
          isPublished: formData.isPublished,
          thumbnail: formData.thumbnail,
        });
        toast.success('Tạo blog thành công.');
      }

      closeModal();
      await loadBlogs(paging.pageNumber || 1);
    } catch (apiError) {
      toast.error(apiError?.message || 'Không thể lưu blog.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (blog) => {
    const blogId = String(blog?.id || '');
    if (!blogId) {
      return;
    }

    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa blog "${blog?.title || ''}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminBlogApi(blogId);
      toast.success('Xóa blog thành công.');

      if (editingId === blogId) {
        resetForm();
      }

      const remainingCount = Math.max(0, Number(paging.totalItems || 0) - 1);
      const nextTotalPages = Math.max(1, Math.ceil(remainingCount / PAGE_SIZE));
      const nextPage = Math.min(paging.pageNumber || 1, nextTotalPages);
      await loadBlogs(nextPage);
    } catch (apiError) {
      toast.error(apiError?.message || 'Không thể xóa blog.');
    }
  };

  const handlePageChange = (nextPage) => {
    const totalPages = Number(paging.totalPages || 0);
    if (nextPage < 1 || (totalPages > 0 && nextPage > totalPages)) {
      return;
    }

    loadBlogs(nextPage);
  };

  return (
    <div className="flex-1 overflow-y-scroll p-4 md:p-8 bg-gray-50 text-slate-900 min-h-screen relative">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">edit_note</span>
                {editingId ? 'Cập nhật blog' : 'Tạo blog mới'}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Tiêu đề</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Ví dụ: Lợi ích trà đối với tim mạch"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nội dung</label>
                <textarea
                  rows={6}
                  value={formData.content}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="Nhập nội dung bài viết..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Ngày xuất bản</label>
                <input
                  type="date"
                  value={formData.publishDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      publishDate: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                <input
                  id="blog-is-published"
                  type="checkbox"
                  checked={formData.isPublished}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isPublished: e.target.checked,
                    }))
                  }
                />
                <label htmlFor="blog-is-published" className="text-sm font-medium text-slate-700">
                  Công khai bài viết
                </label>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Thumbnail</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      thumbnail: e.target.files?.[0] || null,
                    }))
                  }
                  className="block w-full text-sm text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-blue-700 file:font-bold"
                />
                <p className="mt-1 text-xs text-slate-500">
                  {editingId
                    ? 'Có thể bỏ trống nếu không muốn đổi thumbnail.'
                    : 'Blog mới cần có thumbnail.'}
                </p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 disabled:opacity-60"
              >
                {submitting ? 'Đang xử lý...' : editingId ? 'Lưu cập nhật' : 'Tạo blog'}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 text-sm font-bold hover:bg-slate-200"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý blog</h1>
            <p className="mt-1 text-slate-500">Thêm, sửa và xóa bài viết bằng API AdminBlog.</p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo blog mới
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 space-y-3">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border-slate-200 bg-slate-50 pl-10 pr-3 py-2 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Tìm theo tiêu đề, nội dung hoặc id..."
              />
            </div>

            <p className="text-xs text-slate-500">
              Tổng: <span className="font-bold text-slate-700">{paging.totalItems}</span> bài viết
            </p>
          </div>

          {loading && <div className="p-6 text-sm text-slate-500">Đang tải danh sách blog...</div>}

          {!loading && error && <div className="p-6 text-sm text-red-600">{error}</div>}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1080px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="p-4 text-sm font-semibold text-slate-600">Tiêu đề</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Nội dung</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Ngày xuất bản</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Trạng thái</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Thumbnail</th>
                    <th className="p-4 text-sm font-semibold text-slate-600 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBlogs.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-6 text-center text-sm text-slate-500">
                        Không có blog phù hợp.
                      </td>
                    </tr>
                  ) : (
                    filteredBlogs.map((item) => (
                      <tr key={item?.id} className="hover:bg-slate-50 align-top">
                        <td className="p-4">
                          <p className="text-sm font-bold text-slate-900 line-clamp-2">{item?.title || 'Không tên'}</p>
                          <p className="text-[11px] text-slate-400 mt-1 font-mono">ID: {item?.id || '-'}</p>
                        </td>
                        <td className="p-4 text-xs text-slate-600 leading-relaxed max-w-[420px]">
                          <p className="line-clamp-3">{item?.content || '-'}</p>
                        </td>
                        <td className="p-4 text-sm text-slate-600">{formatDateDisplay(item?.publishDate)}</td>
                        <td className="p-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                              item?.isPublished
                                ? 'bg-green-100 text-green-700 border-green-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {item?.isPublished ? 'Đang công khai' : 'Nháp'}
                          </span>
                        </td>
                        <td className="p-4 text-sm text-slate-600">
                          {item?.thumbnail ? (
                            <img
                              src={item.thumbnail}
                              alt={item?.title || 'Thumbnail'}
                              className="h-14 w-24 rounded-md object-cover border border-slate-200"
                            />
                          ) : (
                            '-'
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button
                            type="button"
                            onClick={() => startEdit(item)}
                            className="cursor-pointer text-blue-600 hover:bg-blue-50 transition-colors px-2 py-1 rounded-md text-xs font-bold border border-transparent hover:border-blue-200"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item)}
                            className="cursor-pointer text-red-600 hover:bg-red-50 transition-colors px-2 py-1 rounded-md text-xs font-bold border border-transparent hover:border-red-200"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {!loading && !error && paging.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/50">
              <span className="text-sm text-slate-500 font-medium">
                Trang <span className="font-bold text-slate-900">{paging.pageNumber}</span> /{' '}
                <span className="font-bold text-slate-900">{paging.totalPages}</span>
              </span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(paging.pageNumber - 1)}
                  disabled={paging.pageNumber <= 1 || loading}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                </button>
                <button
                  onClick={() => handlePageChange(paging.pageNumber + 1)}
                  disabled={paging.pageNumber >= paging.totalPages || loading}
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

export default Blogs;
