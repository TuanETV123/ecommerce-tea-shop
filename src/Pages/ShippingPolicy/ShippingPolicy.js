import React from 'react';

const ShippingPolicy = () => {
  const policies = [
    {
      icon: 'schedule',
      title: 'Thời gian xử lý',
      desc: 'Đơn hàng được xử lý trong 1-2 ngày làm việc sau khi xác nhận. Trong giai đoạn cao điểm, thời gian xử lý có thể lâu hơn một chút. Cảm ơn bạn đã kiên nhẫn khi chúng tôi chuẩn bị kỹ từng đơn.'
    },
    {
      icon: 'local_shipping',
      title: 'Phương thức vận chuyển',
      desc: 'Chúng tôi cung cấp tùy chọn giao tiêu chuẩn và giao nhanh qua các đơn vị vận chuyển uy tín trên toàn quốc. Chọn tốc độ giao phù hợp nhất khi thanh toán.'
    },
    {
      icon: 'location_on',
      title: 'Thời gian giao dự kiến',
      desc: '',
      list: [
        { label: 'Nội thành TP.HCM:', value: '1-2 ngày' },
        { label: 'Tỉnh/thành khác:', value: '2-5 ngày' }
      ]
    },
    {
      icon: 'payments',
      title: 'Phí vận chuyển',
      desc: 'Phí vận chuyển được tính dựa trên khối lượng đơn hàng và địa điểm giao.',
      highlight: '✨ Miễn phí vận chuyển cho đơn trên 500.000đ'
    },
    {
      icon: 'share_location',
      title: 'Theo dõi đơn hàng',
      desc: 'Khi đã gửi hàng, khách sẽ nhận mã theo dõi qua email hoặc SMS để theo dõi theo thời gian thực. Bạn luôn nắm được trạng thái đơn trên từng chặng.'
    },
    {
      icon: 'inventory_2',
      title: 'Kiện hàng thất lạc hoặc hư hỏng',
      desc: 'Vui lòng liên hệ đội hỗ trợ ngay nếu kiện hàng bị thất lạc hoặc hư hỏng trong quá trình vận chuyển. Chúng tôi sẽ phối hợp xử lý nhanh để đảm bảo bạn hài lòng.'
    }
  ];

  return (
    <div className="bg-background-light text-[#0d1b10] font-display min-h-screen">
      
      <section 
        className="relative h-[350px] lg:h-[450px] flex items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: `linear-gradient(rgba(13, 27, 16, 0.6), rgba(13, 27, 16, 0.8)), url("https://images.unsplash.com/photo-1587734195503-904fca47e0e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")` }}
      >
        <div className="text-center z-10 px-4">
          <h1 className="text-white text-4xl lg:text-6xl font-black mb-4 tracking-tight">Chính sách vận chuyển</h1>
          <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Cam kết giao hàng đúng hẹn và an toàn.
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
                {policy.desc && <p className="text-gray-600 font-medium leading-relaxed">{policy.desc}</p>}
                
                {policy.list && (
                  <ul className="mt-2 space-y-2">
                    {policy.list.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-600 font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                        <span className="font-bold text-[#0d1b10]">{item.label}</span> {item.value}
                      </li>
                    ))}
                  </ul>
                )}
                
                {policy.highlight && (
                  <div className="mt-4 inline-block bg-primary/10 border border-primary/20 text-[#0d1b10] font-bold text-sm px-4 py-2 rounded-lg">
                    {policy.highlight}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[800px] mx-auto px-4 md:px-10 pb-16 lg:pb-24">
        <div className="bg-surface-light rounded-[2.5rem] p-10 text-center border border-gray-200">
          <h2 className="text-2xl font-black text-[#0d1b10] mb-4">Thắc mắc về vận chuyển?</h2>
          <p className="text-gray-600 font-medium mb-8">Cứ liên hệ với chúng tôi — luôn sẵn sàng hỗ trợ.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-[#0d1b10] font-bold">
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
        </div>
      </section>

    </div>
  );
};

export default ShippingPolicy;