import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const menuGroups = [
    {
      title: "Tổng quan",
      items: [
        { path: "/admin/dashboard", label: "Tổng quan bảng điều khiển", icon: "dashboard" },
      ]
    },
    {
      title: "Quản lý cửa hàng",
      items: [
        { path: "/admin/orders", label: "Đơn hàng", icon: "local_shipping" },
        { path: "/admin/products", label: "Sản phẩm & Tồn kho", icon: "inventory_2" },
        { path: "/admin/categories", label: "Danh mục", icon: "category" },
      ]
    },
    {
      title: "Thiết kế & UI",
      items: [
        { path: "/admin/campaigns", label: "Banner Studio", icon: "brush" },
        { path: "/admin/design-library", label: "Thiết kế đặt riêng", icon: "stylus_note" },
        { path: "/admin/blogs", label: "Bài viết / Blog", icon: "article" },
      ]
    },
    {
      title: "Người dùng & Hỗ trợ",
      items: [
        { path: "/admin/customers", label: "Người dùng & Đánh giá", icon: "groups" },
      ]
    }
  ];

  return (
    <div>
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 overflow-y-auto pb-10">
        
        <div className="flex items-center gap-3 px-6 mb-8 mt-6">
          <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
            <span className="material-symbols-outlined font-bold">eco</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black leading-tight text-gray-800 tracking-tight">TeaVault</h1>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Bảng quản trị</p>
          </div>
        </div>

        <nav className="px-4">
          {menuGroups.map((group, index) => (
            <div key={index} className="mb-6">
              <h3 className="px-4 text-[11px] font-black text-gray-400 uppercase tracking-widest mb-3">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname.includes(item.path);
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                          isActive
                            ? "bg-blue-50 text-blue-700 font-bold shadow-sm border border-blue-100/50"
                            : "text-gray-600 hover:bg-gray-50 font-medium"
                        }`}
                      >
                        <span 
                          className="material-symbols-outlined text-[20px]"
                          style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                        >
                          {item.icon}
                        </span>
                        <span className="text-sm">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}

export default Sidebar;