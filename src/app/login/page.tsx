"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LoginPage() {
  const router = useRouter();
  const [view, setView] = useState<'main' | 'login' | 'register'>('main');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [className, setClassName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If already logged in, redirect to home
    if (localStorage.getItem('studentLoggedIn') === 'true') {
      router.push('/');
    }
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();

      if (error || !data) {
        setError('Tài khoản hoặc mật khẩu không chính xác.');
      } else {
        localStorage.setItem('studentLoggedIn', 'true');
        localStorage.setItem('studentData', JSON.stringify({
          id: data.id,
          username: data.username,
          full_name: data.full_name,
          class_name: data.class_name
        }));
        router.push('/');
      }
    } else {
      // Mock login
      if (username === 'hs1' && password === '123') {
        localStorage.setItem('studentLoggedIn', 'true');
        localStorage.setItem('studentData', JSON.stringify({
          id: 'mock-1',
          username: 'hs1',
          full_name: 'Nguyễn Văn Mock',
          class_name: '8A1'
        }));
        router.push('/');
      } else {
        setError('Database chưa được kết nối. Dùng hs1/123 để test.');
      }
    }
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (isSupabaseConfigured()) {
      // Check if username exists
      const { data: existing } = await supabase
        .from('students')
        .select('username')
        .eq('username', username)
        .single();
        
      if (existing) {
        setError('Tên đăng nhập đã tồn tại!');
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('students')
        .insert([
          { username, password, full_name: fullName, class_name: className }
        ])
        .select()
        .single();

      if (error) {
        setError('Lỗi khi đăng ký. Vui lòng thử lại.');
      } else if (data) {
        localStorage.setItem('studentLoggedIn', 'true');
        localStorage.setItem('studentData', JSON.stringify({
          id: data.id,
          username: data.username,
          full_name: data.full_name,
          class_name: data.class_name
        }));
        router.push('/');
      }
    } else {
      setError('Database chưa được kết nối.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-lacquer-black flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md border-gold-hairline-strong bg-lacquer-deep shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-fade-in-up overflow-hidden">
        <div className="h-2 w-full bg-kinpaku-gold"></div>
        <div className="p-8">
          {view === 'main' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-medium text-kinpaku-gold mb-2 uppercase tracking-wider">
                  Cổng Truy Cập
                </h1>
                <p className="text-text-muted">Chọn hệ thống bạn muốn đăng nhập</p>
              </div>
              <div className="space-y-4">
                <Button 
                  variant="secondary"
                  onClick={() => setView('login')}
                  className="w-full py-6 flex items-center justify-center gap-2 text-[15px]"
                >
                  <span className="text-xl">🎓</span> Tài khoản Học sinh
                </Button>
                <Button 
                  variant="secondary"
                  onClick={() => router.push('/teacher')}
                  className="w-full py-6 flex items-center justify-center gap-2 text-[15px]"
                >
                  <span className="text-xl">👩‍🏫</span> Tài khoản Giáo viên
                </Button>
              </div>
            </>
          )}

          {view === 'login' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-display font-medium text-kinpaku-gold mb-2 uppercase tracking-wider">
                  Cổng Học Sinh
                </h1>
                <p className="text-text-muted">Đăng nhập để tham gia hành trình học tập</p>
              </div>
              <form onSubmit={handleLogin} className="space-y-6">
                {error && <div className="p-3 bg-vermilion-warning/10 text-vermilion-warning text-sm rounded border border-vermilion-warning/30 flex items-center gap-2"><span>⚠️</span> {error}</div>}
                <div>
                  <label className="block text-sm text-champagne mb-2">Tên đăng nhập</label>
                  <Input value={username} onChange={e => setUsername(e.target.value)} className={error ? "border-vermilion-warning focus-visible:ring-vermilion-warning" : ""} required />
                </div>
                <div>
                  <label className="block text-sm text-champagne mb-2">Mật khẩu</label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} className={error ? "border-vermilion-warning focus-visible:ring-vermilion-warning" : ""} required />
                </div>
                <Button type="submit" variant="primary" className="w-full py-6 font-bold tracking-widest text-lg" disabled={isLoading}>
                  {isLoading ? 'ĐANG XỬ LÝ...' : 'ĐĂNG NHẬP'}
                </Button>
                
                <div className="text-center mt-4">
                  <span className="text-sm text-text-muted">Chưa có tài khoản? </span>
                  <button type="button" onClick={() => { setView('register'); setError(''); }} className="text-sm text-kinpaku-gold hover:underline font-medium">
                    Đăng ký ngay
                  </button>
                </div>
                
                <div className="text-center mt-6">
                  <button type="button" onClick={() => setView('main')} className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">
                    ← Quay lại
                  </button>
                </div>
              </form>
            </>
          )}

          {view === 'register' && (
            <>
              <div className="text-center mb-8">
                <h1 className="text-2xl font-display font-medium text-kinpaku-gold mb-2 uppercase tracking-wider">
                  Đăng Ký Tài Khoản
                </h1>
              </div>
              <form onSubmit={handleRegister} className="space-y-5">
                {error && <div className="p-3 bg-vermilion-warning/10 text-vermilion-warning text-sm rounded border border-vermilion-warning/30 flex items-center gap-2"><span>⚠️</span> {error}</div>}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-champagne mb-1">Họ và tên thật *</label>
                    <Input value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>
                  <div>
                    <label className="block text-sm text-champagne mb-1">Lớp *</label>
                    <Input value={className} onChange={e => setClassName(e.target.value)} required />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-champagne mb-1">Tên đăng nhập (viết liền không dấu) *</label>
                  <Input value={username} onChange={e => setUsername(e.target.value.replace(/\s+/g, '').toLowerCase())} required />
                </div>
                
                <div>
                  <label className="block text-sm text-champagne mb-1">Mật khẩu *</label>
                  <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
                
                <Button type="submit" variant="primary" className="w-full py-6 font-bold tracking-widest text-lg" disabled={isLoading}>
                  {isLoading ? 'ĐANG XỬ LÝ...' : 'TẠO TÀI KHOẢN'}
                </Button>
                
                <div className="text-center mt-6">
                  <button type="button" onClick={() => { setView('login'); setError(''); }} className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">
                    ← Đã có tài khoản? Đăng nhập
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
