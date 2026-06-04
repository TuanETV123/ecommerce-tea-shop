import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../redux/authSlice/authSlice";
import { logoutApi } from "../../services/authApi";
import { searchProductsApi, getProductsApi } from "../../services/productApi";

import { Button, Menu, Input, message } from "antd"; // Added message for error handling
import {
  MenuOutlined,
  SearchOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const menuItems = [
  { to: "/shop", label: "Cửa hàng" },
  { to: "/custom-design", label: "Thiết kế tùy chỉnh" },
  { to: "/journal", label: "Nhật ký" },
  { to: "/about", label: "Giới thiệu" },
  { to: "/contact", label: "Liên hệ" },
];

const CustomerNavbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Line 23 is now clean! No imports here.

  const products = useSelector((state) => state.cart?.products) || [];
  const { isAuthenticated, user, accessToken, refreshToken } = useSelector(
    (state) => state.auth || { isAuthenticated: false },
  );

  const totalItems = products.reduce((total, product) => {
    const productTotal =
      product.productDetails?.reduce(
        (sum, detail) => sum + (detail.quantity || 0),
        0,
      ) || 0;
    return total + productTotal;
  }, 0);

  // Logic for the Search Input
  const handleSearch = async () => {
    const query = searchText.trim();
    if (query !== "") {
      setIsSearching(true);
      try {
        const response = await searchProductsApi({
          keyword: query,
          pageNumber: 1,
          pageSize: 10,
        });

        const results = response?.data?.items || [];
        navigate("/shop", { state: { results, query } });
      } catch (error) {
        message.error("Lỗi tìm kiếm, vui lòng thử lại sau.");
      } finally {
        setIsSearching(false);
      }
    } else {
      const response = await getProductsApi({ pageNumber: 1, pageSize: 100 });
      const result = response?.data?.items || [];
      navigate("/shop", { state: { result } });
    }
  };

  const handleLogout = () => {
    if (accessToken && refreshToken) {
      logoutApi({ accessToken, refreshToken }).catch(() => {});
    }
    dispatch(logout());
    setIsProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="px-4 md:px-10 py-3 mx-auto max-w-[1440px]">
        <div className="flex items-center justify-between gap-4">
          {/* Menu & Brand */}
          <div className="flex items-center gap-3 relative">
            <Button
              icon={<MenuOutlined />}
              className="!bg-green-600 !border-green-600 !text-white hover:!bg-green-700"
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            />
            <Link to="/" className="flex items-center gap-2 group">
              <h2 className="text-xl font-bold tracking-tight group-hover:text-primary mb-0">
                Tea Vault
              </h2>
            </Link>

            {isOpenMenu && (
              <Menu
                mode="vertical"
                className="absolute top-12 left-0 w-48 rounded-lg shadow-xl border-0 z-50"
                style={{ background: "#16a34a" }}
              >
                {menuItems.map((item) => (
                  <Menu.Item
                    key={item.to}
                    className="!text-white hover:!bg-green-700"
                  >
                    <Link
                      to={item.to}
                      onClick={() => setIsOpenMenu(false)}
                      className="text-white"
                    >
                      {item.label}
                    </Link>
                  </Menu.Item>
                ))}
              </Menu>
            )}
          </div>

          {/* Search Bar Container */}
          <div className="flex-1 max-w-xl px-2">
            <Input
              prefix={
                isSearching ? (
                  <LoadingOutlined className="text-primary" />
                ) : (
                  <SearchOutlined className="text-primary" />
                )
              }
              placeholder="Tìm trà..."
              className="w-full rounded-lg border-gray-300 focus:border-primary"
              value={searchText}
              disabled={isSearching}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
            />
          </div>

          {/* Cart & Auth */}
          <div className="flex items-center gap-4">
            <Link
              to="/cart"
              className="relative flex items-center justify-center rounded-lg w-10 h-10 bg-gray-100 hover:text-primary"
            >
              <span className="material-symbols-outlined">shopping_cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-black text-black">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-lg p-1 pr-2 hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-black flex items-center justify-center font-bold text-sm">
                    {user?.name?.charAt(0) || "U"}
                  </div>
                  <span className="text-sm font-bold hidden md:block">
                    {user?.name}
                  </span>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 py-1">
                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Hồ sơ
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-gray-100 rounded-lg text-sm font-bold hover:bg-primary/20"
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default CustomerNavbar;
