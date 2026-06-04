import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ProductGrid from "./ProductGrid";
import Pagination from "../../Components/Pagination/Pagination";
import {
  getCategoriesApi,
  getProductDetailApi,
  getProductsApi,
  getProductsByCategoryApi,
} from "../../services/productApi";

const FALLBACK_TEA_TYPES = [
  "Trà xanh",
  "Trà ô long",
  "Trà hoa",
  "Trà thảo mộc",
  "Trà trái cây",
];

const ITEMS_PER_PAGE = 6;
const PUBLIC_API_BLOCKED_MESSAGE =
  "Dữ liệu sản phẩm tạm thời chưa được mở công khai. Vui lòng quay lại sau.";

// --- Helper Functions ---
function isUnauthorizedError(error) {
  const message = String(error?.message || "").toLowerCase();
  return message.includes("401") || message.includes("unauthorized");
}

function extractImageUrl(image) {
  if (!image) return null;
  if (typeof image === "string") return image;
  if (typeof image !== "object") return null;
  return (
    image.imageUrl ||
    image.url ||
    image.path ||
    image.src ||
    image.thumbnail ||
    image.thumbnailUrl ||
    null
  );
}

function getProductFirstImage(item) {
  const directCandidates = [
    item?.imageUrl,
    item?.thumbnail,
    item?.thumbnailUrl,
    item?.coverImage,
    item?.mainImage,
    item?.image,
  ];
  const direct = directCandidates.find((value) => Boolean(value));
  if (direct) return direct;

  const arraySources = [
    item?.images,
    item?.productImages,
    item?.imageResponses,
  ];
  for (const source of arraySources) {
    if (!Array.isArray(source)) continue;
    const main = source.find((image) =>
      Boolean(
        image?.isMain ||
        image?.isPrimary ||
        image?.isDefault ||
        image?.isMainImage,
      ),
    );
    const fromMain = extractImageUrl(main);
    if (fromMain) return fromMain;
    for (const image of source) {
      const fromItem = extractImageUrl(image);
      if (fromItem) return fromItem;
    }
  }
  return null;
}

function mapProduct(item) {
  const firstImage = getProductFirstImage(item);
  const derivedIsActive =
    Boolean(item.isActive) ||
    Number(item.price || 0) > 0 ||
    Number(item.stockQuantity || 0) > 0;

  return {
    id: item.productId,
    name: item.name,
    type: item.categoryName || "Khác",
    origin: item.categoryName || "Khác",
    rating: "—",
    price: Number(item.price || 0),
    priceLabel: `${Number(item.price || 0).toLocaleString("vi-VN")}đ`,
    size: `Tồn kho ${Number(item.stockQuantity || 0)}`,
    desc: item.description || "Chưa có mô tả.",
    badge: item.isActive ? "Sản phẩm" : "Sắp ra mắt",
    badgeColor: derivedIsActive
      ? "bg-emerald-200 text-emerald-900"
      : "bg-gray-900/80 text-white",
    comingSoon: !derivedIsActive,
    img: firstImage || null,
  };
}

