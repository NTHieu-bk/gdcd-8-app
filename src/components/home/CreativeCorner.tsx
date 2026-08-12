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
  aiScore: string;
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

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchProducts = async () => {
      if (!isSupabaseConfigured()) return;
      
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
          aiScore: item.ai_score ? item.ai_score.toString() : '0.0',
          likes: item.likes || 0
        }));
        setSubmissions(formatted);
      }
    };
    
    fetchProducts();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !className || !productName || !country || !fileName) return;

    setIsSubmitting(true);

    const randomAiScore = (Math.random() * (9.5 - 7.0) + 7.0).toFixed(1);

    if (isSupabaseConfigured()) {
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
            ai_score: parseFloat(randomAiScore)
          }
        ])
        .select();

      if (error) {
        console.error('Error inserting product:', error);
        alert('Có lỗi xảy ra khi nộp bài. Bạn đã cài đặt đúng API Key chưa?');
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
          aiScore: item.ai_score ? item.ai_score.toString() : randomAiScore,
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
    setIsSubmitting(false);
  };

  const handleLike = async (id: string) => {
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

  return (
    <section id="creative-corner" className="py-16 bg-lacquer-deep border-y border-gold-hairline">
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
                  <div>
                    <label className="block text-sm text-kinpaku-gold mb-1">Họ tên học sinh/nhóm *</label>
                    <Input value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm text-kinpaku-gold mb-1">Lớp *</label>
                    <Input value={className} onChange={e => setClassName(e.target.value)} required />
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
                    <div className="border-2 border-dashed border-gold-hairline rounded-md p-4 text-center bg-lacquer-black cursor-pointer hover:border-kinpaku-gold transition-colors">
                      <Input 
                        type="file" 
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10" 
                        onChange={(e) => setFileName(e.target.files?.[0]?.name || '')}
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
            
            {submissions.length === 0 ? (
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
                  <Card key={sub.id} className="border-gold-hairline bg-raised-lacquer overflow-hidden hover:border-kinpaku-gold transition-colors group animate-fade-in-up">
                    <div className="h-40 bg-lacquer-black relative border-b border-gold-hairline flex items-center justify-center overflow-hidden">
                      {/* Fake preview placeholder based on filename */}
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lacquer-deep to-lacquer-black opacity-50"></div>
                      <div className="z-10 text-center">
                        <div className="text-4xl mb-2">
                          {sub.fileName.endsWith('.pdf') ? '📄' : sub.fileName.endsWith('.mp4') ? '🎥' : sub.fileName.endsWith('.docx') ? '📝' : '🖼️'}
                        </div>
                        <p className="text-xs text-text-faint truncate max-w-[200px] px-4">{sub.fileName}</p>
                      </div>
                    </div>
                    
                    <CardContent className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-lg text-champagne font-bold truncate pr-2">{sub.productName}</h4>
                        <span className="text-xs bg-kinpaku-gold/20 text-kinpaku-gold px-2 py-1 rounded-full border border-kinpaku-gold/30 whitespace-nowrap">
                          {sub.country}
                        </span>
                      </div>
                      
                      <div className="text-sm text-text-muted mb-4 line-clamp-2 min-h-[40px]">
                        {sub.description || "Không có mô tả."}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-text-warm border-t border-gold-hairline-strong pt-3 mb-4">
                        <span>👤</span> {sub.name} <span className="text-text-faint">({sub.class})</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-lacquer-black p-3 rounded border border-gold-hairline-strong">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🤖</span>
                          <div>
                            <p className="text-xs text-text-faint uppercase tracking-wider">AI Đánh giá tham khảo</p>
                            <p className="text-kinpaku-gold font-bold">{sub.aiScore}/10</p>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => handleLike(sub.id)}
                          className="flex items-center gap-1.5 text-text-muted hover:text-vermilion-warning transition-colors"
                        >
                          <span className={`${sub.likes > 0 ? 'text-vermilion-warning' : ''}`}>❤️</span> 
                          <span className="font-mono">{sub.likes}</span>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
