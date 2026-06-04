import React from 'react';

const ReturnsRefund = () => {
  const policies = [
    {
      icon: 'assignment_return',
      title: 'Điều kiện đổi trả',
      desc: 'Sản phẩm có thể đổi trả trong 7 ngày kể từ khi nhận nếu chưa mở, chưa sử dụng và còn nguyên bao bì. Chúng tôi muốn mọi sản phẩm đáp ứng kỳ vọng và giữ chuẩn chất lượng cao nhất.'
    },
    {
      icon: 'do_not_disturb_alt',
      title: 'Sản phẩm không nhận đổi trả',
      desc: 'Gói trà đã mở hoặc sản phẩm hư hỏng do bảo quản sai không đủ điều kiện đổi trả. Chính sách này đảm bảo chất lượng và an toàn cho mọi sản phẩm chúng tôi cung cấp.'
    },
    {
      icon: 'support_agent',
      title: 'Quy trình đổi trả',
      desc: 'Liên hệ đội hỗ trợ kèm mã đơn hàng và lý do đổi trả. Khi được duyệt, chúng tôi sẽ hướng dẫn các bước rõ ràng để quy trình diễn ra thuận tiện nhất.'
    },
    {
      icon: 'history',
      title: 'Thời gian hoàn tiền',
      desc: 'Hoàn tiền được xử lý trong 5–7 ngày làm việc sau khi nhận và kiểm tra hàng trả. Chúng tôi sẽ thông báo qua email khi bắt đầu hoàn tiền.'
    },
    {
      icon: 'swap_horiz',
      title: 'Tùy chọn đổi sản phẩm',
      desc: 'Bạn có thể đổi sang sản phẩm khác có giá trị bằng hoặc thấp hơn nếu còn hàng. Chỉ cần cho chúng tôi biết lựa chọn khi bắt đầu quy trình đổi trả, chúng tôi sẽ hỗ trợ tìm phương án phù hợp.'
    }
  ];

  return (
    <div className="bg-background-light text-[#0d1b10] font-display min-h-screen">
      
      <section 
        className="relative h-[350px] lg:h-[450px] flex items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: `linear-gradient(rgba(13, 27, 16, 0.7), rgba(13, 27, 16, 0.8)), url("https://images.unsplash.com/photo-1576092762791-dd9e2220cad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")` }}
      >
        <div className="text-center z-10 px-4">
          <h1 className="text-white text-4xl lg:text-6xl font-black mb-4 tracking-tight">Chính sách đổi trả & hoàn tiền</h1>
          <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Ưu tiên của chúng tôi là sự hài lòng của bạn với quy trình đổi trả minh bạch, hiệu quả.
          </p>
        </div>
      </section>

      <section className="max-w-[1024px] mx-auto px-4 md:px-10 py-16 lg:py-24">
        <div className="space-y-6">
          {policies.map((policy, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-14 h-14 rounded-full bg-surface-light flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">{policy.icon}</span>
              </div>
              <div className="flex-1 w-full">
                <h3 className="text-xl font-black mb-3 text-[#0d1b10]">{policy.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{policy.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[800px] mx-auto px-4 md:px-10 pb-16 lg:pb-24">
        <div className="bg-surface-light rounded-[2.5rem] p-10 text-center border border-gray-200 flex flex-col items-center">
          <h2 className="text-2xl font-black text-[#0d1b10] mb-4">Cần hỗ trợ đổi trả?</h2>
          <p className="text-gray-600 font-medium mb-8">Để được hỗ trợ đổi trả, vui lòng liên hệ:</p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[#0d1b10] font-bold mb-4">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">call</span>
              0357 130 804
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">mail</span>
              teavault2025@gmail.com
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
            <span className="material-symbols-outlined !text-[18px]">location_on</span>
            65D, 63 Lò Lu, Phường Trường Thạnh, TP. Thủ Đức, Hồ Chí Minh
          </div>
        </div>
      </section>

    </div>
  );
};

export default ReturnsRefund;