async function enrichProductsWithVariantData(items) {
  const safeItems = Array.isArray(items) ? items : [];
  const enriched = await Promise.all(
    safeItems.map(async (item) => {
      const hasBasePrice = Number(item?.price || 0) > 0;
      const hasStock = Number(item?.stockQuantity || 0) > 0;
      const hasImage = Boolean(getProductFirstImage(item));
      if ((hasBasePrice || hasStock) && hasImage) return item;

      try {
        const response = await getProductDetailApi(item.productId);
        const detail = response?.data || {};
        const variants = Array.isArray(detail?.variants) ? detail.variants : [];
        const detailImage = getProductFirstImage(detail);
        const prices = variants
          .map((v) => Number(v?.price || 0))
          .filter((p) => p > 0);
        const stocks = variants.map((v) => Number(v?.stock || 0));

        return {
          ...item,
          images:
            detailImage &&
            (!Array.isArray(item.images) || item.images.length === 0)
              ? [detailImage]
              : item.images,
          imageUrl: item.imageUrl || detail.imageUrl || detailImage || null,
          price:
            prices.length > 0 ? Math.min(...prices) : Number(item?.price || 0),
          stockQuantity:
            stocks.length > 0
              ? stocks.reduce((sum, v) => sum + (Number.isFinite(v) ? v : 0), 0)
              : Number(item?.stockQuantity || 0),
          isActive:
            Boolean(item?.isActive) ||
            prices.length > 0 ||
            stocks.some((s) => Number(s) > 0),
        };
      } catch (error) {
        return item;
      }
    }),
  );
  return enriched;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// --- Main Component ---
const Shop = () => {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [sortBy, setSortBy] = useState("Nổi bật");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [publicApiBlocked, setPublicApiBlocked] = useState(false);

  // 1. DATA CATCHER: Sync component state with Navigation State (from Header search)
  useEffect(() => {
    const incomingItems = location.state?.results || location.state?.result;
    const incomingQuery = location.state?.query || "";

    if (incomingItems) {
      setProducts(incomingItems.map(mapProduct));
      setAppliedKeyword(incomingQuery);
      setSelectedTypes([]); // Reset categories when a global search is performed
      setLoading(false);
      setCurrentPage(1);
    }
  }, [location.state]);

  const handleReset = () => {
    setCurrentPage(1);
    setSelectedTypes([]);
    setSortBy("Nổi bật");
    setAppliedKeyword("");
    window.history.replaceState({}, document.title); // Clean up state
  };

  const toggleFilter = (item, list, setList) => {
    setList((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
    setCurrentPage(1);
  };

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategoriesApi({
          pageNumber: 1,
          pageSize: 50,
        });
        setCategories(response?.data?.items || []);
      } catch (err) {
        setPublicApiBlocked(true);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const hasStateData = location.state?.results || location.state?.result;
      const isInitialSearchState =
        hasStateData &&
        selectedTypes.length === 0 &&
        appliedKeyword === (location.state?.query || "");

      if (isInitialSearchState && products.length > 0) {
        return;
      }

      if (publicApiBlocked) {
        setProducts([]);
        setError(PUBLIC_API_BLOCKED_MESSAGE);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        let sourceItems = [];

        if (selectedTypes.length === 1) {
          const selectedName = selectedTypes[0].trim().toLowerCase();
          const selectedCategory = categories.find(
            (cat) => cat.name.trim().toLowerCase() === selectedName,
          );

          if (selectedCategory?.categoryId) {
            const res = await getProductsByCategoryApi({
              categoryId: selectedCategory.categoryId,
              pageNumber: 1,
              pageSize: 100,
            });
            sourceItems = res?.data?.items || res?.data || [];
          } else {
            const res = await getProductsApi({ pageNumber: 1, pageSize: 100 });
            const allItems = res?.data?.items || [];

            sourceItems = allItems.filter(
              (item) =>
                item.categoryName?.trim().toLowerCase() === selectedName,
            );
          }
        } else {
          const res = await getProductsApi({ pageNumber: 1, pageSize: 100 });
          sourceItems = res?.data?.items || [];

          if (selectedTypes.length > 1) {
            const normalizedSelected = selectedTypes.map((t) =>
              t.trim().toLowerCase(),
            );
            sourceItems = sourceItems.filter((item) =>
              normalizedSelected.includes(
                item.categoryName?.trim().toLowerCase(),
              ),
            );
          }
        }

        if (appliedKeyword && appliedKeyword.trim() !== "") {
          const keyword = normalizeText(appliedKeyword);
          sourceItems = sourceItems.filter((item) => {
            const target = normalizeText(
              `${item.name} ${item.description} ${item.categoryName}`,
            );
            return target.includes(keyword);
          });
        }

        // 5. ENRICH & MAP
        const enrichedItems = await enrichProductsWithVariantData(sourceItems);
        setProducts(enrichedItems.map(mapProduct));
      } catch (apiError) {
        console.error("Fetch Error:", apiError);
        if (isUnauthorizedError(apiError)) {
          setPublicApiBlocked(true);
          setError(PUBLIC_API_BLOCKED_MESSAGE);
        }
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedKeyword, selectedTypes, categories, publicApiBlocked]);

  const teaTypes = useMemo(() => {
    const categoryTypes = categories.map((item) => item.name).filter(Boolean);
    return categoryTypes.length > 0 ? categoryTypes : FALLBACK_TEA_TYPES;
  }, [categories]);

  let processedProducts = [...products];
  if (sortBy === "Giá: Thấp đến cao")
    processedProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === "Giá: Cao đến thấp")
    processedProducts.sort((a, b) => b.price - a.price);
  else if (sortBy === "Mới nhất")
    processedProducts.sort((a, b) => String(b.id).localeCompare(String(a.id)));

  const totalPages = Math.ceil(processedProducts.length / ITEMS_PER_PAGE) || 1;
  const displayedProducts = processedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  return (
    <div className="flex flex-col items-center w-full min-h-screen pb-20 font-display bg-background-light text-[#0d1b10]">
      <div className="w-full max-w-[1440px] px-4 md:px-10 py-4">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/"
            className="text-gray-500 hover:text-primary transition-colors"
          >
            Trang chủ
          </Link>
          <span className="material-symbols-outlined !text-[14px] text-gray-400">
            chevron_right
          </span>
          <span className="font-bold text-[#0d1b10]">Tất cả trà</span>
        </div>
      </div>

      <div className="w-full max-w-[1440px] px-4 md:px-10 flex flex-col lg:flex-row gap-8 items-start mt-8">
        <aside className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span className="material-symbols-outlined">tune</span> Bộ lọc
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors font-bold uppercase tracking-wider"
            >
              Đặt lại
            </button>
          </div>

          <div>
            <h4 className="text-[11px] font-black mb-4 uppercase tracking-[0.2em] text-gray-400">
              Loại trà
            </h4>
            <div className="space-y-3">
              {teaTypes.map((type) => (
                <label
                  key={type}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div className="relative flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTypes.includes(type)}
                      onChange={() =>
                        toggleFilter(type, selectedTypes, setSelectedTypes)
                      }
                      // FIXED CLASSES BELOW:
                      className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 bg-white checked:bg-primary checked:border-primary transition-all focus:ring-offset-0 focus:ring-2 focus:ring-primary/20"
                    />
                    {/* Custom Checkmark Icon (Optional but looks better) */}
                    <span className="absolute text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3.5 w-3.5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 w-full">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 items-center">
                {appliedKeyword && (
                  <div className="flex h-8 items-center justify-center gap-x-2 rounded-full border border-primary/30 bg-primary/10 pl-3 pr-2">
                    <p className="text-[#0d1b10] text-xs font-bold">
                      Tìm kiếm: {appliedKeyword}
                    </p>
                    <button
                      onClick={() => setAppliedKeyword("")}
                      className="hover:text-red-500 flex items-center"
                    >
                      <span className="material-symbols-outlined !text-[16px]">
                        close
                      </span>
                    </button>
                  </div>
                )}
                {selectedTypes.map((filter) => (
                  <div
                    key={filter}
                    className="flex h-8 items-center justify-center gap-x-2 rounded-full border border-primary/30 bg-primary/10 pl-3 pr-2"
                  >
                    <p className="text-[#0d1b10] text-xs font-bold">{filter}</p>
                    <button
                      onClick={() =>
                        toggleFilter(filter, selectedTypes, setSelectedTypes)
                      }
                      className="hover:text-red-500 flex items-center"
                    >
                      <span className="material-symbols-outlined !text-[16px]">
                        close
                      </span>
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">
                  Sắp xếp:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer text-[#0d1b10] py-0 pl-0"
                >
                  <option>Nổi bật</option>
                  <option>Mới nhất</option>
                  <option>Giá: Thấp đến cao</option>
                  <option>Giá: Cao đến thấp</option>
                </select>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-gray-500 font-bold">
              Đang tải sản phẩm...
            </div>
          ) : error ? (
            <div className="py-20 text-center text-amber-600 font-bold">
              {error}
            </div>
          ) : (
            <ProductGrid displayedProducts={displayedProducts} />
          )}

          {!loading && !error && totalPages > 1 && (
            <Pagination totalPages={totalPages} onPageChange={setCurrentPage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
