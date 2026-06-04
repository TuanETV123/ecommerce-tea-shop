import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../Components/Pagination/Pagination";
import CategoryFilter from "../../Components/JournalFilter/CategoryFilter";
import { getBlogsApi } from "../../services/blogApi";
import { Input } from "antd";

const Journal = () => {
  const [selectedCategory, setSelectedCategory] = useState("Tất cả bài viết");
  const [searchTerm, setSearchTerm] = useState("");
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const toDisplayDate = (value) => {
    if (!value) {
      return "Chưa cập nhật";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Chưa cập nhật";
    }

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const estimateReadTime = (text) => {
    const words = String(text || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 180));
    return `${minutes} phút đọc`;
  };

  const loadBlogs = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await getBlogsApi({ pageNumber, pageSize: 10 });
      const data = response?.data || {};

      const mapped = (data?.items || []).map((item) => ({
        id: item?.id,
        category: "Nhật ký",
        date: toDisplayDate(item?.publishDate),
        readTime: estimateReadTime(item?.shortContent),
        title: item?.title || "Không tên",
        desc: item?.shortContent || "Chưa có mô tả ngắn.",
        img: item?.thumbnail || "",
      }));

      setArticles(mapped);
      setTotalPages(Math.max(1, Number(data?.totalPages || 1)));
    } catch (apiError) {
      setError(apiError?.message || "Không tải được danh sách bài viết.");
      setArticles([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs(1);
  }, []);

  const categories = useMemo(
    () => [
      "Tất cả bài viết",
      ...Array.from(new Set(articles.map((a) => a.category))),
    ],
    [articles],
  );

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "Tất cả bài viết" ||
        article.category === selectedCategory;
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.desc.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, searchTerm, selectedCategory]);

  const featuredArticle = filteredArticles[0] || articles[0];

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-10 py-8 lg:py-12 font-display bg-background-light text-[#0d1b10] min-h-screen relative">
      <section className="relative rounded-3xl overflow-hidden mb-12 group shadow-sm">
        <div
          className="min-h-[320px] lg:min-h-[450px] bg-cover bg-center flex flex-col justify-end p-8 lg:p-12 relative"
          style={{
            backgroundImage: featuredArticle?.img
              ? `linear-gradient(180deg, rgba(13, 27, 16, 0) 0%, rgba(13, 27, 16, 0.9) 100%), url("${featuredArticle.img}")`
              : "linear-gradient(180deg, rgba(13, 27, 16, 0.25) 0%, rgba(13, 27, 16, 0.95) 100%)",
          }}
        >
          <div className="max-w-2xl relative z-10">
            <span className="bg-primary text-[#0d1b10] text-[10px] font-black px-3 py-1.5 rounded-md uppercase tracking-widest mb-4 inline-block shadow-sm">
              Bài viết nổi bật
            </span>
            <h2 className="text-white text-3xl lg:text-5xl font-black leading-tight mb-4 tracking-tight">
              {featuredArticle?.title || "Khám phá Nhật ký trà"}
            </h2>
            <p className="text-gray-200 text-lg mb-8 font-medium line-clamp-2">
              {featuredArticle?.desc ||
                "Những bài viết mới nhất về trà sẽ xuất hiện tại đây."}
            </p>
            {featuredArticle?.id && (
              <Link
                to={`/journal/${featuredArticle.id}`}
                className="inline-flex bg-white text-[#0d1b10] px-8 py-3.5 rounded-xl font-black items-center gap-2 hover:bg-primary transition-colors shadow-lg shadow-black/20"
              >
                Đọc bài viết
                <span className="material-symbols-outlined text-[20px]">
                  arrow_forward
                </span>
              </Link>
            )}
          </div>
        </div>
      </section>

      <div className="mb-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
          <Input
            placeholder="Tìm bài viết..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-64 rounded-lg border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>
      </div>

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-slate-500 text-sm">
          Đang tải danh sách bài viết...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-600 text-sm">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <Link
              to={`/journal/${article.id}`}
              key={article.id}
              className="flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-surface-light">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{
                    backgroundImage: article.img
                      ? `url("${article.img}")`
                      : "linear-gradient(120deg, #dfe8df, #f4f7f3)",
                  }}
                ></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-widest text-[#0d1b10] shadow-sm">
                  {article.category}
                </div>
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 text-gray-400 text-xs mb-3 font-bold">
                  <span>{article.date}</span>
                  <span className="w-1 h-1 bg-primary rounded-full"></span>
                  <span>{article.readTime}</span>
                </div>
                <h3 className="text-xl font-black mb-3 group-hover:text-primary transition-colors leading-snug text-[#0d1b10]">
                  {article.title}
                </h3>
                <p className="text-gray-500 text-sm mb-6 flex-1 font-medium leading-relaxed">
                  {article.desc}
                </p>
                <div className="text-primary font-black text-sm flex items-center gap-1 group/link mt-auto">
                  Đọc thêm{" "}
                  <span className="material-symbols-outlined text-[18px] group-hover/link:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {filteredArticles.length === 0 && (
            <div className="col-span-full rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500 text-sm">
              Không tìm thấy bài viết phù hợp.
            </div>
          )}
        </div>
      )}

      {!loading && !error && (
        <Pagination
          totalPages={totalPages}
          onPageChange={loadBlogs}
        ></Pagination>
      )}
    </div>
  );
};

export default Journal;
