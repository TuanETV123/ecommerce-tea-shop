import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { logout as logoutAction } from '../redux/authSlice/authSlice';
import { logoutApi } from '../services/authApi';

const Navbar = () => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { accessToken, refreshToken } = useSelector(
    (state) => state.auth || { accessToken: null, refreshToken: null },
  );

  const notifications = [
    { id: 1, text: "Đã nhận đơn mới #TV-1045", time: "5p trước", unread: true },
    { id: 2, text: "Alice Green đã mở một phiếu hỗ trợ", time: "12p trước", unread: true },
    { id: 3, text: "Tồn kho Imperial Jasmine Pearl sắp hết", time: "2g trước", unread: false },
  ];

  const handleLogout = async () => {
    try {
      if (accessToken && refreshToken) {
        await logoutApi({ accessToken, refreshToken });
      }
    } catch (error) {
      // Continue local logout even if backend logout fails.
      console.log('[Navbar] Logout API failed:', error?.message || error);
    } finally {
      dispatch(logoutAction());
      setIsProfileOpen(false);
      toast.success('Đăng xuất thành công.');
      navigate('/login', { replace: true });
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex-1"></div>
      
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => {
              setIsNotifOpen(!isNotifOpen);
              setIsProfileOpen(false);
            }}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
          >
            <span className="material-symbols-outlined text-[24px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 size-2.5 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <span className="font-bold text-slate-900">Thông báo</span>
                <button className="text-xs font-bold text-blue-600 hover:text-blue-700">Đánh dấu đã đọc</button>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                {notifications.map(notif => (
                  <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition-colors ${notif.unread ? 'bg-blue-50/50' : ''}`}>
                    <p className="text-sm font-medium text-slate-800">{notif.text}</p>
                    <p className="text-xs font-bold text-slate-500 mt-1">{notif.time}</p>
                  </div>
                ))}
              </div>
              <div className="p-3 text-center border-t border-slate-100 bg-slate-50/50">
                <button className="text-sm font-bold text-slate-600 hover:text-slate-900">Xem tất cả hoạt động</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative border-l border-slate-200 pl-4">
          <div 
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotifOpen(false);
            }}
            className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="size-9 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
              TV
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-bold text-slate-900 leading-none">Quản trị</p>
              <p className="text-xs font-medium text-slate-500 mt-1 leading-none">Quản lý hệ thống</p>
            </div>
            <span className="material-symbols-outlined text-slate-400 text-[20px]">expand_more</span>
          </div>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden z-50">
              <div className="py-1">
                <button 
                  onClick={() => alert("Đường dẫn trang cài đặt sẽ do backend định nghĩa.")}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">manage_accounts</span> 
                  Cài đặt tài khoản
                </button>
                <div className="border-t border-slate-100 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span> 
                  Đăng xuất
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;