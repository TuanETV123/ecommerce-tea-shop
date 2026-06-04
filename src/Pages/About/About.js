import React from "react";

const About = () => {
  return (
    <div className="flex flex-col flex-1 w-full bg-background-light text-[#0d1b10] font-display">
      <div className="@container w-full">
        <div
          className="flex min-h-[500px] md:min-h-[600px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-center justify-center p-8 text-center relative"
          style={{
            backgroundImage:
              'linear-gradient(rgba(16, 34, 19, 0.4) 0%, rgba(16, 34, 19, 0.6) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuB-PCttBqbQpcYlIB9Ctvi8UscLzMkR1DkqEfnms983XnTuN0sSziGMOossjpjQW3sGkHxIRydUIqhfO9pR6h39VldzwvFLbHugKOmNcpvPo8aLno-s84GuQDEXH7-FjbCSYsH2QSE6ZHUNyZYPmHkG1xCXKM-w4Ni-rs9doOiFZpZJKhYMRsCB4Dy3CaHIwB-DTPtCyg71UYuYYSrZ5mxAwvB1pEmIMSypO-iDIEXtO8BghfYX6KV4_inx_PkAil2PuLvHaMdg4yj8")',
          }}
        >
          <div className="flex flex-col gap-4 max-w-3xl z-10">
            <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight drop-shadow-lg">
              Ươm nên một thế giới tốt đẹp hơn
            </h1>
            <h2 className="text-gray-100 text-base md:text-xl font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-md">
              Từ đồi núi sương mù Darjeeling đến ly của bạn, chúng tôi cam kết
              kết nối mọi người bằng trà hữu cơ bền vững.
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-1 justify-center py-16 px-4 md:px-10">
        <div className="flex flex-col max-w-[1024px] flex-1 gap-16 md:gap-24">
          <section className="flex flex-col md:flex-row gap-10 items-center">
            <div className="flex-1 flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <span className="text-primary font-bold tracking-wider text-sm uppercase">
                  Nguồn gốc
                </span>
                <h2 className="text-[#0d1b10] text-3xl md:text-4xl font-bold leading-tight">
                  Bắt đầu từ một căn bếp nhỏ với giấc mơ lớn.
                </h2>
                <p className="text-[#0d1b10]/80 text-lg font-normal leading-relaxed">
                  Chúng tôi đi khắp các châu lục để tìm lá trà hoàn hảo, xây
                  dựng mối quan hệ với nông dân cùng chia sẻ đam mê về sự tinh
                  khiết. Điều bắt đầu từ hành trình tìm tách trà hoàn hảo đã trở
                  thành cộng đồng yêu trà đề cao chất lượng và minh bạch.
                </p>
              </div>
              <div className="flex gap-4 pt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#0d1b10]">10+</span>
                  <span className="text-sm text-gray-500">
                    Năm tìm nguồn
                  </span>
                </div>
                <div className="w-px bg-gray-200 h-12"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-2xl font-bold text-[#0d1b10]">50+</span>
                  <span className="text-sm text-gray-500">Trang trại đối tác</span>
                </div>
              </div>
            </div>
            <div className="flex-1 w-full">
              <div className="w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl relative">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage:
                      'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBKJdzF7Ri7bZSSF4jWpXAtc_tWrIR1J7z20tMu-vKKeazzapSV5qQna2zIF1tPnJsdvdDIPn8eu_gaB43oTNWMQvaD_lqQewGThjtekB7Zk5miTe4ZE3v0A7xY-7iV7evJ3KLBU6LmT0dbtKeb02-byTO9LqV17KCtZNwNLARXXpbq5m5dtLOyWzpYzxHgSRHOMDE61jNOQJNzH2PYuo5kR3g_fXNHP9eazn0R-DUxXeCM_mIyCigS62bVD2puA948KZrQhIfR4n-A")',
                  }}
                ></div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-px bg-primary w-8"></div>
                <p className="text-primary text-sm font-medium">
                  Trang trại chứng nhận thương mại công bằng
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-10">
            <div className="text-center max-w-2xl mx-auto flex flex-col gap-4">
              <h2 className="text-[#0d1b10] text-3xl md:text-4xl font-bold">
                Giá trị của chúng tôi
              </h2>
              <p className="text-[#0d1b10]/80 text-lg">
                Bền vững không chỉ là khẩu hiệu. Đó là đất mẹ. Chúng tôi tin vào
                sự minh bạch, tinh khiết và cộng đồng trong mọi ngụm trà.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="group flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    eco
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#0d1b10] text-xl font-bold">
                    Nguồn hữu cơ
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    Trang trại hữu cơ chứng nhận 100% không dùng thuốc trừ sâu
                    độc hại. Chúng tôi tôn trọng đất mẹ nuôi dưỡng chúng ta.
                  </p>
                </div>
              </div>

              <div className="group flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    recycling
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#0d1b10] text-xl font-bold">
                    Không rác thải
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    Bao bì tự hủy không để lại dấu vết. Từ hộp đến túi, tất cả
                    đều trở về thiên nhiên.
                  </p>
                </div>
              </div>

              <div className="group flex flex-col gap-4 rounded-xl border border-gray-100 bg-white p-6 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">
                    volunteer_activism
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[#0d1b10] text-xl font-bold">
                    Hái bằng tay
                  </h3>
                  <p className="text-gray-500 leading-relaxed">
                    Chọn bằng tay để đảm bảo chỉ lá trà tốt nhất đến với nghi
                    thức buổi sáng của bạn.
                  </p>
                </div>
              </div>
            </div>
          </section>


          <section className="rounded-3xl bg-surface-light border border-gray-100 p-8 md:p-16 text-center flex flex-col items-center gap-6 shadow-sm">
            <span className="material-symbols-outlined text-primary text-5xl">
              local_cafe
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-[#0d1b10]">
              Sẵn sàng cảm nhận sự khác biệt?
            </h2>
            <p className="text-gray-600 font-medium max-w-lg">
              Tham gia cộng đồng yêu trà và nhận giảm 15% cho đơn hàng trà hữu
              cơ bền vững đầu tiên.
            </p>
            <div className="flex w-full max-w-md gap-3 mt-4">
              <input
                className="flex-1 rounded-xl border-none focus:ring-2 focus:ring-primary h-14 px-5 bg-white shadow-sm text-[#0d1b10] font-medium"
                placeholder="Nhập email"
                type="email"
              />
              <button className="bg-primary text-[#0d1b10] font-black px-8 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-md shadow-primary/20">
                Tham gia
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
