"use client";

import { useState } from 'react';
import Hero from './components/Hero';
import Features from './components/Features';
import Benefits from './components/Benefits';
import Process from './components/Process';
import Trust from './components/Trust';

export default function Home() {
  // 'home' reste la vue active par défaut pour afficher la Landing Page
  const [view, setView] = useState('home');

  return (
    <main className="flex flex-col min-h-screen"> 
      <div className="flex-grow">
        {view === 'home' && (
          <>
      
            <Hero />
            <Features />
            <Benefits />
            <Process />
            <Trust />
          </>
        )} 
      </div>
    </main>
  );
}