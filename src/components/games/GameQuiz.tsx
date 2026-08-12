"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

const QUIZ_BANK = [
  {
    q: "Biểu hiện nào dưới đây cho thấy sự đa dạng văn hóa giữa các dân tộc trên thế giới?",
    options: ["Các dân tộc có phong tục, tập quán khác nhau.", "Các dân tộc đều sử dụng cùng một ngôn ngữ.", "Các quốc gia đều có cách tổ chức lễ hội giống nhau.", "Mọi dân tộc đều có trang phục truyền thống giống nhau."],
    ans: 0
  },
  {
    q: "Sự khác nhau về ngôn ngữ giữa các dân tộc là biểu hiện của",
    options: ["sự phát triển kinh tế.", "sự đa dạng văn hóa.", "sự khác biệt về địa lý.", "sự phân hóa xã hội."],
    ans: 1
  },
  {
    q: "Yếu tố nào dưới đây phản ánh sự đa dạng văn hóa giữa các dân tộc?",
    options: ["Múi giờ và vị trí địa lý.", "Diện tích lãnh thổ và dân số.", "Trang phục và phong tục truyền thống.", "Khí hậu và tài nguyên thiên nhiên."],
    ans: 2
  },
  {
    q: "Tết Nguyên đán của Việt Nam, lễ hội Holi của Ấn Độ và Lễ Tạ ơn của Hoa Kỳ là những ví dụ về sự đa dạng văn hóa về",
    options: ["ngôn ngữ.", "lễ hội và phong tục.", "điều kiện tự nhiên.", "tổ chức xã hội."],
    ans: 1
  },
  {
    q: "Sự khác nhau về món ăn truyền thống và cách chế biến giữa các dân tộc thể hiện",
    options: ["sự đa dạng văn hóa.", "sự khác biệt về chính trị.", "sự phát triển kinh tế.", "sự phân hóa xã hội."],
    ans: 0
  },
  {
    q: "Những công trình như chùa Nhật Bản, nhà sàn của một số dân tộc Việt Nam và nhà thờ châu Âu cho thấy sự đa dạng văn hóa về",
    options: ["kiến trúc.", "ngôn ngữ.", "tín ngưỡng.", "lễ hội."],
    ans: 0
  },
  {
    q: "Sự khác nhau về cách thờ cúng tổ tiên, nghi lễ và niềm tin tâm linh giữa các cộng đồng là biểu hiện của sự đa dạng về",
    options: ["ẩm thực.", "tín ngưỡng.", "ngôn ngữ.", "trang phục."],
    ans: 1
  },
  {
    q: "Áo dài của Việt Nam, kimono của Nhật Bản và sari của Ấn Độ thể hiện sự đa dạng văn hóa về",
    options: ["nghệ thuật biểu diễn.", "kiến trúc.", "trang phục.", "ngôn ngữ."],
    ans: 2
  },
  {
    q: "Sự khác nhau về âm nhạc, điệu múa và các loại hình nghệ thuật truyền thống giữa các dân tộc là biểu hiện của",
    options: ["sự đa dạng văn hóa.", "sự khác biệt về khí hậu.", "sự phát triển khoa học.", "sự phân bố dân cư."],
    ans: 0
  },
  {
    q: "Nhận định nào dưới đây đúng nhất về biểu hiện của sự đa dạng văn hóa?",
    options: ["Các dân tộc có những nét khác nhau về ngôn ngữ, trang phục, ẩm thực, phong tục và lễ hội.", "Sự đa dạng văn hóa chỉ thể hiện qua sự khác nhau về ngôn ngữ.", "Các dân tộc có văn hóa khác nhau nên không thể giao lưu với nhau.", "Sự đa dạng văn hóa làm cho các dân tộc không thể cùng chung sống hòa bình."],
    ans: 0
  }
];

