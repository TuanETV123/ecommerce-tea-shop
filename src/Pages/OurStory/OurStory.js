import React from 'react';
import { Link } from 'react-router-dom';

const OurStory = () => {
  const values = [
    {
      icon: 'verified_user',
      title: 'Thẩm định chuyên gia',
      desc: 'Đội ngũ sommelier trà được chứng nhận đánh giá từng loại trà về độ xác thực, chất lượng và quy trình trước khi vào bộ sưu tập.'
    },
    {
      icon: 'eco',
      title: 'Nguồn cung bền vững',
      desc: 'Chúng tôi chỉ hợp tác với nhà vườn áp dụng canh tác hữu cơ, tiết kiệm nước và bảo vệ đa dạng sinh học trong vườn trà.'
    },
    {
      icon: 'handshake',
      title: 'Quan hệ trực tiếp',
      desc: 'Chúng tôi duy trì kết nối trực tiếp với đối tác thủ công, đảm bảo đãi ngộ công bằng và bền vững lâu dài cho gia đình và cộng đồng của họ.'
    },
    {
      icon: 'history_edu',
      title: 'Gìn giữ văn hóa',
      desc: 'Thông qua Nhật ký và chương trình giáo dục, chúng tôi ghi chép và chia sẻ tri thức trà truyền thống, kỹ thuật pha và thực hành văn hóa.'
    }
  ];

  return (
    <div className="bg-background-light text-[#0d1b10] font-display min-h-screen">
      
      <section 
        className="relative h-[400px] lg:h-[500px] flex items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: `linear-gradient(rgba(13, 27, 16, 0.6), rgba(13, 27, 16, 0.8)), url("https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")` }}
      >
        <div className="text-center z-10 px-4">
          <h1 className="text-white text-5xl lg:text-7xl font-black mb-6 tracking-tight">Câu chuyện của chúng tôi</h1>
          <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Gìn giữ văn hóa trà qua thẩm định chuyên gia và nguồn cung chân thực
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="flex-1 space-y-6">
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              Tea Vault được xây dựng trên niềm tin đơn giản: trà tuyệt hảo xứng đáng được chăm chút xứng tầm. Trong thế giới sản xuất đại trà và nguồn gốc mơ hồ, chúng tôi thấy cần một nền tảng đáng tin cậy để tôn vinh văn hóa trà chân thực và hỗ trợ người trồng trà thủ công.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              Mỗi loại trà trong bộ sưu tập được thẩm định trực tiếp bởi các bậc thầy trà đã dành hàng thập kỷ nghiên cứu phương pháp canh tác và chế biến truyền thống. Chúng tôi làm việc trực tiếp với nông hộ quy mô nhỏ theo nông nghiệp bền vững và gìn giữ kỹ thuật hàng trăm năm.
            </p>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              Sứ mệnh của chúng tôi vượt ra ngoài thương mại. Chúng tôi xây dựng cộng đồng yêu trà, hỗ trợ thực hành thương mại công bằng và gìn giữ tri thức truyền thống cho thế hệ mai sau.
            </p>
          </div>
          <div className="flex-1 w-full">
            <div className="aspect-video lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-md border border-gray-100 group">
              <img 
                src="https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                alt="Lá trà tươi" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-light py-16 lg:py-24 border-y border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((val, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-6">
                  <span className="material-symbols-outlined text-3xl">{val.icon}</span>
                </div>
                <h3 className="text-xl font-black mb-4 text-[#0d1b10]">{val.title}</h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1024px] mx-auto px-4 md:px-10 py-16 lg:py-24 text-center">
        <div className="bg-[#0d1b10] rounded-[3rem] p-10 lg:p-16 relative overflow-hidden shadow-2xl">
          <div 
            className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay" 
            style={{ backgroundImage: `url("https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")` }}
          ></div>
          <div className="relative z-10">
            <h2 className="text-3xl lg:text-5xl font-black text-white mb-6">Cùng chúng tôi trong hành trình</h2>
            <p className="text-gray-300 font-medium text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
              Dù bạn là người sành trà hay mới bắt đầu khám phá, chúng tôi mời bạn trải nghiệm khác biệt mà trà chân thực, được tuyển chọn kỹ lưỡng mang lại.
            </p>
            <Link to="/shop">
              <button className="bg-primary text-[#0d1b10] px-10 py-4 rounded-xl font-black shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Khám phá bộ sưu tập
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default OurStory;