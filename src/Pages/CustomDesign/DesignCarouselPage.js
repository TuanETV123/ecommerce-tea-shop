import React, { useState, useMemo, useEffect } from "react";
import {
  Layout,
  Typography,
  Space,
  ConfigProvider,
  Tag,
  FloatButton,
} from "antd";
import {
  ArrowLeftOutlined,
  ShoppingOutlined,
  AppstoreFilled,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

// thay data ở đây
const TEA_PRODUCTS = [
  {
    id: "jasmine",
    title: "Jasmine Reserve",
    type: "Bạch Lộ Lục Trà",
    price: "550.000₫",
    img: "5eb158ee-ca2c-4a51-a7bb-738004e0a52e.jpg",
    bg: "https://res.cloudinary.com/dtlatkdui/image/upload/v1774542484/tea-products/gqr10wcrwuryycujaiyx.jpg",
    desc: "Hương nhài tinh khiết được ướp thủ công qua 7 tuần trăng.",
  },
  {
    id: "matcha",
    title: "Matcha Gold",
    type: "Nghiền Đá Non",
    price: "420.000₫",
    img: "ed22a479-99fc-455d-8850-1c4af7296374.jpg",
    bg: "https://res.cloudinary.com/dtlatkdui/image/upload/v1774287990/tea-products/axlhieuacqztaymoda1j.jpg",
    desc: "Bột trà xanh siêu mịn, giữ trọn diệp lục tố và vị umami đậm đà.",
  },
  {
    id: "vault",
    title: "The Vault Set",
    type: "Limited Collection",
    price: "1.200.000₫",
    img: "f6f112f0-388b-4a4b-9559-20788d7cc02a.jpg",
    bg: "https://res.cloudinary.com/dtlatkdui/image/upload/v1774287931/tea-products/nhhkcceeigjsft81elre.jpg",
    desc: "Hệ thống bảo quản kép bao gồm lon thiếc và hộp bìa kiến trúc.",
  },
];

const SpatialTeaPage = () => {
  const [activeId, setActiveId] = useState("vault");
  const [isPaused, setIsPaused] = useState(false); // For pause on hover

  const activeProduct = useMemo(
    () => TEA_PRODUCTS.find((p) => p.id === activeId),
    [activeId],
  );

  useEffect(() => {
    if (isPaused) return; // Stop timer if user is hovering

    const interval = setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = TEA_PRODUCTS.findIndex((p) => p.id === currentId);
        const nextIndex = (currentIndex + 1) % TEA_PRODUCTS.length;
        return TEA_PRODUCTS[nextIndex].id;
      });
    }, 5000);

    return () => clearInterval(interval); // Clean up on unmount
  }, [isPaused]);

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#13ec37" } }}>
      <Layout className="min-h-screen bg-black overflow-hidden relative">
        <div className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out">
          <img
            key={activeProduct.bg}
            src={activeProduct.bg}
            alt="Dynamic Mood"
            className="w-full h-full object-cover opacity-40 blur-md scale-105 animate-pulse-slow"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </div>

        <div className="absolute top-0 w-full flex justify-between items-center px-12 py-8 z-30">
          <Space size="middle">
            <FloatButton
              icon={<ArrowLeftOutlined />}
              shape="circle"
              style={{ position: "static" }}
            />
            <Text className="text-white font-black tracking-tighter uppercase text-xl">
              TEAVAULT
            </Text>
          </Space>
          <Tag
            color="black"
            className="border-primary text-primary font-mono px-4 py-1"
          >
            BATCH #2026-A
          </Tag>
        </div>

        <div className="absolute top-[12%] w-full text-center z-30 px-6 pointer-events-none">
          <Title
            level={5}
            className="!text-gray-400 uppercase tracking-[0.4em] !m-0 !text-xs"
          >
            {activeProduct.type}
          </Title>
          <Title
            level={1}
            className="!text-white !text-7xl !font-black !tracking-tighter !m-0 !leading-none uppercase"
          >
            {activeProduct.title.split(" ")[0]}{" "}
            <span className="text-primary">
              {activeProduct.title.split(" ")[1]}
            </span>
          </Title>
          <Paragraph className="text-gray-300 max-w-md mx-auto mt-4 font-medium italic">
            "{activeProduct.desc}"
          </Paragraph>
        </div>

        {/* SPATIAL CYLINDER VIEW */}
        <Content
          className="relative z-10 flex items-center justify-center h-full pt-20"
          onMouseEnter={() => setIsPaused(true)} // Pause timer
          onMouseLeave={() => setIsPaused(false)} // Resume timer
        >
          <div
            className="relative flex items-center justify-center w-full h-[500px]"
            style={{ perspective: "1200px" }}
          >
            {TEA_PRODUCTS.map((product, index) => {
              const isActive = product.id === activeId;
              const centerIdx = TEA_PRODUCTS.findIndex(
                (p) => p.id === activeId,
              );
              const offset = index - centerIdx;

              const rotateY = offset * 28;
              const translateZ = isActive ? 180 : -150;
              const translateX = offset * 320;

              return (
                <div
                  key={product.id}
                  onClick={() => setActiveId(product.id)}
                  className={`absolute cursor-pointer transition-all duration-700 ease-out ${
                    isActive
                      ? "z-30 w-[340px] h-[480px]"
                      : "z-10 w-[260px] h-[380px] opacity-40 grayscale"
                  }`}
                  style={{
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                  }}
                >
                  <div
                    className={`h-full w-full border-[3px] bg-white overflow-hidden transition-colors ${isActive ? "border-primary shadow-[0_0_50px_rgba(19,236,55,0.3)]" : "border-zinc-800"}`}
                  >
                    <img
                      src={product.bg} // Note: Using .bg as per your source, change to .img if needed
                      className="w-full h-full object-cover"
                      alt={product.title}
                    />

                    <div className="absolute bottom-0 inset-x-0 bg-black/80 backdrop-blur-md p-5 border-t border-zinc-800">
                      <div className="flex justify-between items-center mb-1">
                        <Text className="text-white font-black uppercase text-xs tracking-widest">
                          {product.title}
                        </Text>
                        <Text className="text-primary font-mono text-[10px]">
                          {index + 1}/03
                        </Text>
                      </div>
                      {isActive && (
                        <div className="flex justify-between items-center mt-2 animate-fade-in">
                          <Text className="text-white font-bold">
                            {product.price}
                          </Text>
                          <ShoppingOutlined className="text-primary text-xl" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Content>

        {!isPaused && (
          <div
            className="absolute bottom-0 left-0 h-1 bg-primary transition-all duration-[5000ms] ease-linear"
            style={{ width: "100%" }}
            key={activeId}
          />
        )}

        <FloatButton
          icon={<AppstoreFilled />}
          type="primary"
          style={{ right: 48, bottom: 48 }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default SpatialTeaPage;
