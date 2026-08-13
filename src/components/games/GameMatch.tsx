"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

// Data from prompt
const PAIRS = [
  { id: '1', left: 'Kimono', right: 'Trang phục truyền thống của Nhật Bản.' },
  { id: '2', left: 'Sushi', right: 'Món ăn nổi tiếng của Nhật Bản.' },
  { id: '3', left: 'Lễ hội tiễn mùa đông', right: 'Lễ hội đặc sắc được giới thiệu trong nội dung về Nga.' },
  { id: '4', left: 'Hơn 250 bộ tộc cùng chung sống', right: 'Thể hiện sự đa dạng dân tộc ở Ni-giê-ri-a.' },
  { id: '5', left: 'Nhiều hệ ngôn ngữ', right: 'Thể hiện sự đa dạng về ngôn ngữ ở Ni-giê-ri-a.' },
  { id: '6', left: 'Tìm hiểu phong tục của dân tộc khác', right: 'Giúp mở rộng hiểu biết và giao tiếp phù hợp.' },
];

export function GameMatch() {
  const [leftItems, setLeftItems] = useState<{id: string, text: string}[]>([]);
  const [rightItems, setRightItems] = useState<{id: string, text: string}[]>([]);
  
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); // stores matched IDs
  
  const [message, setMessage] = useState<{text: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('gameMatchPairs');
    if (saved) {
      try {
        setMatchedPairs(JSON.parse(saved));
      } catch(e) {}
    }
  }, []);

  // Initialize and shuffle
  useEffect(() => {
    const left = PAIRS.map(p => ({ id: p.id, text: p.left })).sort(() => Math.random() - 0.5);
    const right = PAIRS.map(p => ({ id: p.id, text: p.right })).sort(() => Math.random() - 0.5);
    setLeftItems(left);
    setRightItems(right);
  }, []);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      if (selectedLeft === selectedRight) {
        // Match!
        setMatchedPairs(prev => {
          const newPairs = [...prev, selectedLeft];
          localStorage.setItem('gameMatchPairs', JSON.stringify(newPairs));
          return newPairs;
        });
        setMessage({ text: '✅ Chính xác!', type: 'success' });
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setMessage(null);
        }, 1000);
      } else {
        // Wrong
        setMessage({ text: '❌ Chưa chính xác.', type: 'error' });
        setTimeout(() => {
          setSelectedLeft(null);
          setSelectedRight(null);
          setMessage(null);
        }, 1000);
      }
    }
  }, [selectedLeft, selectedRight]);

  const resetGame = () => {
    const left = PAIRS.map(p => ({ id: p.id, text: p.left })).sort(() => Math.random() - 0.5);
    const right = PAIRS.map(p => ({ id: p.id, text: p.right })).sort(() => Math.random() - 0.5);
    setLeftItems(left);
    setRightItems(right);
    setMatchedPairs([]);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMessage(null);
    localStorage.removeItem('gameMatchPairs');
  };

  return (
    <section id="game-1" className="py-16 bg-lacquer-black">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-4 flex justify-center items-center gap-3 uppercase tracking-wider">
          <span className="text-4xl">🧩</span> TRẠM THỬ THÁCH 1: GHÉP ĐÔI VĂN HÓA
        </h2>
        <p className="text-text-muted mb-8">Click chọn thẻ bên trái, sau đó click chọn thẻ bên phải tương ứng.</p>

        <div className="relative bg-raised-lacquer border border-gold-hairline rounded-xl p-6 md:p-10 shadow-lg">
          {message && (
            <div className={`absolute top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full font-bold z-10 transition-all ${
              message.type === 'success' ? 'bg-emerald-600/90 text-white shadow-[0_0_20px_rgba(5,150,105,0.4)]' : 'bg-red-500/90 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]'
            }`}>
              {message.text}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8 justify-center">
            {/* Left Column */}
            <div className="flex-1 flex flex-col gap-3">
              {leftItems.map(item => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedLeft === item.id;
                
                return (
                  <button
                    key={`l-${item.id}`}
                    disabled={isMatched || message !== null}
                    onClick={() => setSelectedLeft(item.id)}
                    className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                      isMatched 
                        ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400 cursor-default opacity-60'
                        : isSelected
                          ? 'bg-kinpaku-gold/20 border-kinpaku-gold text-champagne scale-105'
                          : 'bg-lacquer-deep border-gold-hairline hover:border-kinpaku-gold text-text-warm hover:text-champagne'
                    }`}
                  >
                    {item.text}
                  </button>
                )
              })}
            </div>

            {/* Right Column */}
            <div className="flex-1 flex flex-col gap-3">
              {rightItems.map(item => {
                const isMatched = matchedPairs.includes(item.id);
                const isSelected = selectedRight === item.id;
                
                return (
                  <button
                    key={`r-${item.id}`}
                    disabled={isMatched || message !== null}
                    onClick={() => setSelectedRight(item.id)}
                    className={`p-4 rounded-lg border text-left transition-all duration-300 ${
                      isMatched 
                        ? 'bg-emerald-900/30 border-emerald-500/50 text-emerald-400 cursor-default opacity-60'
                        : isSelected
                          ? 'bg-kinpaku-gold/20 border-kinpaku-gold text-champagne scale-105'
                          : 'bg-lacquer-deep border-gold-hairline hover:border-kinpaku-gold text-text-warm hover:text-champagne'
                    }`}
                  >
                    {item.text}
                  </button>
                )
              })}
            </div>
          </div>

          {matchedPairs.length === PAIRS.length && (
            <div className="mt-10 animate-fade-in-up">
              <h3 className="text-2xl font-display text-kinpaku-gold mb-4">🎉 Tuyệt vời! Em đã hoàn thành xuất sắc thử thách.</h3>
              <Button onClick={resetGame} variant="primary">Chơi lại</Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
