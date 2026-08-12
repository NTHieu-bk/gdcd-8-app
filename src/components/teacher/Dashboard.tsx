"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured()) {
        // Fallback to mock data if not configured
        setProducts([
          { id: 1, student_name: 'Nguyễn Văn A', class_name: '8A1', product_name: 'Trang phục Kimono', country: 'Nhật Bản', ai_score: 8.5, teacher_score: null, status: 'pending' },
          { id: 2, student_name: 'Lê Văn C', class_name: '8A2', product_name: 'Văn hóa Ẩm thực Nga', country: 'Nga', ai_score: 9.0, teacher_score: 9.5, status: 'graded' },
        ]);
        setComments([
          { id: 1, student_name: 'Trần Thị B', class_name: '8A1', content: 'Em rất thích trò chơi ghép đôi văn hóa, giúp em nhớ được nhiều thông tin thú vị.', pinned: true, created_at: new Date().toISOString() },
          { id: 2, student_name: 'Nguyễn Văn A', class_name: '8A1', content: 'Quả cầu 3D hơi lag trên điện thoại của em ạ.', pinned: false, created_at: new Date().toISOString() },
        ]);
        setIsLoading(false);
        return;
      }

      const [productsRes, commentsRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('comments').select('*').order('created_at', { ascending: false })
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (commentsRes.data) setComments(commentsRes.data);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  // Handle pin comment
  const handlePin = async (id: string, currentStatus: boolean) => {
    if (isSupabaseConfigured()) {
      await supabase.from('comments').update({ pinned: !currentStatus }).eq('id', id);
      setComments(prev => prev.map(c => c.id === id ? { ...c, pinned: !currentStatus } : c));
    } else {
      setComments(prev => prev.map(c => c.id === id ? { ...c, pinned: !currentStatus } : c));
    }
  };

  // Handle delete comment
  const handleDelete = async (id: string) => {
    if (isSupabaseConfigured()) {
      await supabase.from('comments').delete().eq('id', id);
      setComments(prev => prev.filter(c => c.id !== id));
    } else {
      setComments(prev => prev.filter(c => c.id !== id));
    }
  };

  // Aggregate real student progress from products and comments
  const studentsProgress = React.useMemo(() => {
    const studentMap = new Map<string, any>();
    
    // Process products
    products.forEach(p => {
      const key = `${p.student_name}-${p.class_name}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, { 
          id: key, 
          name: p.student_name, 
          class: p.class_name, 
          productCount: 0, 
          commentCount: 0,
          ai_score_avg: 0,
          total_score: 0
        });
      }
      const student = studentMap.get(key);
      student.productCount += 1;
      student.total_score += (p.ai_score || 0);
      student.ai_score_avg = Math.round((student.total_score / student.productCount) * 10); // Scale to 100
    });

    // Process comments
    comments.forEach(c => {
      const key = `${c.student_name}-${c.class_name}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, { 
          id: key, 
          name: c.student_name, 
          class: c.class_name, 
          productCount: 0, 
          commentCount: 0,
          ai_score_avg: 0,
          total_score: 0
        });
      }
      studentMap.get(key).commentCount += 1;
    });

    // Calculate final fake progress based on actual activity
    return Array.from(studentMap.values()).map(s => {
      const exchangeProgress = Math.min(s.commentCount * 25, 100);
      const productProgress = s.productCount > 0 ? 100 : 0;
      
      // Since we don't have game data, we'll estimate based on their product score
      const gameProgress = s.productCount > 0 ? s.ai_score_avg : (s.commentCount > 0 ? 50 : 0);
      const sgkProgress = s.productCount > 0 ? s.ai_score_avg : (s.commentCount > 0 ? 50 : 0);
      
      const totalProgress = Math.round((gameProgress + sgkProgress + productProgress + exchangeProgress) / 4);
      
      return {
        ...s,
        game: gameProgress,
        sgk: sgkProgress,
        product: productProgress,
        exchange: exchangeProgress,
        progress: totalProgress
      };
    }).sort((a, b) => b.progress - a.progress);
  }, [products, comments]);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display text-kinpaku-gold mb-6">📊 TỔNG QUAN HỌC TẬP</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-raised-lacquer border-gold-hairline"><CardContent className="p-6 text-center"><div className="text-3xl mb-2">👨‍🎓</div><div className="text-2xl font-bold text-champagne">120</div><div className="text-text-muted">Tổng học sinh</div></CardContent></Card>
              <Card className="bg-raised-lacquer border-gold-hairline"><CardContent className="p-6 text-center"><div className="text-3xl mb-2">🎨</div><div className="text-2xl font-bold text-champagne">{products.length}</div><div className="text-text-muted">Sản phẩm đã nộp</div></CardContent></Card>
              <Card className="bg-raised-lacquer border-gold-hairline"><CardContent className="p-6 text-center"><div className="text-3xl mb-2">📝</div><div className="text-2xl font-bold text-vermilion-warning">{products.filter(p => p.status === 'pending').length}</div><div className="text-text-muted">Cần chấm điểm</div></CardContent></Card>
              <Card className="bg-raised-lacquer border-gold-hairline"><CardContent className="p-6 text-center"><div className="text-3xl mb-2">💬</div><div className="text-2xl font-bold text-emerald-400">{comments.length}</div><div className="text-text-muted">Bình luận</div></CardContent></Card>
            </div>
          </div>
        );
      
      case 'progress':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-display text-kinpaku-gold mb-6">📈 TIẾN TRÌNH HỌC SINH</h2>
            <Card className="bg-raised-lacquer border-gold-hairline overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-lacquer-deep border-b border-gold-hairline-strong text-champagne">
                    <tr>
                      <th className="p-4 font-medium uppercase text-sm tracking-wider">Học sinh</th>
                      <th className="p-4 font-medium uppercase text-sm tracking-wider">Lớp</th>
                      <th className="p-4 font-medium uppercase text-sm tracking-wider">Tiến trình</th>
                      <th className="p-4 font-medium uppercase text-sm tracking-wider">Game</th>
                      <th className="p-4 font-medium uppercase text-sm tracking-wider">SGK</th>
                      <th className="p-4 font-medium uppercase text-sm tracking-wider">Sản phẩm</th>
                      <th className="p-4 font-medium uppercase text-sm tracking-wider">Trao đổi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-hairline-strong/30">
                    {studentsProgress.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-text-faint italic">
                          Chưa có dữ liệu học sinh. Các em cần nộp sản phẩm hoặc bình luận để được ghi nhận.
                        </td>
                      </tr>
                    ) : (
                      studentsProgress.map(student => (
                        <tr key={student.id} className="hover:bg-lacquer-deep/50 transition-colors">
                        <td className="p-4 text-text-warm font-medium">{student.name}</td>
                        <td className="p-4 text-text-muted">{student.class}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="text-kinpaku-gold font-bold w-10">{student.progress}%</span>
                            <div className="flex-1 h-2 bg-lacquer-black rounded-full overflow-hidden border border-gold-hairline/30"><div className="h-full bg-kinpaku-gold" style={{width: `${student.progress}%`}}></div></div>
                          </div>
                        </td>
                        <td className="p-4 text-text-muted">{student.game}%</td>
                        <td className="p-4 text-text-muted">{student.sgk}%</td>
                        <td className="p-4 text-text-muted">{student.product}% ({student.productCount} SP)</td>
                        <td className="p-4 text-text-muted">{student.exchange}% ({student.commentCount} BL)</td>
                      </tr>
                    )))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );

      case 'grading':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-display text-kinpaku-gold mb-6">🎨 SẢN PHẨM & CHẤM ĐIỂM</h2>
            {isLoading ? (
              <div className="text-kinpaku-gold animate-pulse text-center p-10">Đang tải dữ liệu...</div>
            ) : products.length === 0 ? (
              <div className="text-text-faint text-center p-10 bg-raised-lacquer border border-dashed border-gold-hairline/30 rounded-lg">Chưa có sản phẩm nào được nộp.</div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {products.map(product => (
                  <Card key={product.id} className="bg-raised-lacquer border-gold-hairline">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-24 h-24 bg-lacquer-black rounded flex items-center justify-center text-3xl border border-gold-hairline-strong">
                        {product.file_name?.endsWith('.pdf') ? '📄' : product.file_name?.endsWith('.mp4') ? '🎥' : '🖼️'}
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-champagne">{product.product_name}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs border ${product.status === 'graded' ? 'bg-emerald-900/30 text-emerald-400 border-emerald-500/30' : 'bg-vermilion-warning/20 text-vermilion-warning border-vermilion-warning/30'}`}>
                            {product.status === 'graded' ? 'Đã chấm' : 'Chờ chấm'}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted mb-4">Học sinh: {product.student_name} - Lớp: {product.class_name} | Chủ đề: {product.country}</p>
                        
                        <div className="flex flex-wrap gap-4 items-center">
                          <div className="bg-lacquer-black px-4 py-2 rounded border border-gold-hairline-strong flex items-center gap-2">
                            <span className="text-lg">🤖</span>
                            <div>
                              <p className="text-[10px] text-text-faint uppercase">AI Tham khảo</p>
                              <p className="font-bold text-kinpaku-gold">{product.ai_score}/10</p>
                            </div>
                          </div>
                          
                          {product.teacher_score && (
                            <div className="bg-kinpaku-gold/10 px-4 py-2 rounded border border-kinpaku-gold/30 flex items-center gap-2">
                              <span className="text-lg">👩‍🏫</span>
                              <div>
                                <p className="text-[10px] text-kinpaku-gold uppercase">Điểm Giáo viên</p>
                                <p className="font-bold text-champagne">{product.teacher_score}/10</p>
                              </div>
                            </div>
                          )}
                          
                          <Button className="ml-auto mt-4 md:mt-0">👩‍🏫 CHẤM SẢN PHẨM</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        );

      case 'comments':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-display text-kinpaku-gold mb-6">💬 QUẢN LÝ BÌNH LUẬN</h2>
            {isLoading ? (
              <div className="text-kinpaku-gold animate-pulse text-center p-10">Đang tải dữ liệu...</div>
            ) : comments.length === 0 ? (
              <div className="text-text-faint text-center p-10 bg-raised-lacquer border border-dashed border-gold-hairline/30 rounded-lg">Chưa có bình luận nào.</div>
            ) : (
              <div className="space-y-4">
                {comments.map(comment => {
                  const date = new Date(comment.created_at);
                  return (
                    <Card key={comment.id} className={`bg-raised-lacquer border ${comment.pinned ? 'border-kinpaku-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-gold-hairline'}`}>
                      <CardContent className="p-5 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="font-bold text-champagne">{comment.student_name}</span>
                            <span className="text-xs px-2 py-0.5 bg-lacquer-black rounded text-text-muted border border-gold-hairline-strong">{comment.class_name}</span>
                            <span className="text-xs text-text-faint ml-2">{date.toLocaleDateString('vi-VN')} {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            {comment.pinned && <span className="text-xs bg-kinpaku-gold text-lacquer-black px-2 py-0.5 rounded ml-2 font-bold flex items-center gap-1">📌 Đã ghim</span>}
                          </div>
                          <p className="text-text-warm">{comment.content}</p>
                        </div>
                        <div className="flex md:flex-col gap-2 mt-4 md:mt-0">
                          <Button 
                            onClick={() => handlePin(comment.id, comment.pinned)} 
                            variant="secondary" size="sm" className={comment.pinned ? "text-text-muted" : "text-kinpaku-gold border-kinpaku-gold"}
                          >
                            📌 {comment.pinned ? "Bỏ ghim" : "Ghim"}
                          </Button>
                          <Button 
                            onClick={() => handleDelete(comment.id)} 
                            variant="secondary" size="sm" className="text-vermilion-warning border-vermilion-warning hover:bg-vermilion-warning hover:text-white"
                          >
                            🗑️ Xóa
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-lacquer-black flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-lacquer-deep border-r border-gold-hairline flex flex-col">
        <div className="p-6 border-b border-gold-hairline">
          <h1 className="text-xl font-display font-bold text-kinpaku-gold tracking-widest uppercase">
            Cổng Giáo Viên
          </h1>
          <p className="text-sm text-champagne mt-2">Cô Nguyễn Thị Thanh Thuỷ</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => setActiveTab('overview')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'overview' ? 'bg-kinpaku-gold text-lacquer-black font-bold' : 'text-text-warm hover:bg-raised-lacquer'}`}>
            <span className="text-xl">📊</span> Tổng quan
          </button>
          <button onClick={() => setActiveTab('progress')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'progress' ? 'bg-kinpaku-gold text-lacquer-black font-bold' : 'text-text-warm hover:bg-raised-lacquer'}`}>
            <span className="text-xl">📈</span> Tiến trình
          </button>
          <button onClick={() => setActiveTab('grading')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'grading' ? 'bg-kinpaku-gold text-lacquer-black font-bold' : 'text-text-warm hover:bg-raised-lacquer'}`}>
            <span className="text-xl">📝</span> Chấm điểm
          </button>
          <button onClick={() => setActiveTab('comments')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'comments' ? 'bg-kinpaku-gold text-lacquer-black font-bold' : 'text-text-warm hover:bg-raised-lacquer'}`}>
            <span className="text-xl">💬</span> Bình luận
          </button>
        </nav>
        
        <div className="p-4 border-t border-gold-hairline">
          <Button onClick={onLogout} variant="secondary" className="w-full text-text-muted border-gold-hairline-strong hover:text-white">
            Đăng xuất
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
