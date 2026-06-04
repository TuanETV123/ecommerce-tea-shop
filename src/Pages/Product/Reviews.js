import React, { useState } from "react";

const Reviews = () => {
  // Mock current user - in the future, 'avatar' will be a URL from your DB
  const [currentUser] = useState({
    name: "Alex Chen",
    avatar:
      "https://ui-avatars.com/api/?name=Alex+Chen&background=dcfce7&color=166534",
    isAuthenticated: true,
  });

  const [reviews, setReviews] = useState([
    {
      name: "Aiko",
      avatar:
        "https://ui-avatars.com/api/?name=Aiko&background=fef3c7&color=92400e",
      rating: 5,
      date: "2026-02-15",
      text: "Mùi mượt, tươi và rất hợp cho nghi lễ. Rất đáng thử!",
    },
  ]);

  const [form, setForm] = useState({ rating: 5, text: "" });
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.text.trim()) return;

    const newReview = {
      name: currentUser.name,
      avatar: currentUser.avatar,
      rating: form.rating,
      text: form.text.trim(),
      date: new Date().toISOString().split("T")[0],
    };

    setReviews([newReview, ...reviews]);
    setForm({ rating: 5, text: "" });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h3 className="text-xl font-bold text-[#0d1b10]">Đánh giá sản phẩm</h3>

      {/* Review Input Section */}
      {currentUser.isAuthenticated && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-4">
            {/* Rounded Profile Image */}
            <img
              src={currentUser.avatar}
              alt="Người dùng"
              className="w-10 h-10 rounded-full border border-gray-100"
            />
            <span className="font-medium text-gray-700">
              {currentUser.name}
            </span>
          </div>

          {/* Shopee-style Star Picker */}
          <div className="flex items-center gap-1 mb-4">
            <span className="text-sm text-gray-500 mr-2">Chất lượng sản phẩm:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setForm({ ...form, rating: star })}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110"
              >
                <span
                  className={`material-symbols-outlined text-2xl ${
                    star <= (hoverRating || form.rating)
                      ? "text-amber-400 fill-current"
                      : "text-gray-300"
                  }`}
                >
                  star
                </span>
              </button>
            ))}
            <span className="ml-2 text-sm font-bold text-amber-500">
              {form.rating === 5
                ? "Tuyệt vời"
                : form.rating === 4
                  ? "Tốt"
                  : "Tạm"}
            </span>
          </div>

          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="Trà thế nào? Chia sẻ trải nghiệm của bạn..."
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg h-28 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm"
          />

          <div className="flex justify-end mt-3">
            <button
              type="submit"
              className="bg-[#ee4d2d] hover:bg-[#d73211] text-white px-8 py-2 rounded-sm font-medium transition-colors"
            >
              Gửi
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="divide-y divide-gray-100">
        {reviews.map((r, i) => (
          <div key={i} className="py-6 flex gap-4">
            <img
              src={r.avatar}
              alt={r.name}
              className="w-10 h-10 rounded-full shrink-0"
            />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{r.name}</div>
              <div className="flex text-amber-400 my-1">
                {Array.from({ length: 5 }).map((_, k) => (
                  <span
                    key={k}
                    className="material-symbols-outlined text-[14px]"
                  >
                    {k < r.rating ? "star" : "star_outline"}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-gray-400 mb-2">{r.date}</div>
              <p className="text-sm text-gray-700 leading-relaxed">{r.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
