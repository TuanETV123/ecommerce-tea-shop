import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBlogDetailApi, getBlogsApi } from "../../../services/blogApi";

const JournalDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [recentArticles, setRecentArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    const words = String(text || "").trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 180));
    return `${minutes} phút đọc`;
  };

  useEffect(() => {
    if (!id) {
      return;
    }

    let mounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const [detailResponse, listResponse] = await Promise.all([
          getBlogDetailApi(id),
          getBlogsApi({ pageNumber: 1, pageSize: 10 }),
        ]);

        if (!mounted) {
          return;
        }

        const detail = detailResponse?.data || null;
        setArticle(detail);
        setRecentArticles(listResponse?.data?.items || []);
      } catch (apiError) {
        if (!mounted) {
          return;
        }

        setError(apiError?.message || "Không tải được bài viết.");
        setArticle(null);
        setRecentArticles([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const recent = useMemo(() => {
    return recentArticles.filter((item) => item?.id !== id).slice(0, 3);
  }, [id, recentArticles]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1b10] flex items-center justify-center text-white">
        <p className="text-lg">Đang tải bài viết...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0d1b10] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Không tải được bài viết</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            to="/journal"
            className="text-gray-400 hover:text-white underline"
          >
            Quay lại Nhật ký
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0d1b10] flex items-center justify-center text-white">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Không tìm thấy bài viết</h1>
          <Link
            to="/journal"
            className="text-gray-400 hover:text-white underline"
          >
            Quay lại Nhật ký
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1b10] text-white font-sans">
      <main className="max-w-[1280px] mx-auto px-6 md:px-12 lg:px-20 py-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-10">
          <Link className="hover:text-white transition-colors" to="/">
            Trang chủ
          </Link>
          <span className="opacity-30">/</span>
          <Link className="hover:text-white transition-colors" to="/journal">
            Nhật ký
          </Link>
          <span className="opacity-30">/</span>
          <span className="text-white">Bài viết</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Content */}
          <div className="flex-1">
            <div className="relative w-full aspect-[16/8] rounded-3xl overflow-hidden mb-12 border border-white/10 shadow-2xl">
              <img
                className="w-full h-full object-cover"
                src={article.thumbnail}
                alt={article.title}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1b10]/90 via-[#0d1b10]/20 to-transparent flex flex-col justify-end p-10">
                <span className="inline-block bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold text-[10px] uppercase tracking-[0.2em] px-3 py-1 rounded mb-6 w-fit">
                  Nhật ký
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight max-w-2xl">
                  {article.title}
                </h1>
                <div className="flex items-center gap-6 text-gray-300 text-xs font-medium uppercase tracking-widest">
                  <span className="px-2 py-0.5 border border-white/20 rounded text-[9px]">
                    Bài đăng quản trị
                  </span>
                  <span>{toDisplayDate(article.publishDate)}</span>
                  <span>{estimateReadTime(article.content)}</span>
                </div>
              </div>
            </div>

            <div className="max-w-3xl">
              <p className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed font-light italic">
                {String(article.content || "").slice(0, 180)}...
              </p>

              <div className="text-gray-400 leading-8 space-y-6 text-base">
                {String(article.content || "")
                  .split(/\n+/)
                  .map((paragraph, idx) => (
                    <p key={`${idx}-${paragraph.slice(0, 24)}`}>{paragraph}</p>
                  ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-80">
            <div className="sticky top-28">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-[0.3em] mb-8 pb-4 border-b border-white/5">
                Bài gần đây
              </h3>
              <div className="space-y-10">
                {recent.map((recentItem) => (
                    <Link
                      key={recentItem.id}
                      to={`/journal/${recentItem.id}`}
                      className="group block"
                    >
                      <h4 className="text-sm font-bold leading-snug group-hover:text-gray-300 transition-colors">
                        {recentItem.title}
                      </h4>
                      <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-widest">
                        {toDisplayDate(recentItem.publishDate)}
                      </p>
                    </Link>
                  ))}

                {recent.length === 0 && (
                  <p className="text-xs text-gray-500">Chưa có bài viết khác.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default JournalDetail;
