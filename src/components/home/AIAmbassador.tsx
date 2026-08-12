"use client";

import React, { useState, useRef, useEffect } from 'react';
import { CountryData } from '../../data/countries';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

interface Message {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AIAmbassadorProps {
  selectedCountry: CountryData | null;
}

const defaultCountry = { id: 'JP', name: 'Nhật Bản', flag: '🇯🇵' };

export function AIAmbassador({ selectedCountry }: AIAmbassadorProps) {
  const currentCountry = selectedCountry || defaultCountry;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Xin chào! Mình sẽ đồng hành cùng bạn khám phá văn hóa ${currentCountry.name}.`
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Update greeting when country changes
  useEffect(() => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Xin chào! Mình sẽ đồng hành cùng bạn khám phá văn hóa ${currentCountry.name}.`
      }
    ]);
  }, [currentCountry.id]); // use primitive ID to prevent infinite loop

  // Scroll to bottom without scrolling the whole page
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          countryName: currentCountry.name,
          countryDescription: currentCountry.description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Có lỗi xảy ra khi gọi AI');
      }

      setMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.reply
        }
      ]);
    } catch (error: any) {
      console.error("Failed to fetch AI response", error);
      setMessages(prev => [
        ...prev, 
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `Xin lỗi, có lỗi kết nối tới bộ não AI của mình: ${error.message}. Bạn kiểm tra lại cấu hình GEMINI_API_KEY trong file .env.local nhé!`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="ai-ambassador" className="py-16 bg-lacquer-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-4 flex justify-center items-center gap-3 uppercase tracking-wider">
            <span className="text-4xl">🤖</span> ĐẠI SỨ VĂN HÓA {currentCountry.flag} {currentCountry.name.toUpperCase()}
          </h2>
          <p className="text-text-muted">Khám phá văn hóa các quốc gia & hỏi đáp thông minh</p>
        </div>

        <Card className="border-gold-hairline-strong bg-lacquer-deep shadow-2xl overflow-hidden">
          <div className="h-[450px] flex flex-col">
            {/* Chat Messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-raised-lacquer border border-gold-hairline text-xl">
                      {msg.role === 'user' ? '🧑' : '🤖'}
                    </div>
                    <div className={`p-4 rounded-xl ${
                      msg.role === 'user' 
                        ? 'bg-kinpaku-gold/10 border border-kinpaku-gold/30 text-champagne rounded-tr-sm' 
                        : 'bg-raised-lacquer border border-gold-hairline text-text-warm rounded-tl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-raised-lacquer border border-gold-hairline text-xl">
                      🤖
                    </div>
                    <div className="p-4 rounded-xl bg-raised-lacquer border border-gold-hairline rounded-tl-sm flex items-center gap-2">
                      <span className="w-2 h-2 bg-kinpaku-gold rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-kinpaku-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                      <span className="w-2 h-2 bg-kinpaku-gold rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                    </div>
                  </div>
                </div>
              )}
              {/* Removed messagesEndRef */}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-lacquer-black border-t border-gold-hairline">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Nhập câu hỏi của bạn..."
                  className="flex-1 bg-lacquer-deep border-gold-hairline-strong focus-visible:ring-kinpaku-gold text-base py-6"
                  disabled={isLoading}
                />
                <Button 
                  type="submit" 
                  variant="primary" 
                  disabled={isLoading || !input.trim()}
                  className="px-8 font-bold tracking-widest"
                >
                  GỬI
                </Button>
              </form>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
