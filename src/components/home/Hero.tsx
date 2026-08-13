import React from 'react';
import { Button } from '../ui/Button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-20 pb-16 md:pt-32 md:pb-24">
      {/* Background with abstract Kinpaku-inspired grid/texture */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lacquer-deep via-lacquer-black to-lacquer-black"></div>
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(212, 175, 55, 0.15) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Slogan */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold-hairline-strong bg-lacquer-deep mb-8 animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-kinpaku-gold animate-pulse"></span>
            <span className="text-xs font-mono tracking-widest uppercase text-champagne">
              Khám phá – Hiểu biết – Tôn trọng – Cùng phát triển
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-thin tracking-tight text-champagne mb-8">
            TÔN TRỌNG SỰ <span className="text-kinpaku-gold italic font-light">ĐA DẠNG</span><br />
            CỦA CÁC DÂN TỘC
          </h1>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <a href="#main-content" onClick={(e) => { e.preventDefault(); document.getElementById('main-content')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Button variant="primary" size="lg" className="w-full sm:w-auto">
                <span className="mr-2">🔎</span> KHÁM PHÁ CHỦ ĐỀ
              </Button>
            </a>
            <a href="#explore" onClick={(e) => { e.preventDefault(); document.getElementById('explore')?.scrollIntoView({ behavior: 'smooth' }); }}>
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                <span className="mr-2">🚀</span> BẮT ĐẦU HÀNH TRÌNH
              </Button>
            </a>
          </div>
        </div>

        {/* Info Cards Layout */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-raised-lacquer border border-gold-hairline p-8 md:p-10 rounded-lg hover:border-kinpaku-gold transition-colors flex flex-col items-center text-center">
            <div className="text-3xl mb-4">🌍</div>
            <h3 className="text-kinpaku-gold font-medium mb-3 text-lg">Sự khác biệt</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Mỗi quốc gia, dân tộc trên thế giới đều có những điểm khác biệt về tự nhiên, lịch sử, sinh hoạt, văn hoá... Điều đó đã tạo nên sự đa dạng của các dân tộc.
            </p>
          </div>

          <div className="bg-raised-lacquer border border-gold-hairline p-8 md:p-10 rounded-lg hover:border-kinpaku-gold transition-colors flex flex-col items-center text-center">
            <div className="text-3xl mb-4">✨</div>
            <h3 className="text-kinpaku-gold font-medium mb-3 text-lg">Tinh hoa lịch sử</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Trong suốt chiều dài lịch sử, mỗi dân tộc mang những nét riêng biệt về kinh tế, xã hội — được kết tinh từ tài năng, sự sáng tạo qua nhiều thế hệ.
            </p>
          </div>

          <div className="bg-raised-lacquer border border-gold-hairline p-8 md:p-10 rounded-lg hover:border-kinpaku-gold transition-colors flex flex-col items-center text-center">
            <div className="text-3xl mb-4">🤝</div>
            <h3 className="text-kinpaku-gold font-medium mb-3 text-lg">Cơ hội giao lưu</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Quá trình toàn cầu hoá đang dần xoá đi ranh giới địa lí, tạo điều kiện thuận lợi cho việc giao lưu, học hỏi giữa các nền văn hoá trên thế giới.
            </p>
          </div>

          <div className="bg-raised-lacquer border border-gold-hairline p-8 md:p-10 rounded-lg hover:border-verdigris-patina transition-colors flex flex-col items-center text-center">
            <div className="text-3xl mb-4">⚠️</div>
            <h3 className="text-verdigris-patina font-medium mb-3 text-lg">Nguy cơ phai nhạt</h3>
            <p className="text-text-muted text-sm leading-relaxed">
              Tuy nhiên, đi cùng cơ hội cũng tiềm ẩn nguy cơ làm mai một, phai nhạt bản sắc văn hoá riêng của mỗi dân tộc nếu chúng ta không có ý thức giữ gìn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
