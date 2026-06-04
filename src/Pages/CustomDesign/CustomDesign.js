import React, { useEffect, useMemo, useState } from "react";
import DesignCarouselPage from "./DesignCarouselPage";
import {
  Layout,
  Button,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  ConfigProvider,
  Radio,
  InputNumber,
  Spin,
  Divider,
  FloatButton,
} from "antd";
import {
  ArrowRightOutlined,
  HeartFilled,
  ShoppingOutlined,
  PlusOutlined,
  MinusOutlined,
  BlockOutlined,
  EnvironmentOutlined,
  ColumnHeightOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { addToCart } from "../../redux/cartSlice/cartSlice";
import { designVariants } from "../../data/designVariants";
import { getAddonsApi } from "../../services/addonApi";

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;

const CUSTOM_DESIGN_PRODUCT = {
  productId: "custom-design-product",
  name: "TÚI TRÀ GIẤY THỦ CÔNG",
  desc: "Một tuyệt tác về sự thuần khiết trong cấu trúc. Những túi trà giấy dâu tằm được gấp thủ công, nở rộ khi gặp nước, sử dụng kỹ thuật Gấp Origami Truyền Thống.",
  variants: designVariants,
};

const formatVnd = (value) => `${Number(value || 0).toLocaleString("vi-VN")}₫`;

const EmeraldZenithTheme = {
  token: {
    colorPrimary: "#13ec37",
    borderRadius: 2,
    fontFamily: "Work Sans, sans-serif",
    colorBgBase: "#f8fcf9",
  },
  components: {
    Button: { borderRadius: 0, controlHeight: 54, fontWeight: 900 },
    Radio: { buttonBorderRadius: 0, buttonCheckedBg: "rgba(19, 236, 55, 0.1)" },
  },
};

const CustomDesignPage = () => {
  const [selectedStyle, setSelectedStyle] = useState(
    CUSTOM_DESIGN_PRODUCT.variants[0],
  );
  const [addons, setAddons] = useState([]);
  const [selectedAddonId, setSelectedAddonId] = useState("");
  const [loadingAddons, setLoadingAddons] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    const loadAddons = async () => {
      try {
        setLoadingAddons(true);
        const response = await getAddonsApi();
        if (mounted)
          setAddons(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        if (mounted) toast.error("Không tải được danh sách add-on.");
      } finally {
        if (mounted) setLoadingAddons(false);
      }
    };
    loadAddons();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedAddon = useMemo(
    () => addons.find((a) => a.id === selectedAddonId) || null,
    [addons, selectedAddonId],
  );
  const totalPrice = useMemo(
    () =>
      Number(selectedStyle.unitPrice || 0) + Number(selectedAddon?.price || 0),
    [selectedStyle, selectedAddon],
  );

  const handleAddToCart = () => {
    const detailId = `${selectedStyle.id}-${selectedAddon?.id || "none"}`;
    dispatch(
      addToCart({
        productId: CUSTOM_DESIGN_PRODUCT.productId,
        name: CUSTOM_DESIGN_PRODUCT.name,
        img: selectedStyle.heroImage,
        quantity,
        productDetail: {
          id: detailId,
          addonId: selectedAddon?.id || null,
          sizeLabel: selectedStyle.label,
          unitPrice: totalPrice,
        },
      }),
    );
    toast.success("Đã thêm vào giỏ hàng.");
  };

  return (
    <ConfigProvider theme={EmeraldZenithTheme}>
      <Layout className="min-h-screen bg-background">
        <Content className="py-12 md:py-20">
          <section className="mb-32">
            <DesignCarouselPage />
          </section>

          <section className="bg-[#f1f8f3] py-24 mb-32">
            <div className="max-w-7xl mx-auto px-12">
              <Title
                level={2}
                className="!font-black !tracking-tighter uppercase mb-2"
              >
                Kỹ thuật của Sự Nở Rộ
              </Title>
              <div className="h-1 w-24 bg-primary mb-16" />
              <Row gutter={[48, 48]}>
                <Col xs={24} md={8}>
                  <div className="bg-white w-16 h-16 flex items-center justify-center mb-6 text-2xl text-primary shadow-sm">
                    <BlockOutlined />
                  </div>
                  <Title level={4} className="!font-black uppercase">
                    Origami Truyền Thống
                  </Title>
                  <Text className="text-gray-500 leading-relaxed">
                    Khóa chặt trà lá bên trong chỉ bằng lực căng. Không keo,
                    không hóa chất.
                  </Text>
                </Col>
                <Col xs={24} md={8}>
                  <div className="bg-white w-16 h-16 flex items-center justify-center mb-6 text-2xl text-primary shadow-sm">
                    <EnvironmentOutlined />
                  </div>
                  <Title level={4} className="!font-black uppercase">
                    Sợi Cây Dâu Tằm
                  </Title>
                  <Text className="text-gray-500 leading-relaxed">
                    Sợi dài và xốp cho phép tinh dầu trà đi qua trong khi giữ
                    lại được cả những vụn trà nhỏ nhất.
                  </Text>
                </Col>
                <Col xs={24} md={8}>
                  <div className="bg-white w-16 h-16 flex items-center justify-center mb-6 text-2xl text-primary shadow-sm">
                    <ColumnHeightOutlined />
                  </div>
                  <Title level={4} className="!font-black uppercase">
                    Thể tích Thích ứng
                  </Title>
                  <Text className="text-gray-500 leading-relaxed">
                    Cấu trúc 8.5cm được thiết kế để giãn nở khi ngậm nước, tạo
                    ra dòng chảy 360 độ.
                  </Text>
                </Col>
              </Row>
            </div>
          </section>
        </Content>
        <FloatButton
          icon={<PlusOutlined />}
          type="primary"
          style={{ right: 40, bottom: 40 }}
        />
      </Layout>
    </ConfigProvider>
  );
};

export default CustomDesignPage;
