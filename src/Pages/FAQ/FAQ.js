import React, { useState } from 'react';

const FAQ = () => {
  const [openId, setOpenId] = useState('0-0');

  const toggleAccordion = (id) => {
    setOpenId(openId === id ? null : id);
  };

  const faqData = [
    {
      category: 'Vận chuyển',
      icon: 'local_shipping',
      items: [
        {
          q: 'Giao hàng mất bao lâu?',
          a: 'Giao tiêu chuẩn thường mất 5-8 ngày làm việc trong nước. Giao nhanh có sẵn tại bước thanh toán và thường đến trong 1-3 ngày làm việc.'
        },
        {
          q: 'Có giao hàng toàn quốc không?',
          a: 'Có! Chúng tôi giao hàng toàn quốc và có giao quốc tế đến một số nước như Hoa Kỳ, Canada, Vương quốc Anh và Nhật Bản.'
        },
        {
          q: 'Làm sao để theo dõi đơn hàng?',
          a: 'Khi đơn hàng được xử lý và bàn giao cho đơn vị vận chuyển, bạn sẽ nhận email có mã vận đơn và liên kết để theo dõi.'
        }
      ]
    },
    {
      category: 'Đơn hàng',
      icon: 'inventory_2',
      items: [
        {
          q: 'Tôi có thể sửa đơn hàng sau khi đặt không?',
          a: 'Chúng tôi xử lý đơn hàng nhanh, nhưng nếu bạn liên hệ trong 2 giờ sau khi đặt, chúng tôi thường có thể sửa hoặc hủy đơn.'
        },
        {
          q: 'Các phương thức thanh toán nào được chấp nhận?',
          a: 'Chúng tôi chấp nhận thẻ tín dụng (Visa, Mastercard, Amex), PayPal và ví điện tử an toàn như Apple Pay, Google Pay.'
        },
        {
          q: 'Có giá trị đơn hàng tối thiểu không?',
          a: 'Không có giá trị tối thiểu khi mua tại TeaVault! Tuy nhiên, đơn trên $50 sẽ được miễn phí giao tiêu chuẩn.'
        }
      ]
    },
    {
      category: 'Sản phẩm',
      icon: 'spa',
      items: [
        {
          q: 'Trà Teavault có hữu cơ không?',
          a: 'Có, phần lớn trà của chúng tôi được chứng nhận hữu cơ 100%. Chúng tôi hợp tác với các trang trại bền vững không dùng thuốc trừ sâu tổng hợp và hóa chất.'
        },
        {
          q: 'Bảo quản trà như thế nào?',
          a: 'Để giữ độ tươi tốt nhất, hãy bảo quản trà trong hộp kín, nơi mát, tối và khô, tránh mùi mạnh và ánh nắng trực tiếp.'
        },
        {
          q: 'Hạn sử dụng của trà là bao lâu?',
          a: 'Khi bảo quản đúng cách, trà lá rời có thể tươi 12-24 tháng. Matcha và trà xanh nên dùng trong 6 tháng sau khi mở để có hương vị tốt nhất.'
        }
      ]
    },
    {
      category: 'Đổi trả',
      icon: 'sync',
      items: [
        {
          q: 'Tôi có thể đổi/trả đơn hàng không?',
          a: 'Chúng tôi muốn bạn hài lòng với trà. Nếu chưa hài lòng, sản phẩm chưa mở có thể đổi/trả trong 30 ngày kể từ khi giao.'
        },
        {
          q: 'Làm sao để bắt đầu đổi trả?',
          a: 'Chỉ cần liên hệ đội hỗ trợ kèm mã đơn hàng, chúng tôi sẽ cung cấp mã xác nhận đổi trả và hướng dẫn gửi hàng.'
        },
        {
          q: 'Ai trả phí đổi trả?',
          a: 'Nếu đổi/trả do lỗi của chúng tôi hoặc sản phẩm lỗi, chúng tôi sẽ chi trả phí vận chuyển. Trường hợp đổi/trả thông thường, khách hàng tự chi trả phí gửi lại.'
        }
      ]
    }
  ];

  return (
    <div className="flex-1 w-full max-w-[1024px] mx-auto px-4 md:px-10 py-16 lg:py-24 font-display bg-background-light text-[#0d1b10] min-h-screen">
      
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">Câu hỏi thường gặp</h1>
        <p className="text-gray-600 text-lg font-medium">
          Tất cả thông tin cần biết về sản phẩm Teavault, vận chuyển và dịch vụ.
        </p>
      </div>

      <div className="space-y-12 mb-20">
        {faqData.map((section, secIdx) => (
          <div key={secIdx} className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[20px]">{section.icon}</span>
              </div>
              <h2 className="text-2xl font-black text-[#0d1b10]">{section.category}</h2>
            </div>
            
            <div className="flex flex-col gap-3">
              {section.items.map((item, itemIdx) => {
                const id = `${secIdx}-${itemIdx}`;
                const isOpen = openId === id;
                
                return (
                  <div 
                    key={id} 
                    className={`bg-white rounded-2xl border ${isOpen ? 'border-primary shadow-md' : 'border-gray-100 shadow-sm'} overflow-hidden transition-all duration-300`}
                  >
                    <button 
                      onClick={() => toggleAccordion(id)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-surface-light transition-colors"
                    >
                      <span className="font-bold text-[#0d1b10] pr-8">{item.q}</span>
                      <span className={`material-symbols-outlined text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary' : ''}`}>
                        expand_more
                      </span>
                    </button>
                    <div 
                      className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                    >
                      <div className="h-px w-full bg-gray-100 mb-4"></div>
                      <p className="text-gray-600 font-medium leading-relaxed">
                        {item.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface-light rounded-3xl p-10 md:p-16 text-center border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-black text-[#0d1b10] mb-4">Vẫn còn thắc mắc?</h2>
        <p className="text-gray-600 font-medium mb-8">
          Đội ngũ chúng tôi sẵn sàng hỗ trợ. Liên hệ bất cứ lúc nào qua điện thoại hoặc email.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a href="tel:0357130804" className="flex items-center gap-2 text-primary hover:text-green-600 transition-colors font-bold">
            <span className="material-symbols-outlined text-[20px]">call</span>
            0357 130 804
          </a>
          <span className="hidden sm:block text-gray-300">|</span>
          <a href="mailto:teavault2025@gmail.com" className="flex items-center gap-2 text-gray-500 hover:text-[#0d1b10] transition-colors font-bold">
            <span className="material-symbols-outlined text-[20px]">mail</span>
            teavault2025@gmail.com
          </a>
        </div>
      </div>

    </div>
  );
};

export default FAQ;