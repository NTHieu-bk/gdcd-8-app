"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';

export function Questions() {
  return (
    <section className="py-16 bg-lacquer-deep border-y border-gold-hairline">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-4 flex justify-center items-center gap-3 uppercase tracking-wider">
            <span className="text-4xl">🔍</span> CÂU HỎI KHÁM PHÁ SGK
          </h2>
        </div>

        <div className="space-y-6">
          <Card className="border-gold-hairline bg-raised-lacquer">
            <div className="p-8 md:p-12">
              <h3 className="text-xl font-bold text-champagne mb-4 flex gap-2">
                <span className="text-kinpaku-gold">A.</span> 
                Em hãy nêu những biểu hiện của sự đa dạng dân tộc và các nền văn hoá của Nhật Bản, Nga và Ni-giê-ri-a (về ẩm thực, trang phục, lễ hội,...) qua các thông tin trên.
              </h3>
              
              <div className="mt-6 p-8 rounded-lg border border-gold-hairline-strong bg-lacquer-black">
                <h4 className="text-kinpaku-gold font-bold mb-4">Gợi ý trả lời:</h4>
                <div className="space-y-4 text-text-warm text-sm leading-relaxed">
                  <div>
                    <span className="font-bold text-champagne">Nhật Bản:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Lối sống – phẩm chất văn hoá: kỉ luật, chăm chỉ, trung thành, thượng võ, rất đúng giờ; biểu tượng là võ sĩ Sa-mu-rai.</li>
                      <li>Ẩm thực: món truyền thống su-si (cơm trộn giấm ăn kèm hải sản/rau củ).</li>
                      <li>Trang phục: ki-mô-nô (mặc trong lễ hội, dịp đặc biệt).</li>
                      <li>Lễ hội: lễ hội hoa anh đào (xứ sở hoa anh đào).</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-champagne">Nga:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Thành phần dân tộc: có hơn 160 nhóm sắc tộc, tạo nên sự đa dạng văn hoá.</li>
                      <li>Ẩm thực: cháo ka-sa (nhiều loại theo độ tuổi), bánh mì đen rất phổ biến.</li>
                      <li>Trang phục: đa dạng theo dân tộc, điểm chung là màu sắc rực rỡ, lộng lẫy.</li>
                      <li>Lễ hội: nhiều lễ hội gắn với mùa màng; nổi bật là lễ hội tiễn mùa đông (cầu mùa xuân đến).</li>
                    </ul>
                  </div>
                  <div>
                    <span className="font-bold text-champagne">Ni-giê-ri-a:</span>
                    <ul className="list-disc pl-5 mt-1 space-y-1">
                      <li>Thành phần dân tộc – ngôn ngữ: hơn 250 bộ tộc, có rất nhiều hệ ngôn ngữ ➡️ văn hoá phong phú.</li>
                      <li>Ẩm thực: dùng nhiều gia vị, dầu cọ; đặc biệt ớt rất quan trọng; món nổi tiếng cơm giô-lốp.</li>
                      <li>Trang phục: nhiều kiểu theo bộ tộc; thường màu sắc sặc sỡ, kèm phụ kiện và trang sức.</li>
                      <li>Lễ hội: lễ hội hoá trang, lễ hội bắt cá, lễ hội khoai lang.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-gold-hairline bg-raised-lacquer">
            <div className="p-8 md:p-12">
              <h3 className="text-xl font-bold text-champagne mb-4 flex gap-2">
                <span className="text-kinpaku-gold">B.</span> 
                Hãy nêu thêm một số biểu hiện của sự đa dạng dân tộc và các nền văn hoá khác trên thế giới mà em biết.
              </h3>
              
              <div className="mt-6 p-8 rounded-lg border border-gold-hairline-strong bg-lacquer-black">
                <h4 className="text-kinpaku-gold font-bold mb-4">Gợi ý trả lời:</h4>
                <div className="text-text-warm text-sm leading-relaxed">
                  <ul className="list-disc pl-5 space-y-2">
                    <li><span className="text-champagne font-medium">Ngôn ngữ và chữ viết:</span> Mỗi dân tộc có tiếng nói, chữ viết (ví dụ: chữ Ả Rập viết từ phải sang trái).</li>
                    <li><span className="text-champagne font-medium">Sinh hoạt và lao động:</span> Khác nhau về nhà ở, bữa ăn, cách trồng trọt (ví dụ: người Tây Tạng chăn nuôi du mục).</li>
                    <li><span className="text-champagne font-medium">Phong tục tập quán:</span> Đa dạng trong cưới hỏi, tang ma (ví dụ: lễ hội Holi ở Ấn Độ).</li>
                    <li><span className="text-champagne font-medium">Trang phục, ẩm thực:</span> Mỗi nơi có kiểu ăn mặc, món ăn riêng (ví dụ: trang phục Sari, lễ hội Carnival).</li>
                    <li><span className="text-champagne font-medium">Tín ngưỡng, tôn giáo:</span> Thể hiện qua nghi lễ (ví dụ: Ramadan của Hồi giáo).</li>
                    <li><span className="text-champagne font-medium">Giao tiếp và ứng xử xã hội:</span> Khác nhau về cách thể hiện sự tôn trọng (ví dụ: chào hỏi bằng hôn má ở Pháp).</li>
                  </ul>
                  <p className="mt-4 text-kinpaku-gold font-medium italic">
                    👉 Sự đa dạng dân tộc và văn hóa thể hiện ở nhiều mặt đời sống, tạo nên bản sắc riêng của mỗi cộng đồng và làm cho văn hóa thế giới phong phú.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
