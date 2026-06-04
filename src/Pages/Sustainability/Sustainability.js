import React from "react";
import { Link } from "react-router-dom";

const Sustainability = () => {
  const pillars = [
    {
      icon: "eco",
      title: "Nguồn cung đạo đức",
      desc: "Chúng tôi làm việc trực tiếp với nông dân trồng trà theo canh tác bền vững, đảm bảo thu nhập công bằng và giữ gìn phương pháp canh tác truyền thống tôn trọng đất.",
    },
    {
      icon: "inventory_2",
      title: "Bao bì thân thiện môi trường",
      desc: "Bao bì của chúng tôi 100% có thể tái chế và phân hủy sinh học. Thiết kế tối giản giúp giảm rác thải mà vẫn bảo vệ chất lượng trà.",
    },
    {
      icon: "volunteer_activism",
      title: "Trao quyền cộng đồng",
      desc: "Chúng tôi đầu tư vào cộng đồng địa phương qua chương trình giáo dục, sáng kiến y tế và phát triển hạ tầng tại vùng trồng trà.",
    },
  ];

  return (
    <div className="bg-background-light text-[#0d1b10] font-display min-h-screen">
      <section
        className="relative h-[400px] lg:h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(13, 27, 16, 0.4), rgba(13, 27, 16, 0.7)), url("https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")`,
        }}
      >
        <div className="text-center z-10 px-4">
          <h1 className="text-white text-4xl lg:text-7xl font-black mb-6 tracking-tight">
            Nuôi dưỡng thiên nhiên, <br />
            từng lá một
          </h1>
          <p className="text-gray-200 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed">
            Cam kết bền vững của chúng tôi vượt xa trà — đó là lời hứa với trái
            đất và các thế hệ tương lai.
          </p>
        </div>
      </section>

      <section className="max-w-[1440px] mx-auto px-4 md:px-10 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <div className="flex-1 w-full">
            <div className="aspect-video lg:aspect-square rounded-[2.5rem] overflow-hidden shadow-md border border-gray-100 group">
              <img
                src="https://images.unsplash.com/photo-1558160074-4d7d8bdf4256?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                alt="Thu hái lá trà tươi"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl lg:text-5xl font-black text-[#0d1b10] mb-8">
              Hành trình bền vững của chúng tôi
            </h2>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed font-medium">
              Tại Teavault, bền vững không chỉ là khẩu hiệu — mà được dệt vào
              mọi bước trong quy trình. Từ lúc hái lá đến khi vào ly của bạn,
              chúng tôi đảm bảo thực hành tôn trọng đất, hỗ trợ cộng đồng nông
              hộ và gìn giữ nghệ thuật canh tác trà truyền thống cho thế hệ sau.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-light py-16 lg:py-24 border-y border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 text-center">
          <h2 className="text-3xl lg:text-4xl font-black text-[#0d1b10] mb-12">
            Ba trụ cột
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((pillar, i) => (
              <div
                key={i}
                className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 flex flex-col items-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-8 border border-primary/20">
                  <span className="material-symbols-outlined text-4xl">
                    {pillar.icon}
                  </span>
                </div>
                <h3 className="text-xl font-black mb-4 text-[#0d1b10]">
                  {pillar.title}
                </h3>
                <p className="text-gray-500 font-medium text-sm leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1024px] mx-auto px-4 md:px-10 py-16 lg:py-24 text-center">
        <h2 className="text-3xl lg:text-4xl font-black text-[#0d1b10] mb-6">
          Cùng chúng tôi tạo tương lai bền vững
        </h2>
        <p className="text-gray-600 font-medium text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
          Mỗi đơn hàng đều ủng hộ canh tác đạo đức, thực hành thân thiện môi
          trường và cộng đồng phát triển.
        </p>
        <Link to="/our-story">
          <button className="bg-[#0d1b10] text-white px-10 py-4 rounded-xl font-black shadow-lg hover:bg-opacity-80 active:scale-[0.98] transition-all">
            Tìm hiểu thêm về hành trình
          </button>
        </Link>
      </section>
    </div>
  );
};

export default Sustainability;
