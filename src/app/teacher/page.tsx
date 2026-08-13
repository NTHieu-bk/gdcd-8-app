"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Dashboard } from '@/components/teacher/Dashboard';

export default function TeacherPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedStatus = localStorage.getItem('teacherLoggedIn');
    if (storedStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use hardcoded credentials from prompt
    const normalizedUsername = username.trim().toLowerCase();
    if ((normalizedUsername === 'nguyễn thị thanh thuỷ' || normalizedUsername === 'nguyễn thị thanh thủy') && password === 'Web10CDTC') {
      setIsLoggedIn(true);
      setError(false);
      localStorage.setItem('teacherLoggedIn', 'true');
    } else {
      setError(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('teacherLoggedIn');
  };

  if (!isMounted) return null; // Prevent hydration mismatch

  if (isLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-lacquer-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-gold-hairline-strong bg-lacquer-deep shadow-[0_0_50px_rgba(212,175,55,0.15)] animate-fade-in-up">
        <div className="h-2 w-full bg-kinpaku-gold"></div>
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-medium text-kinpaku-gold mb-2 uppercase tracking-wider">
              Cổng Giáo Viên
            </h1>
            <p className="text-text-muted">Đăng nhập để quản lý học sinh và tiến trình học tập</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-champagne mb-2">Tên đăng nhập</label>
              <Input 
                id="username" 
                type="text" 
                value={username} 
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(false);
                }} 
                className={error ? "border-vermilion-warning focus-visible:ring-vermilion-warning" : ""}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm text-champagne mb-2">Mật khẩu</label>
              <Input 
                type="password"
                value={password} 
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(false);
                }} 
                className={error ? "border-vermilion-warning focus-visible:ring-vermilion-warning" : ""}
                required
              />
            </div>

            {error && (
              <div className="text-vermilion-warning text-sm bg-vermilion-warning/10 p-3 rounded border border-vermilion-warning/30 flex items-center gap-2">
                <span>⚠️</span> Tên đăng nhập hoặc mật khẩu không chính xác.
              </div>
            )}

            <Button type="submit" variant="primary" className="w-full py-6 font-bold tracking-widest text-lg">
              ĐĂNG NHẬP
            </Button>
          </form>
          
          <div className="mt-8 text-center">
            <a href="/login" className="text-sm text-text-muted hover:text-kinpaku-gold transition-colors">
              ← Quay lại Trang Chủ Học Sinh
            </a>
          </div>
        </div>
      </Card>
    </div>
  );
}
