"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

const QUESTIONS = [
  {
    id: 1,
    text: "Các dân tộc có thể có ngôn ngữ, trang phục, ẩm thực và phong tục khác nhau. Những khác biệt đó là biểu hiện tự nhiên của sự đa dạng văn hóa.",
    answer: true,
  },
  {
    id: 2,
    text: "Vì mỗi dân tộc có phong tục và cách sinh hoạt khác nhau nên chỉ có văn hóa của dân tộc mình mới đáng được coi trọng.",
    answer: false,
    explanation: "Mỗi dân tộc có những giá trị văn hóa riêng và đều đáng được tôn trọng."
  },
  {
    id: 3,
    text: "Áo dài của Việt Nam, kimono của Nhật Bản, sari của Ấn Độ và hanbok của Hàn Quốc khác nhau về kiểu dáng, nhưng đều là những biểu hiện của bản sắc văn hóa dân tộc.",
    answer: true,
  },
  {
    id: 4,
    text: "Các lễ hội, tín ngưỡng và phong tục khác nhau giữa các dân tộc là những yếu tố làm cho văn hóa thế giới trở nên đa dạng và phong phú.",
    answer: true,
  },
  {
    id: 5,
    text: "Khi thấy một dân tộc có cách ăn uống, giao tiếp hoặc trang phục khác với mình, chúng ta có thể cho rằng đó là cách sống lạc hậu và không phù hợp.",
    answer: false,
    explanation: "Không nên đánh giá một nền văn hóa chỉ dựa trên tiêu chuẩn của văn hóa khác. Cần tìm hiểu hoàn cảnh và ý nghĩa của những nét văn hóa đó."
  }
];

export function GameAgree() {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (answer: boolean) => {
    if (showResult) return;
    
    setSelectedAnswer(answer);
    setShowResult(true);
    
    if (answer === QUESTIONS[currentQIndex].answer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQIndex < QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setShowResult(false);
      setSelectedAnswer(null);
    } else {
      setIsFinished(true);
    }
  };

  const resetGame = () => {
    setCurrentQIndex(0);
    setShowResult(false);
    setSelectedAnswer(null);
    setScore(0);
    setIsFinished(false);
  };

  const currentQ = QUESTIONS[currentQIndex];

  return (
    <section id="game-2" className="py-16 bg-lacquer-deep border-y border-gold-hairline">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-4 flex justify-center items-center gap-3 uppercase tracking-wider">
          <span className="text-4xl">⚖️</span> TRẠM 2: ĐỒNG TÌNH HAY KHÔNG
        </h2>
        <p className="text-text-muted mb-8">Đọc kĩ các nhận định dưới đây và đưa ra quan điểm của em.</p>

        <Card className="border-gold-hairline bg-raised-lacquer overflow-hidden relative shadow-2xl">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 h-1 bg-kinpaku-gold transition-all duration-300" style={{ width: `${((currentQIndex) / QUESTIONS.length) * 100}%` }}></div>
          
          <CardContent className="p-8 md:p-12">
            {!isFinished ? (
              <div className="animate-fade-in-up">
                <div className="mb-6 text-champagne font-mono text-sm opacity-70">
                  Câu hỏi {currentQIndex + 1} / {QUESTIONS.length}
                </div>
                
                <h3 className="text-xl md:text-2xl text-text-warm font-medium leading-relaxed mb-10">
                  "{currentQ.text}"
                </h3>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                  <Button 
                    onClick={() => handleAnswer(true)} 
                    disabled={showResult}
                    className={`flex-1 py-6 text-lg ${showResult && selectedAnswer === true ? (currentQ.answer === true ? 'bg-emerald-600 border-emerald-500' : 'bg-vermilion-warning border-red-500') : showResult && currentQ.answer === true ? 'bg-emerald-600 border-emerald-500' : ''}`}
                  >
                    👍 ĐỒNG TÌNH
                  </Button>
                  <Button 
                    onClick={() => handleAnswer(false)} 
                    disabled={showResult}
                    variant="secondary"
                    className={`flex-1 py-6 text-lg ${showResult && selectedAnswer === false ? (currentQ.answer === false ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-vermilion-warning border-red-500 text-white') : showResult && currentQ.answer === false ? 'bg-emerald-600 border-emerald-500 text-white' : ''}`}
                  >
                    👎 KHÔNG ĐỒNG TÌNH
                  </Button>
                </div>

                {showResult && (
                  <div className={`p-4 rounded-lg mb-6 text-left animate-fade-in-up ${selectedAnswer === currentQ.answer ? 'bg-emerald-900/30 border border-emerald-500/50' : 'bg-vermilion-warning/20 border border-vermilion-warning/50'}`}>
                    <div className="flex items-center gap-2 mb-2 font-bold">
                      {selectedAnswer === currentQ.answer ? (
                        <span className="text-emerald-400">✅ Chính xác!</span>
                      ) : (
                        <span className="text-vermilion-warning">❌ Chưa chính xác.</span>
                      )}
                    </div>
                    {currentQ.explanation && (
                      <p className="text-text-muted text-sm">{currentQ.explanation}</p>
                    )}
                  </div>
                )}

                {showResult && (
                  <Button onClick={handleNext} variant="primary" className="mt-4">
                    {currentQIndex < QUESTIONS.length - 1 ? 'CÂU TIẾP THEO' : 'XEM KẾT QUẢ'}
                  </Button>
                )}
              </div>
            ) : (
              <div className="animate-fade-in-up text-center py-8">
                <div className="text-6xl mb-6">🏆</div>
                <h3 className="text-3xl text-kinpaku-gold font-display font-medium mb-4">HOÀN THÀNH THỬ THÁCH</h3>
                <p className="text-xl text-text-warm mb-8">
                  Số câu trả lời đúng: <span className="font-bold text-champagne">{score} / {QUESTIONS.length}</span>
                </p>
                <Button onClick={resetGame} variant="primary">CHƠI LẠI</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
