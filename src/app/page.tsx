"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/home/Hero";
import { Objectives } from "@/components/home/Objectives";
import { GlobeExplorer } from "@/components/home/GlobeExplorer";
import { AIAmbassador } from "@/components/home/AIAmbassador";
import { MainContent } from "@/components/home/MainContent";
import { CountryData } from "@/data/countries";

import { GameMatch } from "@/components/games/GameMatch";
import { GameAgree } from "@/components/games/GameAgree";
import { GameQuiz } from "@/components/games/GameQuiz";
import { Questions } from "@/components/home/Questions";
import { CreativeCorner } from "@/components/home/CreativeCorner";
import { Comments } from "@/components/home/Comments";
import { UserGuide } from "@/components/home/UserGuide";

export default function Home() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (localStorage.getItem('studentLoggedIn') !== 'true') {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Objectives />
        <GlobeExplorer 
          selectedCountry={selectedCountry} 
          onSelectCountry={setSelectedCountry} 
        />
        <AIAmbassador selectedCountry={selectedCountry} />
        
        {/* Cultural Diversity Infographic */}
        <section className="py-16 bg-lacquer-deep border-y border-gold-hairline relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gold-hairline">
              <img src="/culture-4.jpg" alt="Sự đa dạng văn hóa thế giới - 195 Quốc gia, 7000+ Ngôn ngữ, 5000+ Dân tộc" className="w-full object-cover" />
            </div>
            <blockquote className="mt-8 text-center max-w-4xl mx-auto">
              <p className="text-lg md:text-xl text-champagne/90 leading-relaxed italic font-light">
                &ldquo;Sự đa dạng của các dân tộc được thể hiện qua ngôn ngữ, trang phục, tín ngưỡng, phong tục, lễ hội và lối sống của mỗi quốc gia. Khám phá những nét đặc sắc ấy không chỉ giúp chúng ta mở rộng hiểu biết mà còn hình thành thái độ tôn trọng sự khác biệt, góp phần xây dựng một cộng đồng toàn cầu đoàn kết và nhân văn.&rdquo;
              </p>
              <div className="mt-4 w-16 h-0.5 bg-kinpaku-gold mx-auto rounded-full"></div>
            </blockquote>
          </div>
        </section>

        <MainContent />
        <Questions />
        
        {/* Games / Challenges */}
        <div id="challenges">
          <GameMatch />
          <GameAgree />
          <GameQuiz />
        </div>
        
        <CreativeCorner />
        <Comments />
        <UserGuide />
      </main>
      <Footer />
    </div>
  );
}
