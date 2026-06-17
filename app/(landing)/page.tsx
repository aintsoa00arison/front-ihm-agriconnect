"use client";

import { useState } from "react";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Benefits from "./components/Benefits";
import Process from "./components/Process";
import Trust from "./components/Trust";
import Reveal from "./components/Reveal";

export default function Home() {
  const [view, setView] = useState("home");

  return (
    <main className="flex flex-col min-h-screen">
      <div className="grow">
        {view === "home" && (
          <>
            <Hero />
            <Reveal>
              <Features />
            </Reveal>
            <Reveal delay={100}>
              <Benefits />
            </Reveal>
            <Reveal>
              <Process />
            </Reveal>
            <Reveal delay={100}>
              <Trust />
            </Reveal>
          </>
        )}
      </div>
    </main>
  );
}
