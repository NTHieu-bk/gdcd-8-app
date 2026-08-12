"use client";

import React, { useState } from 'react';
import { Button } from '../ui/Button';

export function Objectives() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section className="py-16 bg-lacquer-black border-t border-gold-hairline">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <h2 className="text-2xl font-display font-medium text-kinpaku-gold mb-6 flex items-center gap-3">
            <span className="text-3xl">🎯</span> EM SẼ HỌC ĐƯỢC GÌ?
          </h2>

          <Button 
            variant="secondary" 
            onClick={() => setIsExpanded(!isExpanded)}
            className="mb-8"
          >
            {isExpanded ? '▲ THU GỌN' : '▼ XEM MỤC TIÊU'}
          </Button>
        </div>

        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="space-y-6">
            
            {/* Về Kiến thức */}
            <div className="bg-raised-lacquer border border-gold-hairline p-6 rounded-lg">
              <h3 className="text-champagne font-medium text-lg flex items-center gap-3 mb-4">
                <span className="text-2xl">📘</span> 1. VỀ KIẾN THỨC
              </h3>
              <p className="text-text-warm">
                Một số biểu hiện của sự đa dạng của các dân tộc và các nền văn hóa trên thế giới.
              </p>
            </div>

            {/* Về Năng lực */}
            <div className="bg-raised-lacquer border border-gold-hairline p-6 rounded-lg">
              <h3 className="text-champagne font-medium text-lg flex items-center gap-3 mb-4">
                <span className="text-2xl">🧠</span> 2. VỀ NĂNG LỰC
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-kinpaku-gold font-medium text-sm uppercase tracking-wider mb-2">Năng lực chung:</h4>
                  <ul className="list-disc list-outside ml-5 text-text-warm space-y-1">
                    <li>Tự chủ và tự học để có những kiến thức cơ bản về nền văn hóa các dân tộc.</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-kinpaku-gold font-medium text-sm uppercase tracking-wider mb-2">Năng lực đặc thù:</h4>
                  <ul className="list-disc list-outside ml-5 text-text-warm space-y-1">
                    <li>Năng lực tìm hiểu và tham gia các hoạt động kinh tế - xã hội: Bước đầu biết cách thu thập, xử lí thông tin, tìm hiểu về sự đa dạng của các dân tộc và các nền văn hoá trên thế giới; Vận dụng được các kiến thức đã học để phân tích, đánh giá, xử lí tình huống trong thực tiễn có liên quan đến việc tôn trọng sự đa dạng của các dân tộc.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Về Phẩm chất */}
            <div className="bg-raised-lacquer border border-gold-hairline p-6 rounded-lg">
              <h3 className="text-champagne font-medium text-lg flex items-center gap-3 mb-4">
                <span className="text-2xl">❤️</span> 3. VỀ PHẨM CHẤT
              </h3>
              <p className="text-text-warm">
                Nhân ái, khoan dung văn hoá, tôn trọng sự đa dạng của các dân tộc và các nền văn hoá trên thế giới.
              </p>
            </div>

            {/* Giáo dục AI */}
            <div className="bg-raised-lacquer border border-gold-hairline p-6 rounded-lg border-l-4 border-l-verdigris-patina">
              <h3 className="text-champagne font-medium text-lg flex items-center gap-3 mb-4">
                <span className="text-2xl">🤖</span> 4. NỘI DUNG GIÁO DỤC AI
              </h3>
              <ul className="list-disc list-outside ml-5 text-text-warm space-y-3">
                <li>Biết sử dụng công cụ AI tạo sinh (chatbot AI, công cụ AI tạo ảnh, AI chuyển văn bản thành giọng nói...) để tra cứu, tổng hợp, kiểm chứng và sáng tạo nội dung tìm hiểu về văn hoá các dân tộc.</li>
                <li>Bước đầu biết đặt câu lệnh (prompt) phù hợp cho AI; biết đối chiếu, kiểm chứng độ tin cậy của thông tin do AI cung cấp; sử dụng AI có đạo đức, tôn trọng bản quyền, không lan truyền thông tin sai lệch hoặc định kiến văn hoá.</li>
              </ul>
            </div>

            {/* Công dân toàn cầu */}
            <div className="bg-raised-lacquer border border-gold-hairline p-6 rounded-lg border-l-4 border-l-kinpaku-gold">
              <h3 className="text-champagne font-medium text-lg flex items-center gap-3 mb-4">
                <span className="text-2xl">🌍</span> 5. TÍCH HỢP GIÁO DỤC CÔNG DÂN TOÀN CẦU
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-kinpaku-gold font-medium text-sm uppercase tracking-wider mb-1">Về mục tiêu:</h4>
                  <p className="text-text-warm">Hiểu biết về sự đa dạng văn hoá của các dân tộc, quốc gia.</p>
                </div>
                <div>
                  <h4 className="text-kinpaku-gold font-medium text-sm uppercase tracking-wider mb-1">Về kĩ năng:</h4>
                  <p className="text-text-warm">Giao tiếp và hợp tác đa văn hoá.</p>
                </div>
                <div>
                  <h4 className="text-kinpaku-gold font-medium text-sm uppercase tracking-wider mb-1">Về thái độ, giá trị:</h4>
                  <p className="text-text-warm">Tôn trọng sự khác biệt giữa mọi người và sự đa dạng văn hoá. Trân trọng giá trị văn hoá của các dân tộc và của các quốc gia trên thế giới. Có ý thức phát huy những giá trị văn hoá của dân tộc, đất nước mình đồng thời sẵn sàng học hỏi những tinh hoa văn hoá của dân tộc, quốc gia khác.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
