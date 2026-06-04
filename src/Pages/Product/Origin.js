import React from "react";

const Origin = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-black text-[#0d1b10]">Xuất xứ</h3>
      <p className="text-gray-600 font-medium leading-relaxed">
        Matcha của chúng tôi được trồng tại Uji, Kyoto - vùng có hàng trăm năm
        kinh nghiệm trồng trà. Nông dân chăm sóc bằng kỹ thuật che bóng truyền
        thống và tự tay chọn lá ở độ tươi tốt nhất để đảm bảo màu sắc đậm và vị
        umami.
      </p>

      <div className="bg-surface-light p-6 rounded-2xl border border-gray-100">
        <h4 className="font-black text-lg mb-4 text-[#0d1b10]">
          Thực hành tại trang trại
        </h4>
        <ul className="space-y-3 text-gray-600 font-medium">
          <li>Che bóng 20 ngày trước khi thu hoạch</li>
          <li>Xay bằng đá theo công nghệ truyền thống</li>
          <li>Chọn tay, chế biến theo lô nhỏ</li>
          <li>Trang trại gia đình với thực hành bền vững</li>
        </ul>
      </div>

      <div className="bg-surface-light p-6 rounded-2xl border border-gray-100">
        <h4 className="font-black text-lg mb-4 text-[#0d1b10]">Thổ nhưỡng</h4>
        <p className="text-gray-600 font-medium leading-relaxed">
          Đất giàu khoáng chất ở Uji và quá trình canh tác kỹ lưỡng tạo nên
          matcha có vị umami cân bằng và sắc xanh tươi. Thời tiết theo mùa và
          cách chế biến nhẹ nhàng góp phần tạo nên hương vị cuối cùng.
        </p>
      </div>
    </div>
  );
};

export default Origin;
