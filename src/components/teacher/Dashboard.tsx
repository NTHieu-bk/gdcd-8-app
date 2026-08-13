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
  const [gradingProductId, setGradingProductId] = useState<number | string | null>(null);
  const [teacherScoreInput, setTeacherScoreInput] = useState('');
  const [teacherCommentInput, setTeacherCommentInput] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | number | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(new Set());
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const savedTab = localStorage.getItem('teacherActiveTab');
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    localStorage.setItem('teacherActiveTab', tab);
  };

  // Fetch real data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      if (!isSupabaseConfigured()) {
        // Fallback to mock data if not configured
        setProducts([
          { id: 1, student_name: 'Nguyễn Văn A', class_name: '8A1', product_name: 'Trang phục Kimono', country: 'Nhật Bản', ai_score: 8.5, teacher_score: null, teacher_comment: null, status: 'pending' },
          { id: 2, student_name: 'Lê Văn C', class_name: '8A2', product_name: 'Văn hóa Ẩm thực Nga', country: 'Nga', ai_score: 9.0, teacher_score: 9.5, teacher_comment: 'Bài làm xuất sắc, nội dung rất chi tiết!', status: 'graded' },
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

  // Handle grade product
  const handleGrade = async (id: string | number) => {
    const score = parseFloat(teacherScoreInput);
    if (isNaN(score) || score < 0 || score > 10) {
      alert("Vui lòng nhập điểm hợp lệ từ 0 đến 10");
      return;
    }
    
    if (isSupabaseConfigured()) {
      await supabase.from('products').update({ teacher_score: score, teacher_comment: teacherCommentInput, status: 'graded' }).eq('id', id);
    }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, teacher_score: score, teacher_comment: teacherCommentInput, status: 'graded' } : p));
    setGradingProductId(null);
    setTeacherScoreInput('');
    setTeacherCommentInput('');
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
      const isSyncComment = c.content.startsWith('[PROGRESS_SYNC]');
      const key = `${c.student_name}-${c.class_name}`;
      if (!studentMap.has(key)) {
        studentMap.set(key, { 
          id: key, 
          name: c.student_name, 
          class: c.class_name, 
          productCount: 0, 
          commentCount: 0,
          ai_score_avg: 0,
          total_score: 0,
          game_score: 0,
          sgk_score: 0,
          has_sync: false
        });
      }
      
      const student = studentMap.get(key);
      if (isSyncComment) {
        if (!student.has_sync) { // use latest since sorted by desc
          try {
            const data = JSON.parse(c.content.replace('[PROGRESS_SYNC]', ''));
            student.game_score = data.game || 0;
            student.sgk_score = data.sgk || 0;
            student.has_sync = true;
          } catch(e) {}
        }
      } else {
        student.commentCount += 1;
      }
    });

    // Calculate final progress based on actual activity and synced data
    return Array.from(studentMap.values()).map(s => {
      const exchangeProgress = s.commentCount > 0 ? 100 : 0;
      const productProgress = s.productCount > 0 ? 100 : 0;
      
      // Use synced data if available, otherwise fallback to estimation
      const gameProgress = s.has_sync ? s.game_score : (s.productCount > 0 ? s.ai_score_avg : (s.commentCount > 0 ? 50 : 0));
      const sgkProgress = s.has_sync ? s.sgk_score : (s.productCount > 0 ? s.ai_score_avg : (s.commentCount > 0 ? 50 : 0));
      
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

  const displayComments = comments.filter(c => !c.content.startsWith('[PROGRESS_SYNC]'));
  const realComments = displayComments.filter(c => !c.content.startsWith('[REPLY:'));
  const replies = displayComments.filter(c => c.content.startsWith('[REPLY:'));
  
  const replyMap = new Map();
  replies.forEach(r => {
    const match = r.content.match(/^\[REPLY:(.+?)\](.*)$/);
    if (match) {
      const parentId = match[1];
      if (!replyMap.has(parentId)) {
        replyMap.set(parentId, {
          id: r.id,
          content: match[2].trim(),
          created_at: r.created_at
        });
      }
    }
  });

  const finalCommentsList = realComments.map(c => ({
    ...c,
    teacherReply: replyMap.get(c.id.toString())
  }));

  const handleReplySubmit = async (commentId: string | number) => {
    if (!replyInput.trim() || !isSupabaseConfigured()) return;
    
    const content = `[REPLY:${commentId}] ${replyInput}`;
    
    const { data } = await supabase.from('comments').insert({
      student_name: 'Giáo viên',
      class_name: 'Quản trị',
      content,
      pinned: false
    }).select();
    
    if (data && data.length > 0) {
      setComments(prev => [data[0], ...prev]);
    } else {
      // fallback optimistic update
      setComments(prev => [{
        id: Date.now(),
        student_name: 'Giáo viên',
        class_name: 'Quản trị',
        content,
        created_at: new Date().toISOString(),
        pinned: false
      }, ...prev]);
    }
    
    setReplyingToId(null);
    setReplyInput('');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-display text-kinpaku-gold mb-6">📊 TỔNG QUAN HỌC TẬP</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-raised-lacquer border-gold-hairline"><CardContent className="p-6 pt-6 flex flex-col items-center justify-center text-center"><div className="text-3xl mb-2">👨‍🎓</div><div className="text-2xl font-bold text-champagne">120</div><div className="text-text-muted">Tổng học sinh</div></CardContent></Card>
              <Card className="bg-raised-lacquer border-gold-hairline"><CardContent className="p-6 pt-6 flex flex-col items-center justify-center text-center"><div className="text-3xl mb-2">🎨</div><div className="text-2xl font-bold text-champagne">{products.length}</div><div className="text-text-muted">Sản phẩm đã nộp</div></CardContent></Card>
              <Card className="bg-raised-lacquer border-gold-hairline"><CardContent className="p-6 pt-6 flex flex-col items-center justify-center text-center"><div className="text-3xl mb-2">📝</div><div className="text-2xl font-bold text-vermilion-warning">{products.filter(p => p.status === 'pending').length}</div><div className="text-text-muted">Cần chấm điểm</div></CardContent></Card>
              <Card className="bg-raised-lacquer border-gold-hairline"><CardContent className="p-6 pt-6 flex flex-col items-center justify-center text-center"><div className="text-3xl mb-2">💬</div><div className="text-2xl font-bold text-emerald-400">{finalCommentsList.length}</div><div className="text-text-muted">Bình luận</div></CardContent></Card>
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
              <div className="text-kinpaku-gold animate-pulse text-center p-10 min-h-[800px] flex items-center justify-center text-xl">Đang tải dữ liệu...</div>
            ) : products.length === 0 ? (
              <div className="text-text-faint text-center p-10 bg-raised-lacquer border border-dashed border-gold-hairline/30 rounded-lg">Chưa có sản phẩm nào được nộp.</div>
            ) : (
              <div className="space-y-4">
                {/* Delete Confirmation Modal */}
                {(deletingProductId || deletingBulk) && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-raised-lacquer border border-vermilion-warning/50 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl animate-fade-in-up">
                      <div className="text-center">
                        <div className="text-5xl mb-4">⚠️</div>
                        <h3 className="text-xl font-bold text-champagne mb-3">Xác nhận xóa</h3>
                        <p className="text-text-muted mb-6">
                          {deletingBulk 
                            ? `Bạn có chắc chắn muốn xóa ${selectedProductIds.size} bài nộp đã chọn? Hành động này không thể hoàn tác.`
                            : `Xóa bài nộp "${products.find(p => p.id === deletingProductId)?.product_name}" của ${products.find(p => p.id === deletingProductId)?.student_name}?`
                          }
                        </p>
                        <div className="flex gap-3 justify-center">
                          <Button
                            variant="secondary"
                            onClick={() => { setDeletingProductId(null); setDeletingBulk(false); }}
                            disabled={isDeleting}
                          >
                            Hủy bỏ
                          </Button>
                          <Button
                            className="!bg-vermilion-warning !text-white hover:!bg-red-600"
                            disabled={isDeleting}
                            onClick={async () => {
                              setIsDeleting(true);
                              try {
                                if (deletingBulk) {
                                  const ids = Array.from(selectedProductIds);
                                  const { error } = await supabase.from('products').delete().in('id', ids);
                                  if (error) { alert('Lỗi xóa: ' + error.message); setIsDeleting(false); return; }
                                  setProducts(prev => prev.filter(p => !selectedProductIds.has(p.id)));
                                  setSelectedProductIds(new Set());
                                } else if (deletingProductId) {
                                  const { error } = await supabase.from('products').delete().eq('id', deletingProductId);
                                  if (error) { alert('Lỗi xóa: ' + error.message); setIsDeleting(false); return; }
                                  setProducts(prev => prev.filter(p => p.id !== deletingProductId));
                                  setSelectedProductIds(prev => { const s = new Set(prev); s.delete(deletingProductId); return s; });
                                }
                              } catch (err: any) {
                                alert('Lỗi: ' + (err?.message || 'Không thể xóa'));
                              }
                              setIsDeleting(false);
                              setDeletingProductId(null);
                              setDeletingBulk(false);
                            }}
                          >
                            {isDeleting ? 'Đang xóa...' : '🗑️ Xóa vĩnh viễn'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bulk actions bar */}
                <div className="flex items-center justify-between bg-raised-lacquer border border-gold-hairline rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer text-sm text-champagne">
                      <input
                        type="checkbox"
                        className="w-4 h-4 accent-kinpaku-gold cursor-pointer"
                        checked={selectedProductIds.size === products.length && products.length > 0}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedProductIds(new Set(products.map(p => p.id)));
                          } else {
                            setSelectedProductIds(new Set());
                          }
                        }}
                      />
                      Chọn tất cả ({selectedProductIds.size}/{products.length})
                    </label>
                  </div>
                  {selectedProductIds.size > 0 && (
                    <Button
                      variant="secondary"
                      className="!text-vermilion-warning !border-vermilion-warning/50 hover:!bg-vermilion-warning/10"
                      onClick={() => setDeletingBulk(true)}
                    >
                      🗑️ Xóa {selectedProductIds.size} bài đã chọn
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-6">
                {products.map(product => (
                  <Card key={product.id} className={`bg-raised-lacquer ${selectedProductIds.has(product.id) ? 'border-kinpaku-gold' : 'border-gold-hairline'}`}>
                    <div className="p-6 flex flex-col md:flex-row gap-6 items-start">
                      {/* Checkbox */}
                      <div className="flex items-start pt-1">
                        <input
                          type="checkbox"
                          className="w-5 h-5 accent-kinpaku-gold cursor-pointer"
                          checked={selectedProductIds.has(product.id)}
                          onChange={(e) => {
                            const newSet = new Set(selectedProductIds);
                            if (e.target.checked) { newSet.add(product.id); } else { newSet.delete(product.id); }
                            setSelectedProductIds(newSet);
                          }}
                        />
                      </div>
                      <div className="w-24 h-24 bg-lacquer-black rounded flex items-center justify-center text-3xl border border-gold-hairline-strong overflow-hidden flex-shrink-0 relative group mt-1">
                        {product.file_url && (product.file_name?.toLowerCase().endsWith('.png') || product.file_name?.toLowerCase().endsWith('.jpg') || product.file_name?.toLowerCase().endsWith('.jpeg') || product.file_name?.toLowerCase().endsWith('.gif') || product.file_name?.toLowerCase().endsWith('.webp')) ? (
                          <div onClick={() => setSelectedProduct(product)} className="block w-full h-full cursor-pointer relative">
                            <img src={product.file_url} alt={product.product_name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                            <div className="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center transition-colors">
                              <span className="opacity-0 hover:opacity-100 text-white text-xs font-medium">🔍 Mở</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-lacquer-deep transition-colors" onClick={() => product.file_url && setSelectedProduct(product)}>
                            {product.file_name?.endsWith('.pdf') ? '📄' : product.file_name?.endsWith('.mp4') ? '🎥' : product.file_name?.endsWith('.docx') ? '📝' : '🖼️'}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-xl font-bold text-champagne flex items-center">
                            {product.product_name}
                            {product.file_url && (
                              <button onClick={() => setSelectedProduct(product)} className="text-xs ml-3 px-2 py-1 bg-kinpaku-gold text-lacquer-black rounded font-bold hover:bg-champagne inline-block">
                                Xem file
                              </button>
                            )}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${product.status === 'graded' ? 'bg-kinpaku-gold text-lacquer-black border-gold-hairline' : 'bg-lacquer-deep text-text-faint border-gold-hairline-strong'}`}>
                            {product.status === 'graded' ? 'Đã chấm' : 'Chờ chấm'}
                          </span>
                        </div>
                        <p className="text-sm text-text-muted mb-2">Học sinh: {product.student_name} - Lớp: {product.class_name} | Chủ đề: {product.country}</p>
                        
                        {product.description && (
                          <div className="bg-lacquer-deep/50 p-3 rounded border border-gold-hairline-strong mb-4 text-sm text-text-warm italic line-clamp-3">
                            "{product.description}"
                          </div>
                        )}
                        
                        <div className="flex flex-col gap-4 w-full">
                          <div className="flex flex-wrap gap-4 items-center">
                            <div className="bg-lacquer-black px-4 py-2 rounded border border-gold-hairline-strong flex items-center gap-2">
                              <span className="text-lg">🤖</span>
                              <div>
                                <p className="text-[10px] text-text-faint uppercase">AI Tham khảo</p>
                                <p className="font-bold text-kinpaku-gold">{product.ai_score}/10</p>
                              </div>
                            </div>
                            
                            {!gradingProductId && product.teacher_score && (
                              <div className="bg-kinpaku-gold/10 px-4 py-2 rounded border border-kinpaku-gold/30 flex items-center gap-3 flex-1 min-w-[250px]">
                                <span className="text-2xl">👩‍🏫</span>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <p className="text-[10px] text-kinpaku-gold uppercase font-bold tracking-wider">Điểm Giáo viên:</p>
                                    <p className="font-bold text-champagne">{product.teacher_score}/10</p>
                                  </div>
                                  {product.teacher_comment && (
                                    <p className="text-xs text-champagne/80 italic mt-0.5 break-words">"{product.teacher_comment}"</p>
                                  )}
                                </div>
                              </div>
                            )}
                            
                            {gradingProductId !== product.id && (
                              <div className="ml-auto flex gap-2">
                                <Button 
                                  onClick={() => { setGradingProductId(product.id); setTeacherScoreInput(product.teacher_score?.toString() || ''); setTeacherCommentInput(product.teacher_comment || ''); }} 
                                >
                                  👩‍🏫 CHẤM SẢN PHẨM
                                </Button>
                                <Button
                                  variant="secondary"
                                  onClick={() => setDeletingProductId(product.id)}
                                  className="!text-vermilion-warning !border-vermilion-warning/50 hover:!bg-vermilion-warning/10"
                                >
                                  🗑️ Xóa bài
                                </Button>
                              </div>
                            )}
                          </div>

                          {gradingProductId === product.id && (
                            <div className="bg-lacquer-deep p-4 rounded-lg border border-gold-hairline w-full flex flex-col gap-3 animate-fade-in-up">
                              <p className="text-sm font-bold text-champagne">👩‍🏫 Đánh giá của giáo viên</p>
                              <div className="flex flex-col md:flex-row gap-3">
                                <input 
                                  type="number" 
                                  min="0" max="10" step="0.5"
                                  className="bg-lacquer-black border border-gold-hairline text-champagne px-3 py-2 rounded w-full md:w-24 outline-none focus:border-kinpaku-gold"
                                  placeholder="Điểm"
                                  value={teacherScoreInput}
                                  onChange={(e) => setTeacherScoreInput(e.target.value)}
                                  autoFocus
                                />
                                <input 
                                  type="text"
                                  className="bg-lacquer-black border border-gold-hairline text-champagne px-3 py-2 rounded flex-1 outline-none focus:border-kinpaku-gold"
                                  placeholder="Nhập nhận xét cho học sinh..."
                                  value={teacherCommentInput}
                                  onChange={(e) => setTeacherCommentInput(e.target.value)}
                                />
                                <div className="flex gap-2">
                                  <Button onClick={() => handleGrade(product.id)} className="bg-emerald-600 hover:bg-emerald-500 whitespace-nowrap flex-1">LƯU ĐIỂM</Button>
                                  <Button onClick={() => setGradingProductId(null)} variant="secondary" className="whitespace-nowrap flex-1">HỦY</Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              </div>
            )}
          </div>
        );

      case 'comments':
        return (
          <div className="space-y-6 animate-fade-in-up">
            <h2 className="text-2xl font-display text-kinpaku-gold mb-6">💬 QUẢN LÝ BÌNH LUẬN</h2>
            {isLoading ? (
              <div className="text-kinpaku-gold animate-pulse text-center p-10 min-h-[800px] flex items-center justify-center text-xl">Đang tải dữ liệu...</div>
            ) : finalCommentsList.length === 0 ? (
              <div className="text-text-faint text-center p-10 bg-raised-lacquer border border-dashed border-gold-hairline/30 rounded-lg">Chưa có bình luận nào.</div>
            ) : (
              <div className="space-y-4">
                {finalCommentsList.map(comment => {
                  const date = new Date(comment.created_at);
                  return (
                    <Card key={comment.id} className={`bg-raised-lacquer border ${comment.pinned ? 'border-kinpaku-gold shadow-[0_0_15px_rgba(212,175,55,0.15)]' : 'border-gold-hairline'}`}>
                      <CardContent className="!p-8 flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-4 flex-wrap">
                            <span className="font-bold text-champagne">{comment.student_name}</span>
                            <span className="text-xs px-3 py-1 bg-lacquer-black rounded text-text-muted border border-gold-hairline-strong font-medium">{comment.class_name}</span>
                            <span className="text-xs text-text-faint ml-2">{date.toLocaleDateString('vi-VN')} {date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>
                            {comment.pinned && <span className="text-xs bg-kinpaku-gold text-lacquer-black px-2 py-0.5 rounded ml-2 font-bold flex items-center gap-1">📌 Đã ghim</span>}
                          </div>
                          <p className="text-text-warm leading-relaxed pb-2 min-h-[28px]">{comment.content}</p>
                          
                          {/* Display Teacher Reply */}
                          {comment.teacherReply && (
                            <div className="mt-4">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">👩‍🏫</span>
                                <span className="font-bold text-kinpaku-gold text-sm uppercase tracking-wider">Giáo viên trả lời:</span>
                              </div>
                              <div className="w-full p-4 min-h-[100px] bg-lacquer-black border border-gold-hairline rounded-lg text-champagne/90 text-base leading-relaxed whitespace-pre-wrap text-left shadow-inner">
                                {comment.teacherReply.content}
                              </div>
                            </div>
                          )}

                          {/* Reply Input Form */}
                          {replyingToId === comment.id && !comment.teacherReply && (
                            <div className="mt-4 animate-fade-in-up">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-lg">👩‍🏫</span>
                                <span className="font-bold text-kinpaku-gold text-sm uppercase tracking-wider">Giáo viên trả lời:</span>
                              </div>
                              <textarea 
                                value={replyInput}
                                onChange={e => setReplyInput(e.target.value)}
                                placeholder="Nhập câu trả lời của giáo viên..."
                                className="w-full p-4 bg-lacquer-black border border-gold-hairline rounded-lg text-champagne text-base focus:outline-none focus:border-kinpaku-gold text-left resize-none leading-relaxed mb-3 shadow-inner"
                                rows={4}
                                autoFocus
                              />
                              <div className="flex gap-3 justify-end">
                                <Button size="sm" onClick={() => handleReplySubmit(comment.id)} className="bg-kinpaku-gold text-lacquer-black hover:bg-champagne font-bold px-6">GỬI</Button>
                                <Button size="sm" variant="secondary" onClick={() => setReplyingToId(null)} className="px-4">HỦY</Button>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-row md:flex-col gap-2 mt-4 md:mt-0 items-start">
                          {!comment.teacherReply && (
                            <Button 
                              onClick={() => setReplyingToId(comment.id)} 
                              variant="secondary" size="sm" className="text-kinpaku-gold border-kinpaku-gold/50"
                            >
                              💬 Trả lời
                            </Button>
                          )}
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

  const renderModalContent = (product: any) => {
    if (!product.file_url) return <div className="text-white">Không có file đính kèm</div>;
    const lowerName = product.file_name?.toLowerCase() || '';
    if (lowerName.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
      return <img src={product.file_url} alt={product.product_name} className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl" />;
    } else if (lowerName.endsWith('.mp4')) {
      return <video src={product.file_url} controls className="max-w-full max-h-[85vh] rounded shadow-2xl" />;
    } else if (lowerName.endsWith('.pdf')) {
      return <iframe src={product.file_url} className="w-full h-[85vh] bg-white rounded shadow-2xl" />;
    } else {
      return (
        <div className="bg-raised-lacquer border border-gold-hairline p-10 rounded text-center shadow-2xl">
          <div className="text-7xl mb-6">📄</div>
          <h3 className="text-kinpaku-gold text-2xl mb-6 truncate max-w-lg mx-auto px-4">{product.file_name}</h3>
          <a href={product.file_url} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-kinpaku-gold text-lacquer-black font-bold rounded hover:bg-champagne transition-colors">Tải xuống / Mở file</a>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-lacquer-black flex flex-col md:flex-row relative">
      {/* Media Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity" onClick={() => setSelectedProduct(null)}>
          <div className="relative w-full max-w-5xl flex flex-col items-center justify-center animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white/70 hover:text-kinpaku-gold text-4xl transition-colors w-12 h-12 flex items-center justify-center bg-black/50 rounded-full" 
              onClick={() => setSelectedProduct(null)}
            >
              ×
            </button>
            {renderModalContent(selectedProduct)}
            <div className="mt-4 text-center">
              <h3 className="text-xl text-champagne font-bold">{selectedProduct.product_name}</h3>
              <p className="text-sm text-kinpaku-gold">Bởi: {selectedProduct.student_name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-lacquer-deep border-r border-gold-hairline flex flex-col">
        <div className="p-6 border-b border-gold-hairline">
          <h1 className="text-xl font-display font-bold text-kinpaku-gold tracking-widest uppercase">
            Cổng Giáo Viên
          </h1>
          <p className="text-sm text-champagne mt-2">Cô Nguyễn Thị Thanh Thủy</p>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <button onClick={() => handleTabChange('overview')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'overview' ? 'bg-kinpaku-gold text-lacquer-black font-bold' : 'text-text-warm hover:bg-raised-lacquer'}`}>
            <span className="text-xl">📊</span> Tổng quan
          </button>
          <button onClick={() => handleTabChange('progress')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'progress' ? 'bg-kinpaku-gold text-lacquer-black font-bold' : 'text-text-warm hover:bg-raised-lacquer'}`}>
            <span className="text-xl">📈</span> Tiến trình
          </button>
          <button onClick={() => handleTabChange('grading')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'grading' ? 'bg-kinpaku-gold text-lacquer-black font-bold' : 'text-text-warm hover:bg-raised-lacquer'}`}>
            <span className="text-xl">📝</span> Chấm điểm
          </button>
          <button onClick={() => handleTabChange('comments')} className={`w-full text-left px-4 py-3 rounded flex items-center gap-3 transition-colors ${activeTab === 'comments' ? 'bg-kinpaku-gold text-lacquer-black font-bold' : 'text-text-warm hover:bg-raised-lacquer'}`}>
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
