import React from 'react';

const Contact = () => {
  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-12 lg:py-20 font-display bg-background-light text-[#0d1b10] min-h-screen">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-6">Rất mong nghe từ bạn</h1>
        <p className="text-gray-600 text-lg md:text-xl font-medium leading-relaxed">
          Bạn có thắc mắc về trà? Muốn biết thêm về cách làm bền vững của chúng tôi? Chúng tôi luôn sẵn sàng hỗ trợ.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
            <span className="material-symbols-outlined text-3xl">call</span>
          </div>
          <h3 className="font-black text-lg mb-2">Hotline</h3>
          <p className="font-bold text-[#0d1b10] text-lg mb-1">0357 130 804</p>
          <p className="text-xs text-gray-500 font-medium">Hoạt động trong giờ hành chính</p>
        </div>

        <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
            <span className="material-symbols-outlined text-3xl">mail</span>
          </div>
          <h3 className="font-black text-lg mb-2">Email</h3>
          <p className="font-bold text-[#0d1b10] text-base mb-1">teavault2025@gmail.com</p>
          <p className="text-xs text-gray-500 font-medium">Phản hồi trong 24 giờ</p>
        </div>

        <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
            <span className="material-symbols-outlined text-3xl">location_on</span>
          </div>
          <h3 className="font-black text-lg mb-2">Địa chỉ</h3>
          <p className="font-bold text-[#0d1b10] text-sm mb-1">65D, 63 Lò Lu, P. Trường Thạnh</p>
          <p className="text-xs text-gray-500 font-medium">TP. Thủ Đức, Hồ Chí Minh</p>
        </div>

        <div className="bg-white rounded-3xl p-8 flex flex-col items-center text-center border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-primary mb-6">
            <span className="material-symbols-outlined text-3xl">schedule</span>
          </div>
          <h3 className="font-black text-lg mb-2">Giờ làm việc</h3>
          <p className="font-bold text-[#0d1b10] text-sm mb-1">Thứ 2-Thứ 7: 8:00 - 17:00</p>
          <p className="text-xs text-gray-500 font-medium">Chủ nhật: Đóng cửa</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 bg-white rounded-[2.5rem] p-6 md:p-10 shadow-sm border border-gray-100">
        
        <div className="flex-1 lg:pr-8">
          <h2 className="text-3xl font-black mb-8 text-[#0d1b10]">Gửi lời nhắn</h2>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Tên</label>
              <input 
                type="text" 
                placeholder="Họ tên đầy đủ" 
                className="w-full h-14 px-5 rounded-xl bg-surface-light border-none focus:ring-2 focus:ring-primary outline-none transition-all text-[#0d1b10] font-medium placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Email</label>
              <input 
                type="email" 
                placeholder="your.email@example.com" 
                className="w-full h-14 px-5 rounded-xl bg-surface-light border-none focus:ring-2 focus:ring-primary outline-none transition-all text-[#0d1b10] font-medium placeholder:text-gray-400"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400">Nội dung</label>
              <textarea 
                placeholder="Chia sẻ điều bạn đang nghĩ..." 
                rows="5"
                className="w-full p-5 rounded-xl bg-surface-light border-none focus:ring-2 focus:ring-primary outline-none transition-all text-[#0d1b10] font-medium placeholder:text-gray-400 resize-none"
              ></textarea>
            </div>
            <button 
              type="button" 
              className="mt-2 w-full bg-primary text-[#0d1b10] h-14 rounded-xl font-black tracking-wide shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Gửi tin
            </button>
          </form>
        </div>

        <div className="flex-1 rounded-3xl overflow-hidden bg-surface-light min-h-[400px] lg:min-h-full relative border border-gray-100">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.7846549292837!2d106.81156881533423!3d10.827756792286821!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175271168925503%3A0x644265cc8d69f886!2sL%C3%B2%20Lu%2C%20Tr%C6%B0%E1%BB%9Dng%20Th%E1%BA%A1nh%2C%20Qu%E1%BA%ADn%209%2C%20H%E1%BB%93%20Ch%C3%AD%20Minh!5e0!3m2!1sen!2s!4v1650000000000!5m2!1sen!2s" 
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Vị trí Tea Vault"
          ></iframe>
        </div>

      </div>

    </div>
  );
};

export default Contact;