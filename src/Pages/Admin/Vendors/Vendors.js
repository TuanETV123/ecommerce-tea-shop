import React, { useState, useMemo } from 'react';

const formatVnd = (value) => `${new Intl.NumberFormat('vi-VN').format(Number(value || 0))} đ`;

const Vendors = () => {
  const [activeTab, setActiveTab] = useState('Tất cả đối tác');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);

  const vendors = [
    { id: 'VND-042', name: 'Fujian Heritage Farms', category: 'Nguồn trà', contact: 'Chen Wei', email: 'chen@fujianheritage.com', status: 'Hoạt động', spent: 45200000 },
    { id: 'VND-041', name: 'EcoWrap Solutions', category: 'Đóng gói', contact: 'Sarah Jenkins', email: 's.jenkins@ecowrap.co', status: 'Hoạt động', spent: 12450000 },
    { id: 'VND-040', name: 'Kyoto Matcha Co.', category: 'Nguồn trà', contact: 'Kenji Sato', email: 'wholesale@kyotomatcha.jp', status: 'Chờ duyệt', spent: 0 },
    { id: 'VND-039', name: 'Global Freight Logistics', category: 'Vận chuyển', contact: 'Mike Ross', email: 'mike.r@gff.com', status: 'Hoạt động', spent: 8900000 },
    { id: 'VND-038', name: 'Da Lat Herbal Collectives', category: 'Nguồn trà', contact: 'Nguyen Hoa', email: 'hoa@dalatherbals.vn', status: 'Không hoạt động', spent: 3200000 }
  ];

  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            v.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesTab = activeTab === 'Tất cả đối tác' || 
             (activeTab === 'Nguồn trà' && v.category === 'Nguồn trà') ||
             (activeTab === 'Đóng gói & logistics' && (v.category === 'Đóng gói' || v.category === 'Vận chuyển'));

      return matchesSearch && matchesTab;
    });
  }, [searchQuery, activeTab]);

  return (
    <div className="flex-1 overflow-y-scroll p-4 md:p-8 bg-gray-50 text-slate-900 min-h-screen relative">
      
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-slate-100">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-600">domain_add</span>
                Đăng ký nhà cung cấp mới
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                <input type="text" className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="vd. Ceylon Organic Estates" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Danh mục hợp tác</label>
                <select className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option>Nguồn trà</option>
                  <option>Vật liệu đóng gói</option>
                  <option>Vận chuyển & logistics</option>
                  <option>Thiết kế & marketing</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Người liên hệ chính</label>
                  <input type="text" className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Tên người liên hệ" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Địa chỉ email</label>
                  <input type="email" className="w-full rounded-lg border-slate-200 bg-slate-50 text-slate-900 focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="email@company.com" />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setIsAddModalOpen(false)} className="flex-1 py-2.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
                Hủy
              </button>
              <button 
                onClick={() => {
                  alert("Đang mô phỏng tạo hồ sơ nhà cung cấp...");
                  setIsAddModalOpen(false);
                }} 
                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors"
              >
                Đăng ký đối tác
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm transition-opacity p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center font-black">
                  <span className="material-symbols-outlined">corporate_fare</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">{selectedVendor.name}</h3>
                  <p className="text-sm font-medium text-slate-500">{selectedVendor.category}</p>
                </div>
              </div>
              <button onClick={() => setSelectedVendor(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-6 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Mã NCC</span>
                <span className="text-sm font-mono font-bold text-slate-900">{selectedVendor.id}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase">Liên hệ</span>
                <span className="text-sm font-bold text-slate-900">{selectedVendor.contact}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Email</span>
                <span className="text-sm font-bold text-blue-600">{selectedVendor.email}</span>
              </div>
              <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase">Chi tiêu YTD</span>
                <span className="text-sm font-bold text-slate-900">{formatVnd(selectedVendor.spent)}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedVendor(null)} 
                className="flex-1 py-2.5 rounded-lg bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
              >
                Đóng
              </button>
              <button 
                onClick={() => {
                  alert(`Đang mô phỏng soạn email đơn mua hàng mới tới ${selectedVendor.email}...`);
                  setSelectedVendor(null);
                }} 
                className="flex-1 py-2.5 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors flex justify-center items-center gap-2"
              >
                <span className="material-symbols-outlined text-[18px]">mail</span>
                Liên hệ nhà cung cấp
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nhà cung cấp & đối tác</h1>
            <p className="mt-1 text-slate-500">Quản lý nguồn cung trực tiếp, nhà cung cấp đóng gói và logistics.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">add_business</span>
              Thêm đối tác
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Đối tác hoạt động</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-2">18</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Trang trại trà</p>
            <h3 className="text-2xl font-bold text-green-600 mt-2">12</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Chờ duyệt</p>
            <h3 className="text-2xl font-bold text-orange-500 mt-2">3</h3>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            <p className="text-slate-500 text-sm font-medium">Tổng mua hàng (YTD)</p>
            <h3 className="text-2xl font-bold text-blue-600 mt-2">{formatVnd(69750000)}</h3>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {['Tất cả đối tác', 'Nguồn trà', 'Đóng gói & logistics'].map((tab) => (
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
              placeholder="Tìm theo công ty hoặc danh mục..." 
              type="text"
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="p-4 pl-6 text-sm font-semibold text-slate-600 w-[15%]">Mã NCC</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[25%]">Tên công ty</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[20%]">Người liên hệ</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[15%]">Danh mục</th>
                  <th className="p-4 text-sm font-semibold text-slate-600 w-[10%]">Trạng thái</th>
                  <th className="p-4 pr-6 text-sm font-semibold text-slate-600 w-[15%] text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredVendors.length > 0 ? (
                  filteredVendors.map((vendor, idx) => (
                    <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                      <td className="p-4 pl-6 truncate">
                        <span className="font-mono font-bold text-slate-500">{vendor.id}</span>
                      </td>
                      <td className="p-4 truncate">
                        <span className="text-sm font-bold text-slate-900 block truncate">{vendor.name}</span>
                      </td>
                      <td className="p-4 truncate">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-700 truncate">{vendor.contact}</span>
                          <span className="text-xs font-medium text-slate-500 truncate">{vendor.email}</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-medium text-slate-700 truncate">
                        {vendor.category}
                      </td>
                      <td className="p-4 truncate">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                          vendor.status === 'Hoạt động' ? 'bg-green-50 text-green-700' :
                          vendor.status === 'Chờ duyệt' ? 'bg-orange-50 text-orange-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => setSelectedVendor(vendor)}
                          className="text-blue-600 hover:bg-blue-50 transition-colors px-3 py-1.5 rounded-md text-xs font-bold border border-slate-200 hover:border-blue-200"
                        >
                          Xem hồ sơ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-500 font-medium">
                      Không tìm thấy bản ghi phù hợp.
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

export default Vendors;