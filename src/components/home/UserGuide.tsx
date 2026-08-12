"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';

export function UserGuide() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const steps = [
    {
      icon: "🌍",
      title: "Trạm 1: Khám Phá",
      desc: "Xoay quả cầu 3D, chọn quốc gia em yêu thích để nói chuyện với Đại sứ AI và tìm hiểu về văn hóa nước đó."
    },
    {
      icon: "🎮",
      title: "Trạm 2: Thử Thách",
      desc: "Chơi các minigame như Ghép đôi văn hóa, Đồng tình hay Không để kiểm tra kiến thức vừa học."
    },
    {
      icon: "📝",
      title: "Trạm 3: Luyện Tập",
      desc: "Trả lời các câu hỏi SGK. Trợ lý AI sẽ đọc và nhận xét bài làm của em ngay lập tức!"
    },
    {
      icon: "🎨",
      title: "Trạm 4: Sáng Tạo",
      desc: "Nộp sản phẩm (tranh vẽ, video, bài viết) lên Góc Sáng Tạo để khoe với cô giáo và các bạn."
    }
  ];

  const faqs = [
    {
      q: "Em phải làm sao nếu không thấy nút Nộp Bài?",
      a: "Hãy đảm bảo em đã điền đầy đủ Họ Tên, Lớp và Tên sản phẩm, đồng thời đã chọn 1 file từ máy tính nhé."
    },
    {
      q: "Điểm AI chấm có phải là điểm chính thức không?",
      a: "Điểm AI chỉ mang tính chất tham khảo nhanh. Cô giáo sẽ xem lại sản phẩm của em ở trang Quản lý và đưa ra điểm số chính thức cuối cùng."
    },
    {
      q: "Em có thể bình luận bằng tên ẩn danh không?",
      a: "Để xây dựng môi trường học tập văn minh, em cần nhập đúng Họ Tên và Lớp của mình trước khi gửi bình luận."
    }
  ];

  return (
    <section id="user-guide" className="py-16 bg-lacquer-black border-t border-gold-hairline">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-4 flex justify-center items-center gap-3 uppercase tracking-wider">
            <span className="text-4xl">📖</span> HƯỚNG DẪN SỬ DỤNG
          </h2>
          <p className="text-text-muted">Các bước để tham gia hành trình khám phá và giải đáp thắc mắc</p>
        </div>

        {/* 4 Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((step, idx) => (
            <Card key={idx} className="bg-raised-lacquer border-gold-hairline hover:border-kinpaku-gold transition-colors text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-kinpaku-gold/10 rounded-bl-full flex items-start justify-end p-3 text-kinpaku-gold font-bold font-mono">
                0{idx + 1}
              </div>
              <CardContent className="p-8 pt-10">
                <div className="text-5xl mb-6">{step.icon}</div>
                <h3 className="text-lg font-bold text-champagne mb-3">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl font-display text-kinpaku-gold mb-6 text-center">❓ CÂU HỎI THƯỜNG GẶP</h3>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`border border-gold-hairline rounded-lg bg-raised-lacquer overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'ring-1 ring-kinpaku-gold' : ''}`}
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full text-left p-5 flex justify-between items-center focus:outline-none"
                >
                  <span className="font-medium text-champagne pr-8">{faq.q}</span>
                  <span className={`text-kinpaku-gold text-xl transition-transform duration-300 ${activeFaq === idx ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${activeFaq === idx ? 'max-h-40' : 'max-h-0'}`}
                >
                  <div className="p-5 pt-0 text-text-muted text-sm border-t border-gold-hairline-strong mt-2">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
