import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import HeroSlider from "../../Components/SlideBanner/HeroSlider";
import { getProductsApi } from "../../services/productApi";

function mapFavoriteProduct(item) {
  return {
    id: item?.id,
    name: item?.name || "Sản phẩm",
    price: Number(item?.price || 0),
    desc: item?.origin || item?.categoryName || "Đang cập nhật",
    tag: item?.featured ? "BÁN CHẠY" : "",
    img:
      item?.imageUrl ||
      "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80",
  };
}

function formatCurrency(value) {
  return `$${Number(value || 0).toFixed(2)}`;
}

const Home = () => {
  const [favorites, setFavorites] = useState([]);
  const [favoritesLoading, setFavoritesLoading] = useState(true);

  const categories = [
    {
      key: "green",
      name: "Trà xanh",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDNRoGoGQkdo5QM9Vve4ZOB1feIFhttSdYnDBa9PuEYtJOjiasM4eTnJYWaEb5RLoTpivN0JuFDNFb_N2rEzw-5Fu14CeggbygWEfzvK1nP1XpXexZiBpxPaU2J83GPuONIwUIDQ_rBvPw-QAqWmfd4-4I4tdqhOc1d0gfW6JlawhN9PAZECARqQ9wmwYDoY419n8ZHl0HaWNGlYu4saIZEy9RPltdbopNxyBaQdj9nW-YZ8voUXpr0O8Gb2usCmX8F_9Er3zNpL-1O",
    },
    {
      key: "fruit",
      name: "Trà trái cây",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkf-g9s9uMf9fvsyf8HLC1FW5vk1LfrynxGZYHFHGQeFRfrxCfOO92uJZloNcIwZlmUJ7OXJcaM-IP5mjnn55YKJP_sQae2GuG0rmVWpcF9vkvUweqHrJZBMYs8P0ToVRdA8luRfeFurQXm2Cl96nj_ugGkyPP-9lqZNf9qafDdAzmnbjZiDbR3Xc3dDQ6x3nNtP_mIdngqgEsUZ7mw2MnMGaYgde2tgOJNX78Gvj67RpBOOE-dZWFxx4g79sz8fDpftsI9_b-q89V",
    },
    {
      key: "herbal",
      name: "Trà thảo mộc và hoa",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCEGJSAQyNEBumm6px14DPffIVc_3Kfq_fPaSwwRMmHgslFXO6o1i-zlXYk8VkZLOVGBH0pNSskkK2yba2W97zxoOSl_pWGpcf8WHhhAbHjVekwBTUl-Ew0ikknPDmcS7K2BCqPXswPYcKNM3ZLSmutxPEzukUuSUERP7i73W5JXkCn8d-HkLE8T-UUWvaJTQobyYhB6kTi2UTqzkDh3VLsAUPuKB5t8lU--loCpz_wBqP92pxqmKFDhR2LABaZVMSNRsRb5r3hBcnl",
    },
    {
      key: "oolong",
      name: "Trà Oolong",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCGmX8G7ewmtAniJ0-9cI-yiKpCpOEhJJWBluWUzMo6K0YsSUlr0z5xB5gUIPwdvSoVZQhez9LAvbJGJM7zb7M-c1U8XLsE-P_7taBayqRFrsBL-FVytZ00Jz0_5UVMbWsMJIBFMXQWnRz41QJ7-O4sblWchYdVGomgx5oknDC1dnE79fNu3HB3ODDuVWgzsDn3-7KbiaZGN1zj-DpIbmDTKJljomALGrKPHuf_R9pyhGg1WecTsElO5XVSoss6V6VcHjzZ1Npa9L-1",
    },
  ];

  return (
    <div className="bg-background-light text-[#0d1b10] font-display">
      <HeroSlider></HeroSlider>

      <section className="max-w-[1440px] mx-auto px-4 md:px-10 pt-16 pb-8">
        <div className="flex flex-col items-center mb-10">
          <span className="text-primary font-bold tracking-widest uppercase text-sm">
            Khám phá
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-2">
            Chọn theo danh mục
          </h2>
          <div className="h-1 w-20 bg-primary rounded-full mt-2"></div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <Link
              to={`/shop?categoryKey=${encodeURIComponent(cat.key)}`}
              key={i}
              className="group relative overflow-hidden rounded-xl aspect-[4/5] md:aspect-square shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 block"
            >
              <div
                className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
                style={{ backgroundImage: `url("${cat.img}")` }}
              ></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 p-5 w-full flex flex-col gap-1">
                <p className="text-white text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="w-full bg-surface-light py-16 md:py-24">
        <div className="px-4 md:px-10 max-w-[1440px] mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
            <div className="w-full md:w-1/2 relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDeHbsJYGeTazYnwl-9JLA4yHKMpi11TvuMEWwpMuhnvevsR4Zw68n46KfsTp_3Q-3K_r3_XCQ3wdUmVialHw94vZfO_ACknPdfsavNcrDM2eap4tVA8K6desQj_BNYdCjFKwLBgvd77Prt7zsD1t7DMePlmPpODWJWAytD3i-wq7nmJi1lKpX3fhjsQQcWosks-q6lCAKgrc_RfQQWqTcEKchC6VGj9QyNSZwK6oo2URDkoSYV0QpM9oBGzyxHjo7i7703AL6u13n2"
                alt="Bố trí pha trà"
                className="w-full h-full object-cover aspect-[4/3]"
              />
              <div className="absolute inset-0 bg-primary/10 mix-blend-multiply"></div>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-6 items-start">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-[#0d1b10] text-sm font-bold">
                <span className="material-symbols-outlined text-base">eco</span>{" "}
                Nguồn cung bền vững
              </div>
              <h2 className="text-3xl md:text-5xl font-black leading-tight">
                Từ núi đến ly của bạn
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Chúng tôi hợp tác trực tiếp với các vườn trà nhỏ tại châu Á để
                mang tới bạn lá trà tươi, có nguồn gốc đạo đức. Mỗi ngụm trà kể
                một câu chuyện về truyền thống, tay nghề và sự tôn trọng thiên
                nhiên.
              </p>
              <ul className="flex flex-col gap-3 mt-2">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>{" "}
                  Chứng nhận hữu cơ 100%
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>{" "}
                  Bao bì không nhựa
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary">
                    check_circle
                  </span>{" "}
                  Thực hành thương mại công bằng
                </li>
              </ul>
              <Link to="/about">
                <button className="mt-4 px-8 py-3 bg-[#0d1b10] text-white font-bold rounded-lg hover:bg-opacity-80 transition-opacity">
                  Đọc sứ mệnh của chúng tôi
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
