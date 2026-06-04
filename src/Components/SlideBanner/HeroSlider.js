import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import homeHeroBanners from "../../data/homeHeroBanners";
import { getPublicBannersApi } from "../../services/adminBannerApi";

const FALLBACK_IMAGE = "https://images.pexels.com/photos/2173176/pexels-photo-2173176.jpeg?auto=compress&cs=tinysrgb&w=1600";

const mapApiBannersToSlides = (items = []) => {
  const now = new Date();

  return items
    .filter((item) => !item?.isDeleted)
    .filter((item) => item?.isActive !== false)
    .filter((item) => {
      const startDate = item?.startDate ? new Date(item.startDate) : null;
      const endDate = item?.endDate ? new Date(item.endDate) : null;

      const validStart = !startDate || Number.isNaN(startDate.getTime()) || startDate <= now;
      const validEnd = !endDate || Number.isNaN(endDate.getTime()) || endDate >= now;
      return validStart && validEnd;
    })
    .sort((a, b) => {
      const orderA = Number(a?.displayOrder || 0);
      const orderB = Number(b?.displayOrder || 0);

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      const updatedA = new Date(a?.updatedAt || a?.createdAt || 0).getTime();
      const updatedB = new Date(b?.updatedAt || b?.createdAt || 0).getTime();
      return updatedB - updatedA;
    })
    .map((item, index) => {
      const fallback = homeHeroBanners[index % homeHeroBanners.length] || homeHeroBanners[0];

      return {
        id: item?.id || `banner-${index}`,
        title: fallback?.title || "Trải nghiệm nghệ thuật bình yên",
        description: fallback?.description || "Khám phá bộ sưu tập trà tuyển chọn của Tea Vault.",
        cta: fallback?.cta || "Xem bộ sưu tập",
        link: item?.redirectUrl || fallback?.link || "/shop",
        image: item?.imageUrl || fallback?.image || FALLBACK_IMAGE,
      };
    });
};

const HeroSlider = () => {
  const [slides, setSlides] = useState(homeHeroBanners);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadBanners = async () => {
      try {
        const response = await getPublicBannersApi();
        const apiSlides = mapApiBannersToSlides(response?.data || []);

        if (!mounted) {
          return;
        }

        if (apiSlides.length > 0) {
          setSlides(apiSlides);
          setIndex(0);
          return;
        }

        setSlides(homeHeroBanners);
      } catch (error) {
        if (mounted) {
          setSlides(homeHeroBanners);
        }
        console.warn("Không thể tải banner từ API public", error);
      }
    };

    loadBanners();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (paused || slides.length === 0) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, [paused, slides.length]);

  const prev = () => {
    if (!slides.length) return;
    setIndex((i) => (i - 1 + slides.length) % slides.length);
  };
  const next = () => {
    if (!slides.length) return;
    setIndex((i) => (i + 1) % slides.length);
  };
  const activeSlide = slides[index] || slides[0];
  const titleSegments = activeSlide?.title
    ? activeSlide.title.split("\n")
    : ["Trải nghiệm", "nghệ thuật bình yên"];

  return (
    <div
      className="relative min-h-[500px] md:min-h-[600px] flex items-center justify-center overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, i) => {
        const imageSrc = slide?.image || FALLBACK_IMAGE;
        return (
        <div
          key={i}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${i === index ? "opacity-100 z-10" : "opacity-0 z-0"}`}
          style={{
            backgroundImage: `linear-gradient(rgba(16,34,19,0.3), rgba(16,34,19,0.6)), url("${imageSrc}")`,
          }}
          aria-hidden={i !== index}
        />
        );
      })}

      <div className="relative z-20 text-center px-4 max-w-3xl">
        <h1 className="text-white text-5xl md:text-7xl font-black mb-6 leading-tight drop-shadow-sm">
          {titleSegments.map((line, idx) => (
            <span key={`${line}-${idx}`} className={idx === 1 ? "block text-primary" : "block"}>
              {line}
            </span>
          ))}
        </h1>
        <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto font-medium">
          {activeSlide?.description}
        </p>
        <div className="flex gap-4 justify-center">
          <Link to={activeSlide?.link || "/shop"}>
            <button className="bg-primary hover:bg-primary/90 text-[#0d1b10] px-8 py-3 rounded-lg font-bold transition-transform hover:scale-105 shadow-lg shadow-primary/25">
              {activeSlide?.cta || "Khám phá"}
            </button>
          </Link>
          <Link to="/about">
            <button className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white border border-white/30 px-8 py-3 rounded-lg font-bold transition-all">
              Câu chuyện của chúng tôi
            </button>
          </Link>
        </div>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
        aria-label="Trang trước"
      >
        <span className="material-symbols-outlined">chevron_left</span>
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 text-white rounded-full p-2"
        aria-label="Trang sau"
      >
        <span className="material-symbols-outlined">chevron_right</span>
      </button>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${i === index ? "bg-primary" : "bg-white/40"}`}
            aria-label={`Đến trang ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
