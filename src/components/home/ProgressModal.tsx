"use client";

import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProgressModal({ isOpen, onClose }: ProgressModalProps) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [studentInfo, setStudentInfo] = useState<{name: string, class: string} | null>(null);
  
  // Local Progress States
  const [localGameProgress, setLocalGameProgress] = useState(0);
  const [localSgkProgress, setLocalSgkProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    
    setIsLoading(true);
    const studentDataStr = localStorage.getItem('studentData');
    if (studentDataStr) {
      try {
        const student = JSON.parse(studentDataStr);
        const name = student.full_name || student.username;
        const className = student.class_name || '';
        setStudentInfo({ name, class: className });
        
        
        fetchStudentProgress(name, className);
        calculateLocalProgress(name, className);
      } catch (e) {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [isOpen]);

  const syncProgressToSupabase = async (studentName: string, className: string, gameProg: number, sgkProg: number) => {
    if (!isSupabaseConfigured()) return;
    
    const progressData = JSON.stringify({ game: gameProg, sgk: sgkProg });
    const content = `[PROGRESS_SYNC]${progressData}`;
    
    // Check if a sync comment already exists for this student
    const { data: existingComments } = await supabase
      .from('comments')
      .select('id, content')
      .eq('student_name', studentName)
      .eq('class_name', className)
      .like('content', '[PROGRESS_SYNC]%')
      .order('created_at', { ascending: false })
      .limit(1);
      
    if (existingComments && existingComments.length > 0) {
      if (existingComments[0].content !== content) {
        // Data changed, update the existing sync record
        await supabase.from('comments').update({ content, created_at: new Date().toISOString() }).eq('id', existingComments[0].id);
      }
    } else {
      // If not exists, create a new one
      await supabase.from('comments').insert({
        student_name: studentName,
        class_name: className,
        content,
        pinned: false
      });
    }
  };

  const calculateLocalProgress = (studentName: string, className: string) => {
    // 1. Calculate SGK Progress (Questions A & B)
    let sgkTotalScore = 0;
    let sgkCount = 0;
    
    ['A', 'B'].forEach(id => {
      const resStr = localStorage.getItem(`question_${id}_result`);
      if (resStr) {
        try {
          const res = JSON.parse(resStr);
          sgkTotalScore += (res.score || 0) * 10; // score out of 10 to percentage
          sgkCount++;
        } catch(e) {}
      }
    });
    const sgkProg = sgkCount > 0 ? Math.round(sgkTotalScore / 2) : 0;
    setLocalSgkProgress(sgkProg); // Divide by 2 total questions

    // 2. Calculate Game Progress (3 Games)
    let matchProg = 0;
    let agreeProg = 0;
    let quizProg = 0;

    // Game 1: Match
    const matchStr = localStorage.getItem('gameMatchPairs');
    if (matchStr) {
      try {
        const pairs = JSON.parse(matchStr);
        matchProg = Math.round((pairs.length / 6) * 100);
      } catch(e) {}
    }

    // Game 2: Agree
    if (localStorage.getItem('gameAgreeFinished') === 'true') {
      const agreeScore = parseInt(localStorage.getItem('gameAgreeScore') || '0', 10);
      agreeProg = Math.round((agreeScore / 5) * 100);
    }

    // Game 3: Quiz
    if (localStorage.getItem('gameQuizFinished') === 'true') {
      quizProg = parseInt(localStorage.getItem('gameQuizScore') || '0', 10);
    }

    const gameProg = Math.round((matchProg + agreeProg + quizProg) / 3);
    setLocalGameProgress(gameProg);
    
    // Sync local progress up to Supabase
    syncProgressToSupabase(studentName, className, gameProg, sgkProg);
  };

  const fetchStudentProgress = async (studentName: string, className: string) => {
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }

    const [productsRes, commentsRes] = await Promise.all([
      supabase.from('products').select('*').eq('student_name', studentName).eq('class_name', className).order('created_at', { ascending: false }),
      supabase.from('comments').select('id', { count: 'exact' }).eq('student_name', studentName).eq('class_name', className).not('content', 'ilike', '[PROGRESS_SYNC]%')
    ]);

    if (!productsRes.error && productsRes.data) {
      setSubmissions(productsRes.data);
    }
    if (!commentsRes.error && commentsRes.count !== null) {
      setCommentCount(commentsRes.count);
    }
    setIsLoading(false);
  };

  if (!isOpen) return null;

  // Calculate progress identical to Teacher Dashboard (for DB parts) + Local parts
  const productCount = submissions.length;

  const exchangeProgress = commentCount > 0 ? 100 : 0;
  const productProgress = productCount > 0 ? 100 : 0;
  
  const gameProgress = localGameProgress;
  const sgkProgress = localSgkProgress;
  
  const totalProgress = Math.round((gameProgress + sgkProgress + productProgress + exchangeProgress) / 4);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }}>
      <div 
        className="w-full max-w-4xl bg-lacquer-deep border border-gold-hairline rounded-lg shadow-2xl flex flex-col max-h-[90vh] animate-fade-in-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gold-hairline flex justify-between items-center bg-lacquer-black shrink-0">
          <h3 className="text-xl font-display text-kinpaku-gold flex items-center gap-2">
            <span>📈</span> TIẾN TRÌNH HỌC TẬP CỦA EM
          </h3>
          <button onClick={onClose} className="text-text-muted hover:text-vermilion-warning text-3xl leading-none">&times;</button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1 bg-lacquer-black">
          {studentInfo ? (
            <div className="mb-6 bg-raised-lacquer p-4 rounded border border-kinpaku-gold/30">
              <p className="text-sm text-text-muted">Học sinh:</p>
              <p className="text-xl text-champagne font-bold">{studentInfo.name} <span className="text-sm font-normal text-text-faint">({studentInfo.class})</span></p>
            </div>
          ) : (
            <div className="mb-6 bg-vermilion-warning/10 p-4 rounded border border-vermilion-warning/30">
              <p className="text-vermilion-warning">Chưa có thông tin học sinh đăng nhập. Vui lòng đăng nhập lại.</p>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center p-12">
              <span className="w-8 h-8 border-4 border-kinpaku-gold border-t-transparent rounded-full animate-spin"></span>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Progress Section */}
              <div>
                <h4 className="text-kinpaku-gold font-medium mb-4 uppercase tracking-wider text-sm border-b border-gold-hairline pb-2">Tổng quan Tiến trình</h4>
                
                <div className="flex items-center gap-4 mb-6 bg-raised-lacquer p-4 rounded border border-gold-hairline">
                  <div className="text-4xl font-display text-kinpaku-gold">{totalProgress}%</div>
                  <div className="flex-1">
                    <p className="text-sm text-text-muted mb-1">Mức độ hoàn thành tổng thể</p>
                    <div className="w-full h-3 bg-lacquer-black rounded-full overflow-hidden border border-gold-hairline/30">
                      <div className="h-full bg-kinpaku-gold transition-all duration-1000" style={{width: `${totalProgress}%`}}></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-raised-lacquer p-4 rounded border border-gold-hairline text-center">
                    <div className="text-2xl mb-2">🎮</div>
                    <p className="text-xs text-text-muted uppercase mb-1">Game</p>
                    <p className="text-lg font-bold text-champagne">{gameProgress}%</p>
                  </div>
                  <div className="bg-raised-lacquer p-4 rounded border border-gold-hairline text-center">
                    <div className="text-2xl mb-2">📖</div>
                    <p className="text-xs text-text-muted uppercase mb-1">SGK</p>
                    <p className="text-lg font-bold text-champagne">{sgkProgress}%</p>
                  </div>
                  <div className="bg-raised-lacquer p-4 rounded border border-gold-hairline text-center">
                    <div className="text-2xl mb-2">🎨</div>
                    <p className="text-xs text-text-muted uppercase mb-1">Sản phẩm ({productCount})</p>
                    <p className="text-lg font-bold text-champagne">{productProgress}%</p>
                  </div>
                  <div className="bg-raised-lacquer p-4 rounded border border-gold-hairline text-center">
                    <div className="text-2xl mb-2">💬</div>
                    <p className="text-xs text-text-muted uppercase mb-1">Trao đổi ({commentCount})</p>
                    <p className="text-lg font-bold text-champagne">{exchangeProgress}%</p>
                  </div>
                </div>
              </div>

              {/* Products Section */}
              <div>
                <h4 className="text-kinpaku-gold font-medium mb-4 uppercase tracking-wider text-sm border-b border-gold-hairline pb-2">Chi tiết sản phẩm đã nộp</h4>
                
                {submissions.length === 0 ? (
                  <div className="text-center p-8 bg-raised-lacquer rounded border border-dashed border-gold-hairline">
                    <span className="text-4xl opacity-50 block mb-2">🌱</span>
                    <p className="text-text-muted">Em chưa nộp sản phẩm nào.</p>
                    <button onClick={() => { onClose(); document.getElementById('creative-corner')?.scrollIntoView({ behavior: 'smooth' }); }} className="text-kinpaku-gold text-sm underline mt-2 inline-block">Đến Góc sáng tạo ngay</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map(sub => (
                      <Card key={sub.id} className="bg-raised-lacquer border-gold-hairline/50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h5 className="font-bold text-champagne text-lg">{sub.product_name}</h5>
                            <span className="text-xs bg-kinpaku-gold/10 text-kinpaku-gold px-2 py-1 rounded-full border border-kinpaku-gold/30 font-medium">
                              {sub.country}
                            </span>
                          </div>
                          <p className="text-xs text-text-muted mb-4">{new Date(sub.created_at).toLocaleDateString('vi-VN')} {new Date(sub.created_at).toLocaleTimeString('vi-VN')}</p>
                          
                          <div className="grid grid-cols-2 gap-4 border-t border-gold-hairline-strong pt-3">
                            <div className="bg-lacquer-black p-3 rounded">
                              <p className="text-[10px] text-text-faint uppercase tracking-wider mb-1">AI Đánh giá</p>
                              <p className="text-kinpaku-gold font-bold text-lg">{sub.ai_score ? sub.ai_score + '/10' : 'Chưa chấm'}</p>
                            </div>
                            <div className="bg-kinpaku-gold/5 p-3 rounded border border-kinpaku-gold/20">
                              <p className="text-[10px] text-kinpaku-gold uppercase tracking-wider mb-1 font-bold">Giáo viên chấm</p>
                              <p className="text-champagne font-bold text-lg">{sub.teacher_score ? sub.teacher_score + '/10' : 'Đang chờ'}</p>
                              {sub.teacher_comment && (
                                <p className="text-xs text-text-warm mt-1 italic border-t border-kinpaku-gold/20 pt-1 mt-2">"{sub.teacher_comment}"</p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-gold-hairline bg-lacquer-deep flex justify-end shrink-0">
          <Button variant="secondary" onClick={onClose} className="px-8">ĐÓNG</Button>
        </div>
      </div>
    </div>
  );
}
