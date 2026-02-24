name: Forced Identity Overhaul
on: [workflow_dispatch]

jobs:
  steamroll:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Inject Graphite, Copper, and Neural Loading
        run: |
          # 1. Redesign Landing Page with Neural Loading Logic
          cat << 'EOF' > src/components/LandingPage.tsx
          import React, { useState, useEffect } from 'react';

          export function LandingPage() {
            const [isLoading, setIsLoading] = useState(false);
            const [loadProgress, setLoadProgress] = useState(0);

            useEffect(() => {
              if (isLoading && loadProgress < 100) {
                const timer = setTimeout(() => setLoadProgress(prev => prev + 1), 30);
                return () => clearTimeout(timer);
              } else if (loadProgress >= 100) {
                window.location.href = '/play';
              }
            }, [isLoading, loadProgress]);

            if (isLoading) {
              return (
                <div className="min-h-screen bg-[#0a0a0a] text-[#c2410c] flex flex-col items-center justify-center font-mono p-10">
                  <div className="w-full max-w-xs space-y-8">
                    <div className="text-[10px] tracking-[0.4em] uppercase opacity-50 text-center">Neural Link Established</div>
                    <div className="relative h-[2px] w-full bg-[#18181b] overflow-hidden">
                      <div className="h-full bg-[#c2410c] transition-all duration-300 shadow-[0_0_20px_#c2410c]" style={{ width: `${loadProgress}%` }} />
                    </div>
                    <div className="flex justify-between text-[10px] tracking-[0.2em] opacity-80">
                      <span>SYNCING...</span>
                      <span>{loadProgress}%</span>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] flex flex-col justify-between p-12 font-serif selection:bg-[#c2410c]">
                <div className="flex justify-between items-start">
                  <div className="text-[9px] tracking-[0.4em] text-[#3f3f46] uppercase leading-relaxed">Identity Extraction // v5.0<br/>Location: Wembley, UK</div>
                  <div className="w-10 h-10 border border-[#27272a] flex items-center justify-center text-[10px] text-[#c2410c] font-mono">LC</div>
                </div>
                <div className="max-w-2xl">
                  <h1 className="text-7xl font-light tracking-tighter text-[#fafafa] mb-6 leading-none">Lifespring<br/><span className="italic text-[#c2410c]">Chronicles</span></h1>
                  <p className="text-xs text-[#71717a] font-sans tracking-[0.2em] uppercase max-w-xs leading-loose">The world remembers. Do you?</p>
                </div>
                <div className="flex flex-col gap-10 items-start">
                  <button onClick={() => setIsLoading(true)} className="group flex items-center gap-6 text-3xl font-light hover:text-white transition-all">
                    <span className="w-12 h-[1px] bg-[#c2410c] group-hover:w-24 transition-all duration-700"></span>
                    BEGIN EXTRACTION
                  </button>
                  <button className="text-[10px] tracking-[0.4em] text-[#27272a] hover:text-[#52525b] uppercase transition-colors">Archive Logs</button>
                </div>
                <div className="fixed right-10 bottom-24 origin-bottom-right -rotate-90 text-[8px] tracking-[0.5em] text-[#18181b] uppercase">2.5% Black Swan // Syndicate: Active</div>
              </div>
            );
          }
          EOF

          # 2. Fix Vercel Routing
          cat << 'EOF' > vercel.json
          { "rewrites": [{ "source": "/(.*)", "destination": "/" }] }
          EOF

      - name: Force Push to Main
        run: |
          git config --global user.name "GitHub Actions"
          git config --global user.email "actions@github.com"
          git add .
          git commit -m "Nuclear Fix: Forced High-End UI and Neural Loading" || echo "No changes"
          git push origin main --force
