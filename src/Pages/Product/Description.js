import React from "react";

const Description = () => {
  return (
    <div className="grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-6">
        <h3 className="text-2xl font-black text-[#0d1b10]">
          Tinh túy Uji
        </h3>
        <p className="text-gray-600 font-medium leading-relaxed">
          Matcha hạng lễ nghi của chúng tôi được lấy trực tiếp từ trang trại gia
          đình ở Uji, Kyoto - nơi khai sinh matcha Nhật Bản. Lá trà được che bóng
          20 ngày trước khi thu hoạch để tăng chlorophyll và L-theanine, tạo màu
          xanh lục bảo và vị umami sâu.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-10">
          <div className="bg-surface-light p-6 rounded-2xl border border-gray-100">
            <h4 className="font-black text-lg mb-4 flex items-center gap-2 text-[#0d1b10]">
              <span className="material-symbols-outlined text-primary">
                psychiatry
              </span>
              Hương vị
            </h4>
            <ul className="space-y-3 text-gray-600 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Cảm giác béo mượt
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Hương cỏ xanh
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Ngọt nhẹ
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Không đắng
              </li>
            </ul>
          </div>
          <div className="bg-surface-light p-6 rounded-2xl border border-gray-100">
            <h4 className="font-black text-lg mb-4 flex items-center gap-2 text-[#0d1b10]">
              <span className="material-symbols-outlined text-primary">
                nutrition
              </span>
              Lợi ích
            </h4>
            <ul className="space-y-3 text-gray-600 font-medium">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Giàu chất chống oxy hóa
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Hỗ trợ trao đổi chất
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Tập trung bình ổn (L-theanine)
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Thanh lọc tự nhiên
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-[#ecf6ee] rounded-3xl p-8 border border-primary/20 h-fit">
        <h4 className="text-xl font-black mb-8 text-center text-[#0d1b10]">
          Pha hoàn hảo
        </h4>
        <div className="space-y-6">
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
              <span className="material-symbols-outlined">thermometer</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                Nhiệt độ
              </p>
              <p className="font-bold text-[#0d1b10] mt-0.5">175°F / 80°C</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
              <span className="material-symbols-outlined">schedule</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                Thời gian đánh
              </p>
              <p className="font-bold text-[#0d1b10] mt-0.5">15-30 giây</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="size-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm shrink-0">
              <span className="material-symbols-outlined">scale</span>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">
                Lượng
              </p>
              <p className="font-bold text-[#0d1b10] mt-0.5">1.5g / 1 tsp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Description;
