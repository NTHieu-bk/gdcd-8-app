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

  if (!isMounted) return null;

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
