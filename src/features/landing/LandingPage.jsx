import React from 'react';
import BookingSearchBar from '@/components/UserPublicLayout/BookingSearchBar';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden font-sans">

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center py-20 lg:py-32 overflow-hidden bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1600&q=80')" }}>
        {/* Dark overlay mask to make text pop */}
        <div className="absolute inset-0 bg-slate-950/80 z-0"></div>

        {/* Decorative background grid and glow effects */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-10" />
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[80px] animate-pulse pointer-events-none z-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[80px] animate-pulse pointer-events-none z-10" />

        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center">

          {/* Badge */}
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-400 text-xs font-bold tracking-wider mb-6 border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            Nền tảng vận tải #1 Việt Nam
          </span>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight max-w-4xl">
            Hành Trình Mới,<br />
            <span className="bg-gradient-to-r from-emerald-400 via-green-400 to-emerald-300 bg-clip-text text-transparent">Trải Nghiệm Đẳng Cấp</span>
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Kết nối mọi nẻo đường với dịch vụ vận tải thông minh, an toàn và chuyên nghiệp nhất Việt Nam.
          </p>

          <BookingSearchBar />

        </div>
      </section>

      {/* ─── Services Section ─── */}
      <section className="bg-slate-50 py-24 sm:py-32" id="services">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-4">Dịch vụ của chúng tôi</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">Hệ sinh thái vận tải đa phương thức<br />đáp ứng mọi nhu cầu.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-slate-100/80 rounded-2xl p-8 sm:p-10 flex flex-col transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 group">
              <div className="w-14 h-14 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-900 mb-8 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" />
                  <path d="M8 21h8M12 17v4" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">Đặt vé xe khách</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6 flex-grow">Kết nối hàng ngàn tuyến đường liên tỉnh với chất lượng dịch vụ chuẩn 5 sao và giá cả cạnh tranh.</p>
              <a href="#" className="inline-flex items-center gap-1.5 text-slate-900 font-bold text-sm tracking-wide transition-all duration-300 hover:gap-2.5 hover:text-emerald-600">
                Đặt vé ngay
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>

            {/* Service Card 2 */}
            <div className="bg-slate-100/80 rounded-2xl p-8 sm:p-10 flex flex-col transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 group">
              <div className="w-14 h-14 rounded-xl bg-slate-200/80 flex items-center justify-center text-slate-900 mb-8 transition-colors duration-300 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 tracking-tight">Đi chung xe</h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base mb-6 flex-grow">Tiết kiệm chi phí, giảm thiểu khí thải và kết nối cộng đồng thông qua nền tảng carpooling thông minh.</p>
              <a href="#" className="inline-flex items-center gap-1.5 text-slate-900 font-bold text-sm tracking-wide transition-all duration-300 hover:gap-2.5 hover:text-emerald-600">
                Tìm xe đi chung
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>

            {/* Service Card 3 (Highlight) */}
            <div className="bg-slate-950 text-white rounded-2xl p-8 sm:p-10 flex flex-col transition-all duration-300 hover:bg-black hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/30 group">
              <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-white mb-8 transition-colors duration-300 group-hover:bg-emerald-500 group-hover:text-white">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" />
                  <circle cx="5.5" cy="18.5" r="2.5" />
                  <circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">Vận tải xe tải</h3>
              <p className="text-slate-400 leading-relaxed text-sm sm:text-base mb-6 flex-grow">Giải pháp logistics doanh nghiệp toàn diện. Quản lý đội xe và hàng hóa thời gian thực với công nghệ AI.</p>
              <a href="#" className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-sm tracking-wide transition-all duration-300 hover:gap-2.5 hover:text-emerald-300">
                Liên hệ vận tải
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Why NexusRide Section ─── */}
      <section className="bg-slate-100/50 py-24 sm:py-32" id="solutions">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            <div className="flex flex-col">
              <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider mb-4 self-start">Lợi thế vượt trội</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug mb-10">Tại sao chọn NexusRide?</h2>

              <div className="flex flex-col gap-8">
                {/* Feature 1 */}
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 min-w-[48px] rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-md shadow-slate-200/50">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1.5">Chính xác</h4>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">Hệ thống định vị GPS và thuật toán tối ưu lộ trình đảm bảo thời gian giao nhận chính xác đến từng phút.</p>
                  </div>
                </div>

                {/* Feature 2 */}
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 min-w-[48px] rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-md shadow-slate-200/50">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1.5">Tốc độ</h4>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">Xử lý yêu cầu tức thì, kết nối tài xế gần nhất giúp hành trình của bạn luôn được bắt đầu nhanh chóng.</p>
                  </div>
                </div>

                {/* Feature 3 */}
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 min-w-[48px] rounded-xl bg-white flex items-center justify-center text-slate-900 shadow-md shadow-slate-200/50">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1.5">Minh bạch</h4>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">Cước phí công khai, lộ trình rõ ràng và hệ thống đánh giá tài xế minh bạch tạo nên sự tin tưởng tuyệt đối.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-white p-8 sm:p-12 rounded-3xl flex flex-col shadow-lg shadow-slate-200/40 border border-slate-100">
                <span className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight leading-none mb-3">99.9%</span>
                <span className="text-slate-600 font-medium text-sm sm:text-base max-w-sm">Tỷ lệ hoàn thành chuyến hàng đúng hạn trên toàn hệ thống.</span>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 group">
                <img
                  src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600&q=80"
                  alt="GPS Tracking"
                  loading="lazy"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── Trucking Two-Way Section ─── */}
      <section className="bg-slate-950 text-white py-24 sm:py-32 relative overflow-hidden" id="tracking">
        <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold uppercase tracking-wider mb-4">Giải pháp logistics</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4 leading-tight">Vận tải Xe tải 2 Chiều</h2>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed">Tối ưu hóa năng suất và chi phí cho cả chủ hàng và đối tác vận chuyển.</p>
          </div>

          <div className="flex justify-center mb-16">
            <div className="w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
              <img
                src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1000&q=80"
                alt="Cargo logistics"
                loading="lazy"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Side 1 */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md p-8 sm:p-10 rounded-2xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]">
              <h3 className="text-xl font-bold text-white mb-6">Bạn cần gửi hàng?</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <circle cx="12" cy="12" r="10" className="fill-emerald-500/20" />
                    <path d="M9 12l2 2 4-4" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Đặt xe linh hoạt từ 1.5 tấn đến 30 tấn</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <circle cx="12" cy="12" r="10" className="fill-emerald-500/20" />
                    <path d="M9 12l2 2 4-4" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Bảo hiểm hàng hóa 100% giá trị</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <circle cx="12" cy="12" r="10" className="fill-emerald-500/20" />
                    <path d="M9 12l2 2 4-4" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Theo dõi Real-time trên ứng dụng</span>
                </li>
              </ul>
            </div>

            {/* Side 2 */}
            <div className="bg-white/[0.03] border border-white/[0.08] backdrop-blur-md p-8 sm:p-10 rounded-2xl transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.12]">
              <h3 className="text-xl font-bold text-white mb-6">Bạn có xe nhàn rỗi?</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <circle cx="12" cy="12" r="10" className="fill-emerald-500/20" />
                    <path d="M9 12l2 2 4-4" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Tìm nguồn hàng ổn định 24/7</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <circle cx="12" cy="12" r="10" className="fill-emerald-500/20" />
                    <path d="M9 12l2 2 4-4" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Giảm thiểu xe chạy rỗng chiều về</span>
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm sm:text-base">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
                    <circle cx="12" cy="12" r="10" className="fill-emerald-500/20" />
                    <path d="M9 12l2 2 4-4" className="stroke-emerald-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>Thanh toán nhanh chóng, minh bạch</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA / Download Section ─── */}
      <section className="bg-slate-50 py-24 sm:py-32 text-center relative overflow-hidden" id="contact">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">Sẵn sàng để bắt đầu hành trình?</h2>
          <p className="text-slate-600 text-base sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">Tải ứng dụng NexusRide ngay hôm nay để trải nghiệm dịch vụ vận tải hàng đầu Việt Nam.</p>
          <div className="flex flex-wrap justify-center gap-4">

            {/* App Store Badge */}
            <a href="#" className="inline-flex bg-slate-950 hover:bg-black text-white rounded-xl py-3 px-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/20" aria-label="Download on App Store">
              <div className="flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div>
                  <span className="block text-[10px] text-slate-400 font-medium text-left uppercase tracking-wider leading-none mb-0.5">Download on the</span>
                  <span className="block text-base font-bold text-left tracking-tight leading-none">App Store</span>
                </div>
              </div>
            </a>

            {/* Google Play Badge */}
            <a href="#" className="inline-flex bg-slate-950 hover:bg-black text-white rounded-xl py-3 px-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/20" aria-label="Get it on Google Play">
              <div className="flex items-center gap-3">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="shrink-0">
                  <path d="M3.18 23.79c.35.36.85.55 1.4.44l13.07-7.57-3.36-3.37L3.18 23.79zM.56 1.1c-.36.54-.56 1.2-.56 1.95v17.9c0 .75.2 1.41.56 1.95l9.79-9.79L.56 1.1zm20.85 9.67L17.8 8.56l-3.59 3.59 3.59 3.59 3.61-2.09c.68-.39 1.03-.89 1.03-1.49s-.35-1.09-1.03-1.49zM4.58.24C4.13.13 3.63.26 3.28.62l10.51 10.51 3.36-3.37L4.58.24z" />
                </svg>
                <div>
                  <span className="block text-[10px] text-slate-400 font-medium text-left uppercase tracking-wider leading-none mb-0.5">Get it on</span>
                  <span className="block text-base font-bold text-left tracking-tight leading-none">Google Play</span>
                </div>
              </div>
            </a>

          </div>
        </div>

        {/* Decorative background gradients */}
        <div className="absolute top-[-150px] right-[-100px] w-96 h-96 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-100px] left-[-80px] w-80 h-80 rounded-full bg-blue-500/5 blur-[100px] pointer-events-none" />
      </section>

    </div>
  );
};

export default LandingPage;
