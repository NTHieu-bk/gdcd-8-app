"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

export function MainContent() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const savedState = localStorage.getItem('mainContentUnlocked');
    if (savedState === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim() === '') {
      setError(true);
      return;
    }
    setError(false);
    setIsUnlocked(true);
    localStorage.setItem('mainContentUnlocked', 'true');
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

                {/* Gallery Elements */}
                <div className="mt-12 pt-8 border-t border-gold-hairline">
                  <h4 className="text-center text-kinpaku-gold font-display text-2xl mb-8 uppercase tracking-widest">
                    Muôn màu văn hóa thế giới
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center justify-center">
                    
                    <div 
                      className="group relative rounded-xl overflow-hidden border border-gold-hairline hover:border-kinpaku-gold transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-raised-lacquer cursor-pointer flex flex-col"
                      onClick={() => setSelectedImage('/culture-1.jpg')}
                    >
                      <div className="aspect-[4/3] bg-lacquer-black relative overflow-hidden">
                        <img src="/culture-1.jpg" alt="Danh lam thắng cảnh và di sản" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x450/2a2a2a/d4af37?text=Ảnh+1:+Di+sản+Văn+hóa'; }} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                          <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium transition-opacity">🔍 Phóng to</span>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gold-hairline">
                        <h5 className="text-kinpaku-gold font-bold text-lg mb-1">Danh lam thắng cảnh & Di sản</h5>
                        <p className="text-text-muted text-sm leading-relaxed">Các công trình kiến trúc biểu tượng của các quốc gia</p>
                      </div>
                    </div>

                    <div 
                      className="group relative rounded-xl overflow-hidden border border-gold-hairline hover:border-kinpaku-gold transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-raised-lacquer cursor-pointer flex flex-col"
                      onClick={() => setSelectedImage('/culture-2.jpg')}
                    >
                      <div className="aspect-[4/3] bg-lacquer-black relative overflow-hidden">
                        <img src="/culture-2.jpg" alt="Trang phục và Nghệ thuật biểu diễn" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x450/2a2a2a/d4af37?text=Ảnh+2:+Nghệ+thuật+Biểu+diễn'; }} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                          <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium transition-opacity">🔍 Phóng to</span>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gold-hairline">
                        <h5 className="text-kinpaku-gold font-bold text-lg mb-1">Trang phục & Biểu diễn</h5>
                        <p className="text-text-muted text-sm leading-relaxed">Nét đẹp trong trang phục và điệu múa truyền thống</p>
                      </div>
                    </div>

                    <div 
                      className="group relative rounded-xl overflow-hidden border border-gold-hairline hover:border-kinpaku-gold transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-raised-lacquer cursor-pointer flex flex-col"
                      onClick={() => setSelectedImage('/culture-3.jpg')}
                    >
                      <div className="aspect-[4/3] bg-lacquer-black relative overflow-hidden">
                        <img src="/culture-3.jpg" alt="Đặc trưng Ẩm thực" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={(e) => { e.currentTarget.src = 'https://placehold.co/600x450/2a2a2a/d4af37?text=Ảnh+3:+Ẩm+thực'; }} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                          <span className="opacity-0 group-hover:opacity-100 text-white bg-black/50 px-3 py-1 rounded-full text-sm font-medium transition-opacity">🔍 Phóng to</span>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gold-hairline">
                        <h5 className="text-kinpaku-gold font-bold text-lg mb-1">Tinh hoa Ẩm thực</h5>
                        <p className="text-text-muted text-sm leading-relaxed">Sự phong phú trong nguyên liệu và cách chế biến</p>
                      </div>
                    </div>

                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md transition-opacity" 
          onClick={() => setSelectedImage(null)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}
        >
          <div className="relative w-full max-w-6xl flex flex-col items-center justify-center animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white/70 hover:text-white text-5xl transition-colors w-12 h-12 flex items-center justify-center" 
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img src={selectedImage} alt="Phóng to ảnh văn hóa" className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl" />
          </div>
        </div>
      )}
    </section>
  );
}
