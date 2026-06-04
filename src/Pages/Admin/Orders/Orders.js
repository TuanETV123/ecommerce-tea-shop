import React, { useState, useMemo, useEffect } from 'react';

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`;

const Orders = () => {
  const [activeTab, setActiveTab] = useState('Tất cả đơn');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Mới nhất');
  const [selectedOrder, setSelectedOrder] = useState(null);
  
  const itemsPerPage = 5;

  const allOrders = [
    { id: '#TR-2045', customer: 'Alice Green', email: 'alice@example.com', type: 'Trà', date: 'Oct 24, 2023', time: '10:23 AM', amount: 85000 },
    { id: '#TK-2034', customer: 'Bob Herbal', email: 'bob@herbal.com', type: 'Thiết kế trà', date: 'Oct 24, 2023', time: '09:15 AM', amount: 122500 },
    { id: '#TR-2032', customer: 'Charlie Chai', email: 'charlie@tea.co', type: 'Trà', date: 'Oct 23, 2023', time: '04:45 PM', amount: 45000 },
    { id: '#TR-2031', customer: 'Diana Darjeeling', email: 'diana@outlook.com', type: 'Trà', date: 'Oct 23, 2023', time: '02:30 PM', amount: 35000 },
    { id: '#TK-2029', customer: 'Fiona Fruit', email: 'fiona@fruit.com', type: 'Thiết kế trà', date: 'Oct 22, 2023', time: '08:00 AM', amount: 212000 },
    { id: '#TR-2028', customer: 'George Glass', email: 'george@glass.com', type: 'Trà', date: 'Oct 21, 2023', time: '11:20 AM', amount: 64000 },
    { id: '#TK-2027', customer: 'Hannah Honey', email: 'hannah@honey.com', type: 'Thiết kế trà', date: 'Oct 21, 2023', time: '09:00 AM', amount: 190000 },
    { id: '#TR-2026', customer: 'Ian Ice', email: 'ian@ice.com', type: 'Trà', date: 'Oct 20, 2023', time: '01:15 PM', amount: 25000 }
  ];

  const customersWithBothTypes = useMemo(() => {
    const typeByCustomer = new Map();
    allOrders.forEach((order) => {
      if (!typeByCustomer.has(order.customer)) {
        typeByCustomer.set(order.customer, new Set());
      }
      typeByCustomer.get(order.customer).add(order.type);
    });

    return new Set(
      Array.from(typeByCustomer.entries())
        .filter(([, types]) => types.has('Trà') && types.has('Thiết kế trà'))
        .map(([customer]) => customer)
    );
  }, [allOrders]);

  const filteredOrders = useMemo(() => {
    let result = allOrders.filter(order => {
      const matchesTab = 
        activeTab === 'Tất cả đơn' ||
        (activeTab === 'Trà' && order.type === 'Trà') ||
        (activeTab === 'Thiết kế trà' && order.type === 'Thiết kế trà') ||
        (activeTab === 'Cả trà & thiết kế' && customersWithBothTypes.has(order.customer));

      const matchesSearch = 
        order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });

    if (sortOption === 'Giá trị cao nhất') {
      result.sort((a, b) => Number(b.amount) - Number(a.amount));
    } else if (sortOption === 'Giá trị thấp nhất') {
      result.sort((a, b) => Number(a.amount) - Number(b.amount));
    } else if (sortOption === 'Cũ nhất') {
      result.sort((a, b) => a.id.localeCompare(b.id)); 
    } else {
      result.sort((a, b) => b.id.localeCompare(a.id)); 
    }

    return result;
  }, [activeTab, searchQuery, sortOption, customersWithBothTypes]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, sortOption]);

  return (
    <div className="flex-1 overflow-y-scroll p-4 md:p-8 bg-gray-50 text-slate-900 min-h-screen relative">

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-xl shadow-2xl border border-slate-100 flex flex-col max-h-[90vh] overflow-y-auto scrollbar-hide">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Đơn {selectedOrder.id}</h3>
                <p className="text-sm text-slate-500">{selectedOrder.date} lúc {selectedOrder.time} • {selectedOrder.type}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Thông tin khách hàng</p>
                <p className="text-sm font-bold text-slate-900">{selectedOrder.customer}</p>
                <p className="text-sm text-slate-600">{selectedOrder.email}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Địa chỉ giao hàng</p>
                <p className="text-sm text-slate-900">123 Tea Garden Lane<br/>Portland, OR 97204</p>
              </div>
            </div>

            <div className="mb-6 bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sản phẩm trong đơn</p>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700">Premium Tea Collection (Box)</span>
                  <span className="font-bold text-slate-900">{formatVnd(selectedOrder.amount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                  <span className="font-medium text-slate-500">Tạm tính</span>
                  <span className="font-bold text-slate-900">{formatVnd(selectedOrder.amount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                  <span className="font-medium text-slate-500">Vận chuyển tiêu chuẩn</span>
                  <span className="font-bold text-slate-900">{formatVnd(0)}</span>
                </div>
                <div className="flex justify-between items-center text-sm border-t border-slate-100 pt-3">
                  <span className="font-black text-slate-900 uppercase">Tổng thanh toán</span>
                  <span className="font-black text-blue-600 text-lg">{formatVnd(selectedOrder.amount)}</span>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <button onClick={() => setSelectedOrder(null)} className="w-full py-2.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">
        
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quản lý đơn hàng</h1>
            <p className="mt-1 text-slate-500">Theo dõi lịch sử mua hàng của khách để quản lý tổng quan.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Tổng đơn (tháng này)</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">1,248</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Giao thành công</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">1,191</h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {['Tất cả đơn', 'Trà', 'Thiết kế trà', 'Cả trà & thiết kế'].map((tab) => (
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
                placeholder="Tìm mã đơn hoặc khách hàng..." 
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
                  {['Mới nhất', 'Cũ nhất', 'Giá trị cao nhất', 'Giá trị thấp nhất'].map((option) => (
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
                  <th className="p-4 pl-6 text-sm font-semibold text-slate-600 w-[12%]">Mã đơn</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[20%]">Khách hàng</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[24%]">Loại sản phẩm</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[22%]">Ngày ghi nhận</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[18%]">Tổng</th>
                  <th className="p-4 pr-6 text-sm font-semibold text-slate-600 w-[8%] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order, index) => (
                    <tr key={index} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 truncate">
                        <span className="font-bold text-slate-900">{order.id}</span>
                      </td>
                      <td className="p-4 truncate">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-900 truncate">{order.customer}</span>
                          <span className="text-xs font-medium text-slate-500 truncate">{order.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-600 truncate">
                        {order.type}
                      </td>
                      <td className="p-4 text-sm text-slate-500 truncate">
                        {order.date}
                        <div className="text-xs text-slate-400 font-medium">{order.time}</div>
                      </td>
                      <td className="p-4 text-sm font-bold text-slate-900 truncate">
                        {formatVnd(order.amount)}
                      </td>
                      <td className="p-4 pr-6 text-right space-x-2">
                        <button 
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:bg-blue-50 transition-colors px-4 py-1.5 rounded-md text-xs font-bold border border-slate-200 hover:border-blue-200"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                      Không tìm thấy đơn hàng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-slate-200 bg-slate-50/50">
              <span className="text-sm text-slate-500 font-medium">
                Hiển thị <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> đến <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> trên <span className="font-bold text-slate-900">{filteredOrders.length}</span>
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

export default Orders;