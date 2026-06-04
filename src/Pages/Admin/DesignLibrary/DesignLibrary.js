import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";

const formatVnd = (value) => `${new Intl.NumberFormat("vi-VN").format(Number(value || 0))} đ`;

const createLocalId = () => `addon-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const addonSeed = [
  {
    id: "addon-seed-01",
    name: "Thiết kế nhãn riêng",
    description: "Thiết kế nhãn theo màu nhận diện thương hiệu của khách hàng.",
    price: 20000,
    imageUrl:
      "https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=600&q=80",
    imageName: "label-design.jpg",
    createdAt: "2026-03-19T09:00:00.000Z",
  },
  {
    id: "addon-seed-02",
    name: "Thiệp cảm ơn",
    description: "In thiệp cảm ơn ngắn kèm đơn hàng tùy chỉnh.",
    price: 10000,
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80",
    imageName: "thankyou-card.jpg",
    createdAt: "2026-03-19T09:05:00.000Z",
  },
  {
    id: "addon-seed-03",
    name: "Hộp quà nâng cấp",
    description: "Đóng gói hộp quà cao cấp cho dịp tặng.",
    price: 35000,
    imageUrl:
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=600&q=80",
    imageName: "gift-box.jpg",
    createdAt: "2026-03-19T09:10:00.000Z",
  },
];

const emptyForm = {
  name: "",
  description: "",
  price: "",
  imageFile: null,
  imageUrl: "",
  imageName: "",
};

const DesignLibrary = () => {
  const [addons, setAddons] = useState(addonSeed);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("Mới nhất");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);

  const resetForm = () => {
    if (formData.imageUrl && formData.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(formData.imageUrl);
    }
    setEditingAddon(null);
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

  const openEditModal = (addon) => {
    setEditingAddon(addon);
    setFormData({
      name: addon?.name || "",
      description: addon?.description || "",
      price: String(Number(addon?.price || 0)),
      imageFile: null,
      imageUrl: addon?.imageUrl || "",
      imageName: addon?.imageName || "",
    });
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setPendingDelete(null);
    setIsDeleteOpen(false);
  };

  const openDeleteModal = (addon) => {
    setPendingDelete(addon);
    setIsDeleteOpen(true);
  };

  const handleSelectImage = (file) => {
    if (!file) {
      return;
    }

    if (formData.imageUrl && formData.imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(formData.imageUrl);
    }

    const nextUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl: nextUrl,
      imageName: file.name || "",
    }));
  };

  const handleSubmit = () => {
    const name = formData.name.trim();
    const description = formData.description.trim();
    const price = Number(formData.price);

    if (!name) {
      toast.warning("Vui lòng nhập Name.");
      return;
    }

    if (!description) {
      toast.warning("Vui lòng nhập Description.");
      return;
    }

    if (!Number.isFinite(price) || price < 0) {
      toast.warning("Price không hợp lệ.");
      return;
    }

    const payload = {
      name,
      description,
      price,
      imageUrl: formData.imageUrl || "",
      imageName: formData.imageName || "",
    };

    if (editingAddon?.id) {
      setAddons((prev) =>
        prev.map((item) =>
          item.id === editingAddon.id
            ? {
                ...item,
                ...payload,
              }
            : item,
        ),
      );
      toast.success("Cập nhật thành công.");
    } else {
      setAddons((prev) => [
        {
          id: createLocalId(),
          ...payload,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
      toast.success("Tạo add-on thành công.");
    }

    closeModal();
  };

  const handleDelete = () => {
    if (!pendingDelete?.id) {
      return;
    }

    setAddons((prev) => prev.filter((item) => item.id !== pendingDelete.id));
    toast.success("Xóa add-on thành công.");
    closeDeleteModal();
  };

  const filteredAddons = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    if (!keyword) {
      return addons;
    }

    return addons.filter((addon) =>
      String(addon?.name || "")
        .toLowerCase()
        .includes(keyword),
    );
  }, [addons, searchQuery]);

  const summary = useMemo(() => {
    const total = addons.length;
    const totalPrice = addons.reduce((sum, item) => sum + Number(item?.price || 0), 0);

    return {
      total,
      totalPrice,
    };
  }, [addons]);

  const displayedAddons = useMemo(() => {
    const result = [...filteredAddons];

    if (sortOption === "Giá cao đến thấp") {
      result.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
    } else if (sortOption === "Giá thấp đến cao") {
      result.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
    } else if (sortOption === "Tên A-Z") {
      result.sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "vi"));
    } else if (sortOption === "Tên Z-A") {
      result.sort((a, b) => String(b.name || "").localeCompare(String(a.name || ""), "vi"));
    } else {
      result.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")));
    }

    return result;
  }, [filteredAddons, sortOption]);

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-50 text-slate-900 min-h-screen relative">
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xl font-bold text-slate-900">
                <span className="material-symbols-outlined text-blue-600">sell</span>
                {editingAddon ? "Cập nhật add-on" : "Tạo add-on"}
              </h3>
              <button
                onClick={closeModal}
                className="text-slate-400 transition-colors hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Name</label>
                <input
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập Name"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-700">Price (VND)</label>
                <input
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập Price"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-slate-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: event.target.value,
                    }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập Description"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-bold text-slate-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleSelectImage(event.target.files?.[0])}
                  className="block w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700"
                />
                {formData.imageName && (
                  <p className="mt-2 text-xs font-medium text-slate-500">{formData.imageName}</p>
                )}
                {formData.imageUrl && (
                  <div className="mt-3 h-32 w-40 overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                    <img
                      src={formData.imageUrl}
                      alt={formData.name || "Preview"}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 rounded-lg bg-slate-100 py-2.5 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 rounded-lg bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700"
              >
                Lưu dữ liệu
              </button>
            </div>
          </div>
        </div>
      )}

      {isDeleteOpen && pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-red-50 text-red-600">
              <span className="material-symbols-outlined">delete</span>
            </div>
            <h3 className="mb-2 text-center text-lg font-bold text-slate-900">Xóa add-on?</h3>
            <p className="mb-6 text-center text-sm text-slate-500">Bản ghi này sẽ bị xóa khỏi danh sách.</p>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 rounded-lg bg-slate-100 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-slate-200"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 rounded-lg bg-red-600 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Thiết kế đặt riêng</h1>
            <p className="mt-1 text-slate-500">
              Quản lý danh sách add-on với 4 trường: Name, Description, Price, Image.
            </p>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Tạo add-on
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Tổng add-on</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{summary.total}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">Tổng giá trị danh mục</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{formatVnd(summary.totalPrice)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="relative max-w-md w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-symbols-outlined text-slate-400">search</span>
            </div>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="block w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tìm theo tên add-on"
              type="text"
            />
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm text-slate-500 font-medium">Sắp xếp:</span>
            <select
              value={sortOption}
              onChange={(event) => setSortOption(event.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>Mới nhất</option>
              <option>Giá cao đến thấp</option>
              <option>Giá thấp đến cao</option>
              <option>Tên A-Z</option>
              <option>Tên Z-A</option>
            </select>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[980px] w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="p-4 pl-6 text-sm font-semibold text-slate-600">Tên add-on</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Mô tả</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Giá</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">Image</th>
                    <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
                    <th className="p-4 pr-6 text-right text-sm font-semibold text-slate-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {displayedAddons.length > 0 ? (
                    displayedAddons.map((addon) => (
                      <tr key={addon.id} className="transition-colors hover:bg-slate-50">
                        <td className="p-4 pl-6 text-sm font-bold text-slate-900">{addon.name}</td>
                        <td className="p-4 text-sm font-medium text-slate-700 max-w-[280px]">
                          <p className="line-clamp-2">{addon.description}</p>
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-700">{formatVnd(addon.price)}</td>
                        <td className="p-4">
                          {addon.imageUrl ? (
                            <div className="h-12 w-16 overflow-hidden rounded border border-slate-200 bg-slate-50">
                              <img src={addon.imageUrl} alt={addon.name} className="h-full w-full object-cover" />
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400">Chưa có ảnh</span>
                          )}
                        </td>
                        <td className="p-4 text-xs font-medium text-slate-500">{addon.id}</td>
                        <td className="p-4 pr-6 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              onClick={() => openEditModal(addon)}
                              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold text-blue-600 transition-colors hover:border-blue-200 hover:bg-blue-50"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => openDeleteModal(addon)}
                              className="rounded-md border border-slate-200 px-3 py-1.5 text-xs font-bold text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-sm font-medium text-slate-500">
                        Không tìm thấy add-on phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignLibrary;
