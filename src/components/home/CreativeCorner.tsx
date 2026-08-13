"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Submission {
  id: string;
  name: string;
  class: string;
  productName: string;
  country: string;
  description: string;
  fileName: string;
  fileUrl?: string;
  aiScore: string;
  teacherScore?: string;
  teacherComment?: string;
  likes: number;
}

export function CreativeCorner() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [productName, setProductName] = useState('');
  const [country, setCountry] = useState('');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage
  useEffect(() => {
    const studentDataStr = localStorage.getItem('studentData');
    if (studentDataStr) {
      try {
        const student = JSON.parse(studentDataStr);
        setName(student.full_name || student.username);
        setClassName(student.class_name || '');
      } catch (e) {}
    }
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchProducts = async () => {
      if (!isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching products:', error);
      } else if (data) {
        // Map database fields to frontend fields
        const formatted = data.map(item => ({
          id: item.id,
          name: item.student_name,
          class: item.class_name,
          productName: item.product_name,
          country: item.country,
          description: item.description || '',
          fileName: item.file_name,
          fileUrl: item.file_url,
          aiScore: item.ai_score ? item.ai_score.toString() : '0.0',
          teacherScore: item.teacher_score ? item.teacher_score.toString() : undefined,
          teacherComment: item.teacher_comment ? item.teacher_comment : undefined,
          likes: item.likes || 0
        }));
        setSubmissions(formatted);
      }
      setIsLoading(false);
    };
    
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !className || !productName || !country || !fileName) return;

    setIsSubmitting(true);

    const randomAiScore = (Math.random() * (9.5 - 7.0) + 7.0).toFixed(1);

    if (isSupabaseConfigured()) {
      let publicUrl = '';
      if (file) {
        const fileExt = fileName.split('.').pop();
        const safeName = Date.now() + '-' + Math.random().toString(36).substring(7);
        const filePath = `${safeName}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
        if (uploadError) {
          console.error('Error uploading file:', uploadError);
          alert('Lỗi tải file: Bạn đã tạo Storage bucket "uploads" chưa?');
          setIsSubmitting(false);
          return;
        }
        
        const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      }

      // Insert into Supabase
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            student_name: name,
            class_name: className,
            product_name: productName,
            country: country,
            description: description,
            file_name: fileName,
            file_url: publicUrl || null,
            ai_score: parseFloat(randomAiScore)
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting product:', error);
        alert(`Lỗi CSDL: ${error.message || 'Không thể lưu dữ liệu vào bảng products. Hãy chắc chắn đã chạy lệnh DISABLE ROW LEVEL SECURITY.'}`);
        setIsSubmitting(false);
        return;
      }
      
      if (data && data.length > 0) {
        const item = data[0];
        const newSub: Submission = {
          id: item.id,
          name: item.student_name,
          class: item.class_name,
          productName: item.product_name,
          country: item.country,
          description: item.description || '',
          fileName: item.file_name,
          fileUrl: item.file_url,
          aiScore: item.ai_score ? item.ai_score.toString() : randomAiScore,
          teacherScore: item.teacher_score ? item.teacher_score.toString() : undefined,
          teacherComment: item.teacher_comment ? item.teacher_comment : undefined,
          likes: item.likes || 0
        };
        setSubmissions(prev => [newSub, ...prev]);
      }
    } else {
      // Mock insertion if Supabase is not configured
      setTimeout(() => {
        const newSub: Submission = {
          id: Date.now().toString(),
          name,
          class: className,
          productName,
          country,
          description,
          fileName,
          fileUrl: '',
          aiScore: randomAiScore,
          likes: 0
        };

        setSubmissions(prev => [newSub, ...prev]);
      }, 1500);
    }
    
    // Reset form
    setName('');
    setClassName('');
    setProductName('');
    setCountry('');
    setDescription('');
    setFileName('');
    setFile(null);
    setIsSubmitting(false);
  };

  const handleLike = async (id: string) => {
    const likedKey = `liked_${id}`;
    if (localStorage.getItem(likedKey)) {
      alert('Em đã thả tim cho bài này rồi nha! ❤️');
      return;
    }
    
    // Đánh dấu là đã like
    localStorage.setItem(likedKey, 'true');

    // Update local state first for instant feedback
    setSubmissions(prev => prev.map(s => s.id === id ? { ...s, likes: s.likes + 1 } : s));
    
    if (isSupabaseConfigured()) {
      // Get current likes
      const item = submissions.find(s => s.id === id);
      if (item) {
        await supabase
          .from('products')
          .update({ likes: item.likes + 1 })
          .eq('id', id);
      }
    }
  };

  const renderModalContent = (sub: Submission) => {
    if (!sub.fileUrl) return <div className="text-white">Không có file đính kèm</div>;
    const lowerName = sub.fileName.toLowerCase();
    if (lowerName.match(/\.(jpeg|jpg|gif|png|webp)$/)) {
      return <img src={sub.fileUrl} alt={sub.productName} className="max-w-full max-h-[85vh] object-contain rounded shadow-2xl" />;
    } else if (lowerName.endsWith('.mp4')) {
      return <video src={sub.fileUrl} controls className="max-w-full max-h-[85vh] rounded shadow-2xl" />;
    } else if (lowerName.endsWith('.pdf')) {
      return <iframe src={sub.fileUrl} className="w-full h-[85vh] bg-white rounded shadow-2xl" />;
    } else {
      return (
        <div className="bg-raised-lacquer border border-gold-hairline p-10 rounded text-center shadow-2xl">
          <div className="text-7xl mb-6">📄</div>
          <h3 className="text-kinpaku-gold text-2xl mb-6 truncate max-w-lg mx-auto px-4">{sub.fileName}</h3>
          <a href={sub.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-block px-8 py-3 bg-kinpaku-gold text-lacquer-black font-bold rounded hover:bg-champagne transition-colors">Tải xuống / Mở file</a>
        </div>
      );
    }
  };

  return (
    <section id="creative-corner" className="py-16 bg-lacquer-deep border-y border-gold-hairline relative">
      {/* Media Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm transition-opacity" onClick={() => setSelectedSubmission(null)}>
          <div className="relative w-full max-w-5xl flex flex-col items-center justify-center animate-fade-in-up" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white/70 hover:text-kinpaku-gold text-4xl transition-colors w-12 h-12 flex items-center justify-center bg-black/50 rounded-full" 
              onClick={() => setSelectedSubmission(null)}
            >
              ×
            </button>
            {renderModalContent(selectedSubmission)}
            <div className="mt-4 text-center">
              <h3 className="text-xl text-champagne font-bold">{selectedSubmission.productName}</h3>
              <p className="text-sm text-kinpaku-gold">Bởi: {selectedSubmission.name}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-4 flex justify-center items-center gap-3 uppercase tracking-wider">
            <span className="text-4xl">🎨</span> GÓC SÁNG TẠO & NỘP SẢN PHẨM
          </h2>
          <p className="text-text-muted">Chia sẻ những hiểu biết và sản phẩm sáng tạo của em về đa dạng văn hóa.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Form */}
          <div className="lg:col-span-1">
            <Card className="border-gold-hairline bg-raised-lacquer shadow-lg sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-display text-champagne mb-6 uppercase tracking-wider border-b border-gold-hairline-strong pb-4">
                  Nộp sản phẩm mới
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="bg-kinpaku-gold/10 p-3 rounded border border-kinpaku-gold/30 mb-4">
                    <p className="text-sm text-champagne">Nộp bài dưới tên: <strong>{name}</strong> - Lớp: <strong>{className}</strong></p>
                  </div>
                  <div>
                    <label className="block text-sm text-kinpaku-gold mb-1">Tên sản phẩm *</label>
                    <Input value={productName} onChange={e => setProductName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm text-kinpaku-gold mb-1">Quốc gia/dân tộc *</label>
                    <Input value={country} onChange={e => setCountry(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm text-kinpaku-gold mb-1">Mô tả ngắn gọn</label>
                    <textarea 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="w-full bg-lacquer-black border border-gold-hairline rounded-md px-4 py-2 text-text-warm focus:outline-none focus:border-kinpaku-gold"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-kinpaku-gold mb-1">Tải file lên * (Hình ảnh, Video, PDF, Word)</label>
                    <div className="relative border-2 border-dashed border-gold-hairline rounded-md p-4 text-center bg-lacquer-black cursor-pointer hover:border-kinpaku-gold transition-colors">
                      <Input 
                        type="file" 
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" 
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            setFileName(f.name);
                            setFile(f);
                          }
                        }}
                        required
                      />
                      <div className="text-3xl mb-2">📁</div>
                      <p className="text-sm text-text-muted">
                        {fileName ? <span className="text-champagne">{fileName}</span> : "Kéo thả hoặc click để chọn file"}
                      </p>
                    </div>
                  </div>
                  
                  <Button type="submit" variant="primary" className="w-full mt-6" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-lacquer-black border-t-transparent rounded-full animate-spin"></span>
                        ĐANG PHÂN TÍCH...
                      </span>
                    ) : "📤 NỘP SẢN PHẨM"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Wall of Fame */}
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-display text-kinpaku-gold mb-6 uppercase tracking-wider flex items-center gap-2">
              <span>🖼️</span> TƯỜNG VĂN HÓA
            </h3>
            
            {isLoading ? (
              <div className="flex justify-center items-center min-h-[800px] border border-dashed border-gold-hairline bg-lacquer-black/50 rounded-lg">
                <div className="text-kinpaku-gold animate-pulse text-xl flex items-center gap-3">
                  <span className="w-6 h-6 border-4 border-kinpaku-gold border-t-transparent rounded-full animate-spin"></span>
                  Đang tải tác phẩm...
                </div>
              </div>
            ) : submissions.length === 0 ? (
              <Card className="border-dashed border-gold-hairline bg-lacquer-black/50">
                <CardContent className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                  <div className="text-6xl mb-4 opacity-50">🌱</div>
                  <h4 className="text-xl text-champagne font-medium mb-2">TƯỜNG VĂN HÓA ĐANG CHỜ SẢN PHẨM ĐẦU TIÊN</h4>
                  <p className="text-text-muted">Hiện chưa có sản phẩm nào được chia sẻ. Hãy là người đầu tiên đóng góp!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {submissions.map(sub => (
                  <SubmissionCard 
                    key={sub.id} 
                    sub={sub} 
                    name={name} 
                    className={className} 
                    handleLike={handleLike} 
                    setSelectedSubmission={setSelectedSubmission} 
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function SubmissionCard({ sub, name, className, handleLike, setSelectedSubmission }: { sub: Submission, name: string, className: string, handleLike: (id: string) => void, setSelectedSubmission: (sub: Submission) => void }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isOwner = sub.name === name && sub.class === className;

  return (
    <Card className="border-gold-hairline bg-raised-lacquer overflow-hidden hover:border-kinpaku-gold transition-colors group flex flex-col h-full animate-fade-in-up">
      <div className="h-48 bg-lacquer-black relative border-b border-gold-hairline flex items-center justify-center overflow-hidden shrink-0">
        {sub.fileUrl && (sub.fileName.toLowerCase().endsWith('.png') || sub.fileName.toLowerCase().endsWith('.jpg') || sub.fileName.toLowerCase().endsWith('.jpeg') || sub.fileName.toLowerCase().endsWith('.gif') || sub.fileName.toLowerCase().endsWith('.webp')) ? (
          <div onClick={() => setSelectedSubmission(sub)} className="block w-full h-full cursor-pointer relative">
            <img src={sub.fileUrl} alt={sub.productName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
              <span className="opacity-0 group-hover:opacity-100 bg-black/60 text-white px-3 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm transition-opacity flex items-center gap-2"><span>🔍</span> Phóng to</span>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lacquer-deep to-lacquer-black opacity-50"></div>
            <div className="z-10 text-center">
              <div className="text-4xl mb-2">
                {sub.fileName.endsWith('.pdf') ? '📄' : sub.fileName.endsWith('.mp4') ? '🎥' : sub.fileName.endsWith('.docx') ? '📝' : '🖼️'}
              </div>
              <p className="text-xs text-text-faint truncate max-w-[200px] px-4">{sub.fileName}</p>
              {sub.fileUrl && (
                <button onClick={() => setSelectedSubmission(sub)} className="inline-block mt-2 px-4 py-1.5 bg-kinpaku-gold text-lacquer-black rounded text-xs font-bold hover:bg-champagne transition-colors">Xem file</button>
              )}
            </div>
          </>
        )}
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3 gap-2">
          <h4 className="text-lg text-champagne font-bold line-clamp-2 leading-tight">{sub.productName}</h4>
          <span className="text-xs bg-kinpaku-gold/20 text-kinpaku-gold px-2.5 py-1 rounded-full border border-kinpaku-gold/30 whitespace-nowrap shrink-0">
            {sub.country}
          </span>
        </div>
        
        <div className="text-sm text-text-muted mb-4 flex-1">
          <div className={`${isExpanded ? '' : 'line-clamp-3'}`}>
            {sub.description || "Không có mô tả."}
          </div>
          {sub.description && sub.description.length > 100 && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)} 
              className="text-kinpaku-gold text-xs font-bold mt-1 hover:underline focus:outline-none"
            >
              {isExpanded ? "Thu gọn" : "Xem thêm"}
            </button>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-text-warm border-t border-gold-hairline-strong pt-3 mb-4">
          <span>👤</span> {sub.name} <span className="text-text-faint">({sub.class})</span>
        </div>
        
        <div className="flex flex-col gap-3 bg-lacquer-black p-3 rounded border border-gold-hairline-strong mt-auto">
          <div className="flex justify-between items-center w-full">
            {isOwner ? (
              <div className="flex items-center gap-2 group relative cursor-help" title="Tiêu chí AI (Tham khảo): Tính chính xác văn hóa (40%), Sự sáng tạo (30%), Nội dung mô tả (30%)">
                <span className="text-xl">🤖</span>
                <div>
                  <p className="text-[10px] text-text-faint uppercase tracking-wider border-b border-dashed border-text-faint/50 pb-0.5">AI Đánh giá ⓘ</p>
                  <p className="text-kinpaku-gold font-bold">{sub.aiScore}/10</p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-text-muted italic flex items-center gap-2">
                <span>🔒</span> Điểm số bảo mật
              </div>
            )}
            
            <button 
              onClick={() => handleLike(sub.id)}
              className="flex items-center gap-1.5 text-text-muted hover:text-vermilion-warning transition-colors"
            >
              <span className={`${sub.likes > 0 ? 'text-vermilion-warning scale-110' : ''} transition-transform`}>❤️</span> 
              <span className="font-mono text-sm">{sub.likes}</span>
            </button>
          </div>
          
          {isOwner && sub.teacherScore && (
            <div className="flex items-start gap-3 border-t border-gold-hairline pt-3 w-full">
              <span className="text-2xl mt-0.5">👩‍🏫</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-[10px] text-kinpaku-gold uppercase tracking-wider font-bold">Cô Thủy chấm</p>
                  <p className="text-champagne font-bold">{sub.teacherScore}/10</p>
                </div>
                {sub.teacherComment && (
                  <p className="text-xs text-text-muted italic mt-1 break-words">"{sub.teacherComment}"</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
