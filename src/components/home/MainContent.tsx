"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function MainContent() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() === '') {
      setError(true);
      return;
    }
    setError(false);
    setIsUnlocked(true);
  };

  return (
    <section id="main-content" className="py-16 bg-lacquer-deep border-y border-gold-hairline">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Unlock Question Section */}
        {!isUnlocked && (
          <div className="mb-12">
            <Card className="border-kinpaku-gold shadow-[0_0_30px_rgba(212,175,55,0.1)]">
              <CardContent className="p-10 md:p-14 text-center">
                <div className="text-4xl mb-6">🤔</div>
                <h3 className="text-2xl font-display font-medium text-champagne mb-4">Câu hỏi khởi động</h3>
                <p className="text-lg text-text-warm mb-8">
                  “Em hãy kể tên một số phong tục, tập quán đặc sắc của các dân tộc trên thế giới mà em biết.”
                </p>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto">
                  <Input
                    value={answer}
                    onChange={(e) => {
                      setAnswer(e.target.value);
                      if (error && e.target.value.trim() !== '') setError(false);
                    }}
                    placeholder="Nhập câu trả lời của em..."
                    className={`py-6 text-base ${error ? 'border-vermilion-warning focus-visible:ring-vermilion-warning' : ''}`}
                  />
                  {error && <p className="text-sm text-vermilion-warning text-left">Vui lòng nhập câu trả lời để tiếp tục.</p>}
                  
                  <Button type="submit" size="lg" className="mt-2 tracking-widest font-bold">
                    GỬI CÂU TRẢ LỜI
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content (Locked initially) */}
        {isUnlocked && (
          <div className="animate-fade-in-up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-2 flex justify-center items-center gap-3 uppercase tracking-wider">
                <span className="text-3xl">📖</span> NỘI DUNG CHÍNH
              </h2>
            </div>
            
            <Card className="border-gold-hairline overflow-hidden bg-raised-lacquer">
              <div className="h-2 w-full bg-kinpaku-gold"></div>
              <CardContent className="p-8 md:p-10">
                <p className="text-xl text-champagne font-medium mb-6 leading-relaxed">
                  Sự đa dạng của các dân tộc và các nền văn hóa được biểu hiện thông qua:
                </p>
                
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-kinpaku-gold/20 flex items-center justify-center text-kinpaku-gold border border-kinpaku-gold/40">
                      1
                    </span>
                    <p className="text-lg text-text-warm leading-relaxed pt-1">
                      Mỗi dân tộc có những đặc trưng khác nhau về màu da, ngoại hình.
                    </p>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-kinpaku-gold/20 flex items-center justify-center text-kinpaku-gold border border-kinpaku-gold/40">
                      2
                    </span>
                    <p className="text-lg text-text-warm leading-relaxed pt-1">
                      Mỗi dân tộc đều có những nét riêng về tính cách, truyền thống, phong tục tập quán, ngôn ngữ,... <br className="hidden md:block"/>
                      <span className="text-kinpaku-pale font-medium mt-2 block">
                        Đó là những vốn quý của nhân loại cần được tôn trọng, kế thừa và phát triển.
                      </span>
                    </p>
                  </li>
                </ul>

                {/* Decorative Elements */}
                <div className="mt-12 pt-8 border-t border-gold-hairline flex flex-col md:flex-row gap-6 items-center justify-center">
                   {/* Infographic mock placeholders - in real app would use images */}
                   <div className="w-24 h-24 rounded-full border border-dashed border-kinpaku-gold/50 flex flex-col items-center justify-center text-kinpaku-gold opacity-70">
                     <span className="text-2xl">🗣️</span>
                     <span className="text-xs mt-1">Ngôn ngữ</span>
                   </div>
                   <div className="w-24 h-24 rounded-full border border-dashed border-kinpaku-gold/50 flex flex-col items-center justify-center text-kinpaku-gold opacity-70">
                     <span className="text-2xl">👘</span>
                     <span className="text-xs mt-1">Trang phục</span>
                   </div>
                   <div className="w-24 h-24 rounded-full border border-dashed border-kinpaku-gold/50 flex flex-col items-center justify-center text-kinpaku-gold opacity-70">
                     <span className="text-2xl">🍜</span>
                     <span className="text-xs mt-1">Ẩm thực</span>
                   </div>
                   <div className="w-24 h-24 rounded-full border border-dashed border-kinpaku-gold/50 flex flex-col items-center justify-center text-kinpaku-gold opacity-70">
                     <span className="text-2xl">🎭</span>
                     <span className="text-xs mt-1">Nghệ thuật</span>
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
