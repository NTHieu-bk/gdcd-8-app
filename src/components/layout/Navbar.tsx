"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

const navLinks = [
  { href: '/', label: 'Trang chủ', icon: '🏠' },
  {
    label: 'Hoạt động',
    icon: '📚',
    children: [
      { href: '#ai-ambassador', label: 'Đại sứ Văn hóa AI', icon: '🤖' },
      { href: '#main-content', label: 'Nội dung chính', icon: '📖' },
      { href: '#challenges', label: 'Trạm thử thách', icon: '🎮' },
      { href: '#creative-corner', label: 'Góc sáng tạo & Nộp sản phẩm', icon: '🎨' },
      { href: '#progress', label: 'Tiến trình', icon: '📊' },
    ],
  },
  {
    label: 'Trao đổi & Góp ý',
    icon: '💬',
    children: [
      { href: '#discussion', label: 'Trao đổi', icon: '💬' },
      { href: '#feedback', label: 'Góp ý', icon: '💡' },
      { href: '#guide', label: 'Hướng dẫn sử dụng', icon: '❓' },
    ],
  },
];

export function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const toggleDropdown = (label: string) => {
    setActiveDropdown(activeDropdown === label ? null : label);
  };

  const handleLogout = () => {
    localStorage.removeItem('studentLoggedIn');
    localStorage.removeItem('studentData');
    router.push('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gold-hairline bg-lacquer-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 ks-brand">
              <span className="text-xl font-bold tracking-widest uppercase text-kinpaku-gold font-display">GDCD Toàn Cầu</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <div key={link.label} className="relative group">
                {link.children ? (
                  <button
                    className="flex items-center gap-1.5 text-champagne hover:text-kinpaku-gold transition-colors text-sm font-medium py-2"
                    onClick={() => toggleDropdown(link.label)}
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                    <ChevronDown className="w-4 h-4 opacity-70" />
                  </button>
                ) : (
                  <Link
                    href={link.href!}
                    className="flex items-center gap-1.5 text-champagne hover:text-kinpaku-gold transition-colors text-sm font-medium py-2"
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                )}

                {/* Dropdown Menu */}
                {link.children && (
                  <div
                    className={`absolute left-0 mt-0 w-64 rounded-md shadow-lg bg-raised-lacquer border border-gold-hairline transition-all duration-200 ${
                      activeDropdown === link.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-1'
                    }`}
                    onMouseEnter={() => setActiveDropdown(link.label)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-warm hover:bg-lacquer-deep hover:text-kinpaku-gold transition-colors"
                          role="menuitem"
                          onClick={() => setActiveDropdown(null)}
                        >
                          <span className="text-lg w-6 text-center">{child.icon}</span>
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-vermilion-warning hover:text-vermilion-deep transition-colors text-sm font-medium py-2 ml-4 border border-vermilion-warning/30 px-3 rounded-full hover:bg-vermilion-warning/10"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-champagne hover:text-kinpaku-gold focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-lacquer-deep border-b border-gold-hairline">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <div key={link.label}>
                {link.children ? (
                  <>
                    <div className="flex items-center gap-2 px-3 py-2 text-base font-medium text-champagne">
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </div>
                    <div className="pl-6 space-y-1">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-text-muted hover:text-kinpaku-gold"
                          onClick={() => setIsOpen(false)}
                        >
                          <span>{child.icon}</span>
                          <span>{child.label}</span>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={link.href!}
                    className="flex items-center gap-2 px-3 py-2 text-base font-medium text-champagne hover:text-kinpaku-gold"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{link.icon}</span>
                    <span>{link.label}</span>
                  </Link>
                )}
              </div>
            ))}
            
            <div className="pt-4 pb-2 border-t border-gold-hairline mt-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-base font-medium text-vermilion-warning hover:text-vermilion-deep w-full text-left"
              >
                <LogOut className="w-5 h-5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
