import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  createAdminProductApi,
  deleteAdminProductImageApi,
  deleteAdminProductApi,
  getAdminCategoriesApi,
  getAdminProductDetailApi,
  setAdminProductMainImageApi,
  updateAdminProductApi,
  updateAdminProductVariantApi,
} from '../../../services/productApi';

const ProductEdit = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { productId } = useParams();
  const isAddMode = location.pathname.includes('/add');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [variants, setVariants] = useState([{ variantId: '', gram: '', price: '', stockQuantity: '' }]);
  const imageInputRef = useRef(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getAdminCategoriesApi({ pageNumber: 1, pageSize: 100 });
        const categoryItems = response?.data?.items || [];
        const mapped = categoryItems
          .map((item) => ({
            id: item?.categoryId || item?.id || '',
            name: item?.name || item?.categoryName || 'Không tên',
          }))
          .filter((item) => item.id);

        setCategories(mapped);
      } catch (error) {
        toast.error(error?.message || 'Không tải được danh mục.');
      } finally {
        setLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    if (isAddMode || !productId) {
      return;
    }

    const loadProductDetail = async () => {
      try {
        setLoadingDetail(true);
        const response = await getAdminProductDetailApi(productId);
        const detail = response?.data || {};

        setName(detail?.name || '');
        setDescription(detail?.description || '');
        setCategoryName(detail?.category || '');
        setIsActive(Boolean(detail?.isActive));

        const mappedImages = (detail?.images || []).map((image, index) => ({
          imageId: String(image?.imageId || image?.id || image?.productImageId || ''),
          imageUrl: image?.imageUrl || image?.url || image?.path || image?.src || '',
          isMain: Boolean(
            image?.isMain || image?.isPrimary || image?.isDefault || image?.isMainImage,
          ),
          index,
        }));

        if (mappedImages.length > 0 && !mappedImages.some((item) => item.isMain)) {
          mappedImages[0] = {
            ...mappedImages[0],
            isMain: true,
          };
        }

        setExistingImages(mappedImages);

        const mappedVariants = (detail?.variants || []).map((variant) => ({
          variantId: String(
            variant?.variantId || variant?.id || variant?.productVariantId || '',
          ),
          gram: String(variant?.gram ?? ''),
          price: String(variant?.price ?? ''),
          stockQuantity: String(variant?.stockQuantity ?? ''),
        }));

        if (mappedVariants.length > 0) {
          setVariants(mappedVariants);
        }
      } catch (error) {
        toast.error(error?.message || 'Không tải được chi tiết sản phẩm.');
      } finally {
        setLoadingDetail(false);
      }
    };

    loadProductDetail();
  }, [isAddMode, productId]);

  const categoryNameById = useMemo(() => {
    const map = new Map();
    categories.forEach((item) => map.set(item.id, item.name));
    return map;
  }, [categories]);

  useEffect(() => {
    if (!isAddMode && !categoryId && categoryName && categories.length > 0) {
      const matched = categories.find((item) => item.name === categoryName);
      if (matched?.id) {
        setCategoryId(matched.id);
      }
    }
  }, [isAddMode, categoryId, categoryName, categories]);

  const handleVariantChange = (index, field, value) => {
    setVariants((prev) =>
      prev.map((variant, idx) =>
        idx === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant,
      ),
    );
  };

  const addVariantRow = () => {
    setVariants((prev) => [...prev, { variantId: '', gram: '', price: '', stockQuantity: '' }]);
  };

  const removeVariantRow = (index) => {
    setVariants((prev) => {
      if (prev.length <= 1) {
        return prev;
      }
      return prev.filter((_, idx) => idx !== index);
    });
  };

  const parseVariantsPayload = () => {
    const cleaned = variants
      .map((item) => ({
        gram: Number(item.gram),
        price: Number(item.price),
        stockQuantity: Number(item.stockQuantity),
      }))
      .filter(
        (item) =>
          Number.isFinite(item.gram) &&
          Number.isFinite(item.price) &&
          Number.isFinite(item.stockQuantity),
      );

    return cleaned;
  };

  const parseVariantUpdatesPayload = () => {
    return variants
      .map((item) => ({
        variantId: item.variantId,
        price: Number(item.price),
        stockQuantity: Number(item.stockQuantity),
      }))
      .filter(
        (item) =>
          item.variantId &&
          Number.isFinite(item.price) &&
          Number.isFinite(item.stockQuantity),
      );
  };

  const handleSetMainImage = async (imageId) => {
    if (!imageId) {
      toast.warning('Không tìm thấy imageId để đặt ảnh chính.');
      return;
    }

    try {
      setSubmitting(true);
      await setAdminProductMainImageApi(imageId);
      setExistingImages((prev) =>
        prev.map((item) => ({
          ...item,
          isMain: item.imageId === imageId,
        })),
      );
      toast.success('Đặt ảnh chính thành công.');
    } catch (error) {
      toast.error(error?.message || 'Không thể đặt ảnh chính.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteImage = async (imageId) => {
    if (!imageId) {
      toast.warning('Không tìm thấy imageId để xóa.');
      return;
    }

    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa ảnh này?');
    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      await deleteAdminProductImageApi(imageId);

      setExistingImages((prev) => {
        const next = prev.filter((item) => item.imageId !== imageId);
        if (next.length > 0 && !next.some((item) => item.isMain)) {
          next[0] = {
            ...next[0],
            isMain: true,
          };
        }
        return next;
      });

      toast.success('Xóa ảnh thành công.');
    } catch (error) {
      toast.error(error?.message || 'Không thể xóa ảnh.');
    } finally {
      setSubmitting(false);
    }
  };

  const removeSelectedImage = (index) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleSelectImageFiles = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) {
      return;
    }

    setImageFiles((prev) => {
      const next = [...prev];

      files.forEach((file) => {
        const exists = next.some(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified,
        );

        if (!exists) {
          next.push(file);
        }
      });

      return next;
    });
  };

  const openImagePicker = () => {
    imageInputRef.current?.click();
  };

  const handleDelete = async () => {
    if (!productId) {
      return;
    }

    const confirmed = window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?');
    if (!confirmed) {
      return;
    }

    try {
      setSubmitting(true);
      await deleteAdminProductApi(productId);
      toast.success('Xóa sản phẩm thành công.');
      navigate('/admin/products');
    } catch (error) {
      toast.error(error?.message || 'Không thể xóa sản phẩm.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.warning('Vui lòng nhập tên sản phẩm.');
      return;
    }

    if (!categoryId) {
      toast.warning('Vui lòng chọn danh mục.');
      return;
    }

    const variantsPayload = parseVariantsPayload();
    if (isAddMode && variantsPayload.length === 0) {
      toast.warning('Vui lòng nhập ít nhất 1 biến thể hợp lệ.');
      return;
    }

    try {
      setSubmitting(true);

      if (isAddMode) {
        await createAdminProductApi({
          name: name.trim(),
          description: description.trim(),
          categoryId,
          variants: variantsPayload,
          images: imageFiles,
        });

        toast.success('Tạo sản phẩm thành công.');
      } else {
        await updateAdminProductApi({
          productId,
          name: name.trim(),
          description: description.trim(),
          categoryId,
          isActive,
          newImages: imageFiles,
        });

        const variantUpdates = parseVariantUpdatesPayload();
        if (variantUpdates.length > 0) {
          await Promise.all(
            variantUpdates.map((item) =>
              updateAdminProductVariantApi({
                variantId: item.variantId,
                price: item.price,
                stockQuantity: item.stockQuantity,
              }),
            ),
          );
        }

        toast.success('Cập nhật sản phẩm thành công.');
      }

      navigate('/admin/products');
    } catch (error) {
      toast.error(error?.message || 'Không thể lưu sản phẩm.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-scroll p-4 md:p-8 bg-gray-50 text-slate-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {isAddMode ? 'Thêm sản phẩm mới' : 'Cập nhật sản phẩm'}
            </h1>
            <p className="mt-1 text-slate-500">
              {isAddMode ? 'Tạo sản phẩm trà mới và thiết lập biến thể.' : 'Xem chi tiết sản phẩm theo API admin.'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/products" className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
              Hủy
            </Link>
            {!isAddMode && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={submitting || loadingDetail}
                className="px-4 py-2 text-sm font-bold text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-60"
              >
                Xóa
              </button>
            )}
            <button 
              onClick={handleSubmit}
              disabled={submitting || loadingDetail}
              className="flex items-center gap-2 px-5 py-2 text-sm font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 shadow-sm transition-all transform active:scale-95 disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[20px]">{submitting ? 'hourglass_top' : isAddMode ? 'add_circle' : 'save'}</span>
              {isAddMode ? 'Tạo sản phẩm' : 'Lưu thay đổi'}
            </button>
          </div>
        </div>

        {loadingDetail && !isAddMode && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
            Đang tải chi tiết sản phẩm...
          </div>
        )}

        {!isAddMode && !loadingDetail && (
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <div className="relative flex items-center w-full">
              <div className="block w-full h-12 px-4 py-3 bg-transparent rounded-lg text-slate-700 sm:text-sm">
                Mã sản phẩm: <span className="font-mono text-slate-900">{productId || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">edit_note</span> Thông tin chung
                </h3>
                {!isAddMode && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                    Đã đăng
                  </span>
                )}
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1" htmlFor="product-name">Tên sản phẩm</label>
                  <input 
                    className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
                    id="product-name" 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={isAddMode ? 'vd. Spring Harvest Matcha' : ''}
                  />
                </div>
                
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Mô tả cửa hàng</label>
                  <div className="border border-slate-200 rounded-lg overflow-hidden bg-slate-50">
                    <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-white">
                      <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded" type="button"><span className="material-symbols-outlined text-[18px]">format_bold</span></button>
                      <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded" type="button"><span className="material-symbols-outlined text-[18px]">format_italic</span></button>
                      <div className="w-px h-4 bg-slate-300 mx-1"></div>
                      <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded" type="button"><span className="material-symbols-outlined text-[18px]">format_list_bulleted</span></button>
                    </div>
                    <div className="p-3">
                      <textarea 
                        className="w-full border-none bg-transparent p-0 focus:ring-0 text-sm text-slate-800 resize-none outline-none" 
                        rows="4"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder={isAddMode ? 'Mô tả hương vị, câu chuyện và cảm giác của loại trà này...' : ''}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Danh mục</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    disabled={loadingCategories}
                    className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                  {!isAddMode && !categoryId && (
                    <p className="mt-1 text-xs text-slate-500">
                      Đang dùng danh mục: {categoryNameById.get(categoryId) || categoryName || 'Chưa có dữ liệu danh mục'}
                    </p>
                  )}
                </div>

                {!isAddMode && (
                  <div className="flex items-center justify-between gap-3 text-sm font-medium text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex size-2.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-slate-400'}`}></span>
                      {isActive ? 'Đang hoạt động' : 'Tạm ẩn'}
                    </div>
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="size-4 rounded border-slate-300"
                      />
                      <span>Kích hoạt</span>
                    </label>
                  </div>
                )}
              </div>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">imagesmode</span> Hình ảnh sản phẩm
              </h3>

              <div className="mb-4 flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={openImagePicker}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                >
                  {imageFiles.length > 0 ? 'Thêm ảnh' : 'Tải ảnh'}
                </button>
                {imageFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setImageFiles([])}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                  >
                    Xóa hết ảnh đã chọn
                  </button>
                )}
              </div>

              <input
                ref={imageInputRef}
                className="hidden"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  handleSelectImageFiles(e.target.files);
                  // Allow selecting the same file again after removing it.
                  e.target.value = '';
                }}
              />

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {!isAddMode && existingImages.map((image) => (
                  <div
                    key={image.imageId || `${image.imageUrl}-${image.index}`}
                    className={`relative group aspect-square rounded-lg overflow-hidden border ${image.isMain ? 'border-2 border-blue-600' : 'border-slate-200'} bg-slate-100`}
                  >
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt="Product"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-slate-300 text-3xl">image</span>
                      </div>
                    )}

                    {image.isMain && (
                      <div className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] font-bold px-1.5 rounded">
                        CHÍNH
                      </div>
                    )}

                    <div className="absolute inset-x-1 bottom-1 flex gap-1">
                      {!image.isMain && (
                        <button
                          type="button"
                          disabled={submitting}
                          onClick={() => handleSetMainImage(image.imageId)}
                          className="flex-1 rounded bg-white/90 text-[10px] font-bold text-blue-700 px-1 py-1 hover:bg-white disabled:opacity-60"
                        >
                          Đặt chính
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={submitting}
                        onClick={() => handleDeleteImage(image.imageId)}
                        className="flex-1 rounded bg-white/90 text-[10px] font-bold text-red-700 px-1 py-1 hover:bg-white disabled:opacity-60"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={openImagePicker}
                  className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-slate-400 text-3xl mb-1">add_photo_alternate</span>
                  <span className="text-xs text-slate-500 font-bold">Thêm ảnh</span>
                </button>
              </div>
              {!isAddMode && existingImages.length === 0 && (
                <p className="text-xs text-slate-500">Sản phẩm chưa có ảnh nào.</p>
              )}
              {imageFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Đã chọn {imageFiles.length} ảnh {isAddMode ? 'để tạo mới.' : 'mới để thêm vào sản phẩm khi lưu.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {imageFiles.map((file, index) => (
                      <button
                        key={`${file.name}-${index}`}
                        type="button"
                        onClick={() => removeSelectedImage(index)}
                        className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
                      >
                        {file.name} x
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          <div className="lg:col-span-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">payments</span> Cơ chế giá
              </h3>
              <div className="space-y-4">
                {variants.map((variant, index) => (
                  <div key={`${index}-${variant.gram}-${variant.price}`} className="grid grid-cols-1 gap-3 rounded-lg border border-slate-200 p-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Khối lượng (g)</label>
                        <input
                          type="number"
                          value={variant.gram}
                          readOnly={!isAddMode}
                          onChange={(e) => handleVariantChange(index, 'gram', e.target.value)}
                          className="block w-full rounded-lg border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Giá</label>
                        <input
                          type="number"
                          value={variant.price}
                          onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                          className="block w-full rounded-lg border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">Tồn kho</label>
                        <input
                          type="number"
                          value={variant.stockQuantity}
                          onChange={(e) => handleVariantChange(index, 'stockQuantity', e.target.value)}
                          className="block w-full rounded-lg border-slate-200 bg-slate-50 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    {isAddMode && variants.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeVariantRow(index)}
                        className="self-end text-xs font-bold text-red-600 hover:text-red-700"
                      >
                        Xóa biến thể
                      </button>
                    )}
                  </div>
                ))}

                {isAddMode && (
                  <button
                    type="button"
                    onClick={addVariantRow}
                    className="w-full rounded-lg border border-dashed border-blue-300 py-2 text-sm font-bold text-blue-700 hover:bg-blue-50"
                  >
                    + Thêm biến thể
                  </button>
                )}
              </div>
            </div>


            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">inventory</span> Tồn kho
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Ghi chú</label>
                  <div className="block w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
                    {isAddMode ? 'Tồn kho được tính theo từng biến thể bên trên.' : 'Tồn kho hiển thị trong danh sách biến thể.'}
                  </div>
                </div>
                {!isAddMode && (
                  <div className="pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                      <span>Trạng thái hoạt động:</span>
                      <span className="text-blue-600">{isActive ? 'Đang hoạt động' : 'Tạm ẩn'}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductEdit;
