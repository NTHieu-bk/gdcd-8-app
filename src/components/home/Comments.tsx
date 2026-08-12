"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface Comment {
  id: string;
  name: string;
  className: string;
  content: string;
  date: string;
  time: string;
}

export function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [content, setContent] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      if (!isSupabaseConfigured()) return;
      
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (data) {
        const formatted = data.map(item => {
          const date = new Date(item.created_at);
          return {
            id: item.id,
            name: item.student_name,
            className: item.class_name,
            content: item.content,
            date: date.toLocaleDateString('vi-VN'),
            time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
          };
        });
        setComments(formatted);
      }
    };
    
    fetchComments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !className || !content) return;

    const now = new Date();
    
    if (isSupabaseConfigured()) {
      setSubmitError(null);
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          student_name: name,
          class_name: className,
          content: content
        }])
        .select();
        
      if (error) {
        console.error("Lỗi gửi bình luận:", error);
        setSubmitError("Lỗi kết nối CSDL: Vui lòng kiểm tra lại cấu hình Supabase (.env.local) hoặc thử lại sau.");
        return;
      }

      if (data && data.length > 0) {
        const item = data[0];
        const date = new Date(item.created_at);
        const newComment: Comment = {
          id: item.id,
          name: item.student_name,
          className: item.class_name,
          content: item.content,
          date: date.toLocaleDateString('vi-VN'),
          time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        setComments(prev => [newComment, ...prev]);
      }
    } else {
      const newComment: Comment = {
        id: Date.now().toString(),
        name,
        className,
        content,
        date: now.toLocaleDateString('vi-VN'),
        time: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
      };
      setComments(prev => [newComment, ...prev]);
    }
    
    // Reset form
    setName('');
    setClassName('');
    setContent('');
  };

  return (
    <section id="discussion" className="py-16 bg-lacquer-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-4 flex justify-center items-center gap-3 uppercase tracking-wider">
            <span className="text-4xl">💬</span> TRAO ĐỔI & GÓP Ý
          </h2>
          <p className="text-text-muted">Cùng thảo luận và chia sẻ góc nhìn của em về bài học.</p>
        </div>

        <Card className="border-gold-hairline bg-raised-lacquer mb-10 shadow-lg">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-kinpaku-gold mb-1">Họ và tên *</label>
                  <Input 
                    value={name} 
                    onChange={e => setName(e.target.value)} 
                    placeholder="VD: Nguyễn Văn A"
                    required 
                  />
                </div>
                <div className="md:col-span-1">
                  <label className="block text-sm text-kinpaku-gold mb-1">Lớp *</label>
                  <Input 
                    value={className} 
                    onChange={e => setClassName(e.target.value)} 
                    placeholder="VD: 8A1"
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-kinpaku-gold mb-1">Nội dung *</label>
                <textarea 
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Nhập nội dung trao đổi, thắc mắc hoặc ý kiến của em..."
                  className="w-full bg-lacquer-black border border-gold-hairline rounded-md px-4 py-3 text-text-warm focus:outline-none focus:border-kinpaku-gold"
                  rows={4}
                  required
                />
              </div>
              
              {submitError && (
                <div className="text-vermilion-warning text-sm bg-vermilion-warning/10 border border-vermilion-warning/30 p-3 rounded">
                  ⚠️ {submitError}
                </div>
              )}
              
              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" className="px-8 font-bold tracking-widest">
                  💬 GỬI BÌNH LUẬN
                </Button>
              </div>
            </form>
          </div>
        </Card>

        {/* Comments List */}
        <div className="space-y-6">
          <h3 className="text-xl font-display text-champagne border-b border-gold-hairline-strong pb-4">
            Bình luận gần đây ({comments.length})
          </h3>
          
          {comments.length === 0 ? (
            <div className="text-center py-10 text-text-faint italic border border-dashed border-gold-hairline/30 rounded-lg">
              Chưa có bình luận nào. Hãy là người đầu tiên tham gia thảo luận!
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <Card key={comment.id} className="border-gold-hairline bg-lacquer-deep animate-fade-in-up">
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-kinpaku-gold/20 flex items-center justify-center text-kinpaku-gold font-bold border border-kinpaku-gold/30">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="font-bold text-champagne">{comment.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-lacquer-black border border-gold-hairline-strong text-kinpaku-gold">
                              {comment.className}
                            </span>
                          </div>
                          <div className="text-xs text-text-faint flex items-center gap-2 mt-0.5">
                            <span>📅 {comment.date}</span>
                            <span>⏰ {comment.time}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-text-warm leading-relaxed pl-13">
                      {comment.content}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Link Goppy */}
        <div id="feedback" className="mt-16 border-t border-gold-hairline pt-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-display text-kinpaku-gold mb-2 uppercase tracking-wider">
              📝 ĐÓNG GÓP Ý KIẾN
            </h3>
            <p className="text-text-muted">Em có góp ý để website tốt hơn? Vui lòng điền vào phiếu khảo sát dưới đây.</p>
          </div>
          
          <div className="bg-lacquer-black p-2 rounded-xl border border-gold-hairline shadow-lg overflow-hidden h-[600px] w-full">
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLSdF0eC_0JflPwOJIEc6hA4aeSzoyaZkJnQIKEREApUHLdAIww/viewform?embedded=true" 
              width="100%" 
              height="100%" 
              frameBorder="0" 
              marginHeight={0} 
              marginWidth={0}
              className="bg-white rounded-lg"
            >
              Đang tải biểu mẫu...
            </iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
