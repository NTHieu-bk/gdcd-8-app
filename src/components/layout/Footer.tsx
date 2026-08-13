import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-lacquer-deep border-t border-patina-rule mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-display font-semibold text-kinpaku-gold uppercase tracking-wider">
              GDCD Toàn Cầu
            </h3>
            <p className="text-text-muted text-sm leading-relaxed max-w-xs">
              Môn Giáo dục công dân 8. Chủ đề: Tôn trọng sự đa dạng của các dân tộc. Khám phá – Hiểu biết – Tôn trọng – Cùng phát triển.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-champagne font-medium text-sm uppercase tracking-wider">Liên kết nhanh</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#main-content" className="text-sm text-text-muted hover:text-kinpaku-pale transition-colors">
                  Nội dung bài học
                </Link>
              </li>
              <li>
                <Link href="#explore" className="text-sm text-text-muted hover:text-kinpaku-pale transition-colors">
                  Quả cầu văn hóa
                </Link>
              </li>
              <li>
                <Link href="#creative-corner" className="text-sm text-text-muted hover:text-kinpaku-pale transition-colors">
                  Góc sáng tạo
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gold-hairline flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-faint text-xs">
            © {new Date().getFullYear()} Website Học Tập Tương Tác GDCD 8. Dành cho mục đích giáo dục.
          </p>
          <div className="flex space-x-4">
            {/* Minimalist ornamental seam */}
            <div className="w-16 h-[1px] bg-kinpaku-gold/30"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}
