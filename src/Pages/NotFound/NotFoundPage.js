const NotFoundPage = () => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black antialiased font-sans">
      <div className="absolute inset-0 z-0">
        <div
          className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-1000"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1544787210-2211d44b5642?q=80&w=2070&auto=format&fit=crop")',
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70"></div>
      </div>

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-4 text-center">
        <div className="mb-6 text-white/90">
          <span className="material-symbols-outlined text-4xl font-extralight">
            eco
          </span>
        </div>

        <h1 className="font-display text-[160px] md:text-[280px] font-extralight text-white leading-none tracking-tighter opacity-90 select-none drop-shadow-2xl">
          404
        </h1>

        <div className="max-w-2xl mt-[-20px] md:mt-[-40px]">
          <h2 className="font-display text-4xl md:text-7xl text-white font-medium mb-6 italic drop-shadow-md">
            Ối! Trà của bạn đã nguội
          </h2>
          <p className="text-white/80 text-lg md:text-xl font-light mb-12 max-w-md mx-auto leading-relaxed tracking-wide">
            Lối vào khu vườn bí mật này dường như đã mờ trong sương.
          </p>
        </div>

        <div className="flex flex-col items-center">
          <a
            href="/"
            className="group relative flex min-w-[280px] items-center justify-center overflow-hidden rounded-full bg-white px-10 py-5 text-lg font-bold text-[#2D5A27] transition-all duration-500 hover:scale-105 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
          >
            <span className="relative z-10 tracking-wider">
              Quay về khu vườn
            </span>
          </a>

          <button
            onClick={handleBack}
            className="mt-8 text-white/60 hover:text-white transition-all duration-300 flex items-center gap-2 group"
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">
              arrow_back
            </span>
            <span className="text-xs font-bold tracking-[0.2em] uppercase">
              Quay lại
            </span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 left-12 hidden md:block">
        <div className="text-white/30 text-[10px] tracking-[0.4em] uppercase font-bold transform -rotate-90 origin-left">
          Lạc giữa cao nguyên
        </div>
      </div>

      <div className="absolute top-12 right-12">
        <div className="flex gap-8">
          <button className="text-white/40 hover:text-white transition-colors">
            <span className="material-symbols-outlined font-light">menu</span>
          </button>
        </div>
      </div>

      <div className="absolute bottom-12 right-12 hidden md:block">
        <div className="flex flex-col items-end gap-2">
          <div className="h-[1px] w-12 bg-white/20"></div>
          <div className="text-white/30 text-[10px] tracking-[0.2em] uppercase font-medium">
            Trang viên số 404
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
