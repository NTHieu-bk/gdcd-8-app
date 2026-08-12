"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { countries, CountryData } from '../../data/countries';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

// Dynamically import react-globe.gl to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false });

interface GlobeExplorerProps {
  selectedCountry: CountryData | null;
  onSelectCountry: (country: CountryData) => void;
}

export function GlobeExplorer({ selectedCountry, onSelectCountry }: GlobeExplorerProps) {
  const [globeReady, setGlobeReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const globeRef = useRef<any>(null);

  // Focus globe on the selected country
  useEffect(() => {
    if (globeRef.current && selectedCountry) {
      globeRef.current.pointOfView({ lat: selectedCountry.lat, lng: selectedCountry.lng, altitude: 1.5 }, 1000);
    }
  }, [selectedCountry]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    const found = countries.find(c => c.name.toLowerCase().includes(query));
    if (found) {
      onSelectCountry(found);
    }
  };

  return (
    <section id="explore" className="py-16 bg-lacquer-deep relative border-y border-gold-hairline overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-medium text-kinpaku-gold mb-4 flex items-center gap-3 uppercase tracking-wider">
            <span className="text-4xl">🌎</span> Quả Cầu Văn Hóa
          </h2>
          <p className="text-text-muted text-center max-w-2xl mb-8">
            Xoay quả cầu để khám phá, hoặc tìm kiếm quốc gia bạn muốn tìm hiểu. Hãy chọn một quốc gia để bắt đầu hành trình.
          </p>
          
          <form onSubmit={handleSearch} className="flex gap-2 w-full max-w-md">
            <div className="relative w-full">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">🔎</span>
              <Input 
                type="text" 
                placeholder="Tìm kiếm quốc gia..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" variant="primary">Tìm</Button>
          </form>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          <div className="relative w-full lg:w-2/3 aspect-square max-h-[600px] flex justify-center items-center rounded-full border border-gold-hairline/20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lacquer-black to-transparent shadow-[0_0_50px_rgba(230,57,45,0.05)]">
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              {!globeReady && <div className="text-kinpaku-gold animate-pulse text-sm uppercase tracking-widest font-mono">Đang tải vệ tinh...</div>}
            </div>
            
            <div className="z-10 cursor-move">
              <Globe
                ref={globeRef}
                width={Math.min(typeof window !== 'undefined' ? window.innerWidth - 40 : 600, 600)}
                height={Math.min(typeof window !== 'undefined' ? window.innerWidth - 40 : 600, 600)}
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                htmlElementsData={countries}
                htmlElement={(d: any) => {
                  const el = document.createElement('div');
                  const isSelected = selectedCountry?.id === d.id;
                  el.innerHTML = `
                    <div style="
                      color: ${isSelected ? '#E6392D' : '#FFFFFF'};
                      font-family: 'Albert Sans', Arial, sans-serif;
                      font-size: ${isSelected ? '16px' : '12px'};
                      font-weight: ${isSelected ? 'bold' : 'normal'};
                      cursor: pointer;
                      text-shadow: 0 2px 4px rgba(0,0,0,0.8);
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                      transition: all 0.3s ease;
                      pointer-events: auto;
                    ">
                      <span style="font-size: ${isSelected ? '24px' : '16px'}; margin-bottom: 2px;">${d.flag}</span>
                      <span style="white-space: nowrap;">${d.name}</span>
                    </div>
                  `;
                  el.onclick = () => onSelectCountry(d as CountryData);
                  return el;
                }}
                onGlobeReady={() => setGlobeReady(true)}
                atmosphereColor="#E6392D"
                atmosphereAltitude={0.15}
                backgroundColor="rgba(0,0,0,0)"
              />
            </div>
          </div>

          {/* Selected Country Details */}
          <div className="w-full lg:w-1/3 min-h-[300px]">
            {selectedCountry ? (
              <Card className="h-full border-kinpaku-gold/50 shadow-[0_0_20px_rgba(212,175,55,0.1)] animate-fade-in-up">
                <div className="p-8 flex flex-col items-center text-center h-full">
                  <div className="text-6xl mb-4 drop-shadow-md">{selectedCountry.flag}</div>
                  <h3 className="text-3xl font-display font-medium text-kinpaku-gold uppercase tracking-wider mb-2">
                    {selectedCountry.name}
                  </h3>
                  <div className="w-12 h-[1px] bg-gold-hairline-strong mb-6"></div>
                  
                  <div className="text-text-muted mb-8 leading-relaxed space-y-4">
                    {selectedCountry.description && (
                      <p className="text-text-warm font-medium">{selectedCountry.description}</p>
                    )}
                    <p>Hãy trò chuyện cùng Đại sứ Văn hóa AI để tìm hiểu sâu hơn về những nét đặc sắc của quốc gia này.</p>
                  </div>
                  
                  <a href="#ai-ambassador" className="mt-auto w-full">
                    <Button variant="primary" className="w-full">
                      Khám phá ngay
                    </Button>
                  </a>
                </div>
              </Card>
            ) : (
              <Card className="h-full border-dashed border-gold-hairline flex items-center justify-center bg-lacquer-black/30">
                <div className="p-12 flex flex-col items-center justify-center gap-4 text-center">
                  <div className="text-4xl opacity-50">🧭</div>
                  <p className="text-text-faint text-lg">Nhấn vào một quốc gia trên quả cầu để xem thông tin chi tiết.</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