export function GameQuiz() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  useEffect(() => {
    let timer: any;
    if (isPlaying && timeLeft > 0 && !isFinished) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlaying) {
      setIsFinished(true);
      setIsPlaying(false);
    }
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, isFinished]);

  const startGame = () => {
    // Shuffle questions
    const shuffled = [...QUIZ_BANK].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setCurrentQIndex(0);
    setScore(0);
    setWrongCount(0);
    setTimeLeft(60);
    setIsFinished(false);
    setIsPlaying(true);
    setSelectedOption(null);
  };

  const handleAnswer = (optIndex: number) => {
    if (selectedOption !== null) return; // Prevent double clicking
    
    setSelectedOption(optIndex);
    
    const isCorrect = optIndex === questions[currentQIndex].ans;
    if (isCorrect) {
      setScore(s => s + 10);
    } else {
      setWrongCount(c => c + 1);
    }

    // Auto next after short delay
    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(c => c + 1);
        setSelectedOption(null);
      } else {
        setIsFinished(true);
        setIsPlaying(false);
      }
    }, 800);
  };

  if (!isPlaying && !isFinished) {
    return (
      <section id="game-3" className="py-16 bg-lacquer-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-4 flex justify-center items-center gap-3 uppercase tracking-wider">
            <span className="text-4xl">⏱️</span> TRẠM 3: 60S THỬ THÁCH
          </h2>
          <p className="text-text-muted mb-8">Trắc nghiệm nhanh 10 câu hỏi trong vòng 60 giây.</p>
          <Button onClick={startGame} variant="primary" size="lg">BẮT ĐẦU CHƠI</Button>
        </div>
      </section>
    );
  }

  if (isFinished) {
    return (
      <section id="game-3" className="py-16 bg-lacquer-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-4xl font-display font-medium text-kinpaku-gold mb-8 uppercase tracking-wider">
            KẾT QUẢ THỬ THÁCH
          </h2>
          <Card className="max-w-md mx-auto border-gold-hairline bg-raised-lacquer mb-8">
            <CardContent className="p-8">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl text-champagne font-bold mb-6">ĐIỂM: {score}</h3>
              <div className="flex justify-around mb-6 text-lg">
                <div className="text-emerald-400">✅ Đúng: {score/10}</div>
                <div className="text-vermilion-warning">❌ Sai: {wrongCount}</div>
              </div>
              <div className="text-text-muted text-sm mb-2">⏱ Thời gian: {60 - timeLeft}s</div>
              <div className="text-kinpaku-gold text-lg font-bold">
                🏆 Xếp hạng: {score >= 80 ? 'Xuất sắc' : score >= 50 ? 'Khá' : 'Cần cố gắng'}
              </div>
            </CardContent>
          </Card>
          <Button onClick={startGame} variant="primary">CHƠI LẠI</Button>
        </div>
      </section>
    );
  }

  const currentQ = questions[currentQIndex];

  return (
    <section id="game-3" className="py-16 bg-lacquer-black relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-kinpaku-gold font-mono font-bold text-xl flex items-center gap-2">
            <span>⏱</span> 00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
          </div>
          <div className="text-champagne font-mono font-bold">
            Câu {currentQIndex + 1}/10
          </div>
          <div className="text-kinpaku-gold font-bold">
            Điểm: {score}
          </div>
        </div>

        <Card className="border-gold-hairline bg-raised-lacquer">
          <CardContent className="p-8">
            <h3 className="text-xl md:text-2xl text-text-warm font-medium mb-8 leading-relaxed">
              {currentQ.q}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt: string, idx: number) => {
                let btnClass = "text-left h-auto py-4 px-6 border-gold-hairline-strong hover:border-kinpaku-gold";
                
                if (selectedOption !== null) {
                  if (idx === currentQ.ans) {
                    btnClass = "text-left h-auto py-4 px-6 bg-emerald-600 border-emerald-500 text-white";
                  } else if (idx === selectedOption) {
                    btnClass = "text-left h-auto py-4 px-6 bg-vermilion-warning border-red-500 text-white";
                  }
                }

                return (
                  <Button
                    key={idx}
                    variant="secondary"
                    className={btnClass}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedOption !== null}
                  >
                    <span className="font-bold mr-2 text-kinpaku-gold">{['A', 'B', 'C', 'D'][idx]}.</span> {opt}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
