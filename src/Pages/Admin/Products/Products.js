import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { deleteAdminProductApi, getAdminProductsApi } from '../../../services/productApi';

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`;

const Products = () => {
  const [activeTab, setActiveTab] = useState('Tất cả sản phẩm');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Mới nhất');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const itemsPerPage = 5;

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await getAdminProductsApi({ pageNumber: 1, pageSize: 100 });
        const mapped = (response?.data?.items || []).map((item) => {
          const stock = Number(item.stockQuantity || 0);
          const isActive = Boolean(item.isActive);

          let status = 'Còn hàng';
          let statusColor = 'bg-green-100 text-green-800 border-green-200';

          if (!isActive || stock === 0) {
            status = 'Hết hàng';
            statusColor = 'bg-red-100 text-red-800 border-red-200';
          } else if (stock <= 10) {
            status = 'Sắp hết';
            statusColor = 'bg-orange-100 text-orange-800 border-orange-200';
          }

          return {
            id: item.productId,
            name: item.name,
            category: item.categoryName || 'Khác',
            price: formatVnd(item.price || 0),
            priceValue: Number(item.price || 0),
            stock,
            status,
            statusColor,
          };
        });

        setAllProducts(mapped);
      } catch (apiError) {
        setError(apiError?.message || 'Không thể tải danh sách sản phẩm.');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    let result = allProducts.filter(product => {
      const matchesTab = 
        activeTab === 'Tất cả sản phẩm' ||
        (activeTab === 'Sắp hết' && product.status === 'Sắp hết') ||
        (activeTab === 'Hết hàng' && product.status === 'Hết hàng');

      const matchesSearch = 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });

    if (sortOption === 'Giá cao nhất') {
      result.sort((a, b) => b.priceValue - a.priceValue);
    } else if (sortOption === 'Giá thấp nhất') {
      result.sort((a, b) => a.priceValue - b.priceValue);
    } else if (sortOption === 'Tồn kho thấp') {
      result.sort((a, b) => a.stock - b.stock); 
    } else {
      result.sort((a, b) => b.id.localeCompare(a.id)); 
    }

    return result;
  }, [activeTab, searchQuery, sortOption, allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortOption]);

  const handleDeleteProduct = async (product) => {
    const confirmed = window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"?`);
    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminProductApi(product.id);
      setAllProducts((prev) => prev.filter((item) => item.id !== product.id));
      toast.success('Xóa sản phẩm thành công.');
    } catch (error) {
      toast.error(error?.message || 'Không thể xóa sản phẩm.');
    }
  };

  return (
    <div className="flex-1 overflow-y-scroll p-4 md:p-8 bg-gray-50 text-slate-900 min-h-screen relative">
      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý tồn kho</h1>
            <p className="mt-1 text-slate-500">Theo dõi tồn kho, cập nhật giá và quản lý danh mục trà.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/admin/products/add" className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-sm">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Thêm trà mới
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Tổng sản phẩm</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{allProducts.length}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Cảnh báo sắp hết</p>
            <h3 className="text-2xl font-bold text-orange-600 mt-2">{allProducts.filter((item) => item.status === 'Sắp hết').length}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Hết hàng</p>
            <h3 className="text-2xl font-bold text-red-600 mt-2">{allProducts.filter((item) => item.status === 'Hết hàng').length}</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Danh mục đang hoạt động</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">{new Set(allProducts.map((item) => item.category)).size}</h3>
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-slate-200 bg-white p-6 text-sm font-medium text-slate-500">
            Đang tải danh sách sản phẩm...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {['Tất cả sản phẩm', 'Sắp hết', 'Hết hàng'].map((tab) => (
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
          
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative group w-full md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-slate-400 group-focus-within:text-blue-600 transition-colors">search</span>
              </div>
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border-none ring-1 ring-slate-200 rounded-lg bg-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm" 
                placeholder="Tìm theo tên trà hoặc SKU..." 
                type="text"
              />
            </div>

            <div className="relative">
              <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Sắp xếp: {sortOption}
              </button>
              
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 z-20 py-2">
                  <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Sắp xếp theo</div>
                  {['Mới nhất', 'Tồn kho thấp', 'Giá cao nhất', 'Giá thấp nhất'].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSortOption(option);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        sortOption === option ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 pl-6 text-sm font-semibold text-slate-600 w-[25%]">Thông tin sản phẩm</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[15%]">SKU</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[15%]">Danh mục</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[15%]">Giá</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[10%]">Tồn kho</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[12%]">Trạng thái</th>
                  <th className="p-4 pr-6 text-sm font-semibold text-slate-600 w-[8%] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentProducts.length > 0 ? (
                  currentProducts.map((product, index) => (
                    <tr key={index} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 truncate">
                        <span className="font-bold text-slate-900 truncate block">{product.name}</span>
                      </td>
                      <td className="p-4 truncate">
                        <span className="text-sm font-mono text-slate-500">{product.id}</span>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600 truncate">
                        {product.category}
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-900 truncate">
                        {product.price}
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-900 truncate">
                        {product.stock}
                      </td>
                      <td className="p-4 truncate">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${product.statusColor}`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <Link to={`/admin/products/edit/${product.id}`} className="text-blue-600 hover:bg-blue-50 transition-colors px-2 py-1 rounded-md text-xs font-bold border border-transparent hover:border-blue-200">
                          Sửa
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product)}
                          className="text-red-600 hover:bg-red-50 transition-colors px-2 py-1 rounded-md text-xs font-bold border border-transparent hover:border-red-200"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-slate-500 font-medium">
                      Không tìm thấy sản phẩm phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/50">
              <span className="text-sm text-slate-500 font-medium">
                Hiển thị <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> trên <span className="font-bold text-slate-900">{filteredProducts.length}</span>
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 disabled:opacity-50 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm font-bold">chevron_left</span>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                  <button 
                    key={num}
                    onClick={() => setCurrentPage(num)}
                    className={`size-8 rounded-lg font-bold text-sm transition-colors ${
                      currentPage === num 
                        ? 'bg-blue-600 text-white shadow-sm' 
                        : 'text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
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

export default Products;
