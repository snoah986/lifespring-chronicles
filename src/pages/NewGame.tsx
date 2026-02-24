import React, { useState, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

// --- 120 NORMAL TRAITS ---
const NORMAL_TRAITS = [
  "Left-handed", "Right-handed", "Freckles", "Dimples", "Cleft chin", "Birthmark (arm)", "Birthmark (face)", "Birthmark (back)", 
  "Heterochromia (slight)", "Curly hair genetics", "Straight hair genetics", "Wavy hair genetics", "Thick hair genetics", "Thin hair genetics", 
  "Cowlick", "Attached earlobes", "Detached earlobes", "Widow's peak", "Straight hairline", "Long fingers", 
  "Short fingers", "Webbed toes (mild)", "High arches", "Flat feet", "Broad shoulders", "Narrow shoulders", 
  "Fast metabolism", "Slow metabolism", "Tall genetic marker", "Short genetic marker", "Average height marker", "Deep set eyes", 
  "Wide set eyes", "Prominent nose", "Button nose", "Sharp jawline", "Soft jawline", "Pale skin tendency", 
  "Easily tans", "Sunburns easily", "Colicky", "Quiet baby", "Observant", "Restless sleeper", 
  "Easy sleeper", "Clingy", "Independent", "Fast crawler marker", "Slow crawler marker", "Early babbler", 
  "Late babbler", "Always smiling", "Serious expression", "Easily startled", "Fearless", "Curious", 
  "Cautious", "High energy", "Low energy", "Attracted to lights", "Attracted to sounds", "Sensitive to noise", 
  "Sensitive to textures", "Comforted by motion", "Dislikes swaddling", "Loves swaddling", "Voracious eater", "Picky eater", 
  "Thumbsucker", "Pacifier reliant", "Grabs everything", "Stares at hands", "Fascinated by faces", "Ignores strangers", 
  "Loves strangers", "Cries loudly", "Whimpers softly", "Laughs early", "Hiccups often", "Sneezes in sunlight",
  "Mild lactose sensitivity", "Strong lungs", "Sensitive skin", "Double crown (hair)", "Predisposition to allergies", "Perfect vision genetics", 
  "Needs glasses early", "Strong teeth genetics", "Prone to cavities", "High body temperature", "Cold hands and feet", "Blushes easily", 
  "Sweats easily", "Deep voice genetics", "High voice genetics", "Tone deaf marker", "Rhythmic tendency", "Clumsy genetics", 
  "Agile genetics", "Flexible", "Stiff joints", "Heavy sleeper", "Light sleeper", "Vivid dreamer", 
  "Sleep talker genetics", "Snorer", "Prone to hiccups", "Frequent yawner", "Fast nail growth", "Slow nail growth", 
  "Thick eyebrows", "Thin eyebrows", "Long eyelashes", "Short eyelashes", "Rosy cheeks", "Pale cheeks", 
  "Ticklish", "Not ticklish", "Prone to dizzy spells", "Iron deficiency tendency"
];

// --- 30 SPECIAL TRAITS WITH RARITY ---
const SPECIAL_TRAITS = {
  common: [ // Weight: 40%
    "Ambidextrous", "Perfect Pitch", "Double Jointed", "Speed Reader Genetics", 
    "Deep Sleeper Phase", "Iron Stomach", "High Pain Tolerance", "Early Walker"
  ],
  uncommon: [ // Weight: 30%
    "Synesthesia", "Lucid Dreamer", "Supertaster", "Natural Polyglot Marker", 
    "Hyperlexia Tendency", "Tetrachromacy", "Uncanny Intuition", "Photographic Memory"
  ],
  epic: [ // Weight: 20%
    "Minor Savant", "Immune Resistance", "Golden Blood Type (Rh-null)", "Unbreakable Bones Genetics", 
    "Absolute Direction", "Unnatural Charisma", "Danger Sense"
  ],
  mythic: [ // Weight: 10%
    "Prodigy (Intellect)", "Physical Paragon", "Heir to a Secret Fortune", "Prophetic Dreams", 
    "The Main Character Aura", "Genetic Anomaly", "Touched by Fate"
  ]
};

const HOSPITALS = ["County General Hospital", "University Research Medical Center", "Rural Midwife Clinic", "Private Concierge Suite", "Home Birth", "In-Transit Delivery"];
const WEATHERS = ["Heavy Thunderstorm", "Unseasonably Warm", "Blizzard Conditions", "Clear Midnight Sky", "Dense Morning Fog", "Torrential Rain"];

interface GeneratedLife {
  id: string;
  dnaHash: string;
  hospital: string;
  weather: string;
  time: string;
  normalTraits: string[];
  specialTrait: { name: string; rarity: string; color: string };
  familyDynamic: string;
  parentalBond: number;
  physicianNote: string;
}

export function NewGame() {
  const [isGenerating, setIsGenerating] = useState(true);
  const [lifeData, setLifeData] = useState<GeneratedLife | null>(null);

  useEffect(() => {
    const generateLife = () => {
      // 1. Roll Normal Traits (Pick 3 unique)
      const shuffledNormal = [...NORMAL_TRAITS].sort(() => 0.5 - Math.random());
      const pickedNormal = shuffledNormal.slice(0, 3);

      // 2. Roll Special Trait based on rarity weights
      const roll = Math.random() * 100;
      let specialCategory = '';
      let rarityName = '';
      let rarityColor = '';
      
      if (roll <= 40) { specialCategory = 'common'; rarityName = 'Uncommon'; rarityColor = 'text-green-400'; }
      else if (roll <= 70) { specialCategory = 'uncommon'; rarityName = 'Rare'; rarityColor = 'text-blue-400'; }
      else if (roll <= 90) { specialCategory = 'epic'; rarityName = 'Epic'; rarityColor = 'text-purple-400'; }
      else { specialCategory = 'mythic'; rarityName = 'Mythic'; rarityColor = 'text-yellow-400'; }

      const specialArray = SPECIAL_TRAITS[specialCategory as keyof typeof SPECIAL_TRAITS];
      const pickedSpecial = specialArray[Math.floor(Math.random() * specialArray.length)];

      // 3. Narrative Prophecy based on rarity
      let note = '';
      if (rarityName === 'Uncommon') note = "Healthy delivery. Vitals normal.";
      else if (rarityName === 'Rare') note = "Subject exhibits unusual baseline responses. Requires monitoring.";
      else if (rarityName === 'Epic') note = "Fascinating genetic markers present. Anomalous potential detected.";
      else note = "Unprecedented readings. I have never seen a profile like this in my entire career.";

      // 4. DNA Hash & Environment
      const hash = Array.from({length: 24}, () => Math.floor(Math.random()*16).toString(16)).join('').toUpperCase();
      const time = `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
      
      const families = ["Supportive Working Class", "Distant Wealthy", "Overbearing Single Parent", "Struggling Extended Family", "Highly Academic Parents"];

      setLifeData({
        id: `SUB-${Math.floor(Math.random() * 999999)}`,
        dnaHash: hash,
        hospital: HOSPITALS[Math.floor(Math.random() * HOSPITALS.length)],
        weather: WEATHERS[Math.floor(Math.random() * WEATHERS.length)],
        time: time,
        normalTraits: pickedNormal,
        specialTrait: { name: pickedSpecial, rarity: rarityName, color: rarityColor },
        familyDynamic: families[Math.floor(Math.random() * families.length)],
        parentalBond: Math.floor(Math.random() * 60) + 40, // 40-100 baseline
        physicianNote: note
      });

      setTimeout(() => setIsGenerating(false), 3500);
    };

    generateLife();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900/40 via-[#0a0a0b] to-[#0a0a0b]" />
      
      {isGenerating ? (
        <div className="flex flex-col items-center gap-8 z-10 w-full max-w-md">
          <div className="relative w-24 h-24">
            <div className="absolute inset-0 border-4 border-slate-800 border-t-[#f4b8a8] rounded-full animate-spin" />
            <div className="absolute inset-2 border-4 border-slate-800 border-b-[#5ba3ff] rounded-full animate-spin direction-reverse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
          </div>
          <div className="w-full space-y-2 font-mono text-xs text-[#b8b8a8] uppercase tracking-widest text-center">
            <p className="animate-pulse">Sequencing Genomic Hash...</p>
            <p className="animate-pulse" style={{ animationDelay: '500ms' }}>Evaluating Environmental Seed...</p>
            <p className="animate-pulse" style={{ animationDelay: '1000ms' }}>Calculating Baseline Mutators...</p>
          </div>
        </div>
      ) : (
        <div className="z-10 w-full max-w-2xl bg-[#e5e5df] text-[#1a1a1c] rounded-sm p-4 md:p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-1000">
          <div className="border border-[#1a1a1c] p-1 h-full">
            <div className="border-4 border-double border-[#1a1a1c] p-6 h-full flex flex-col relative bg-white/50 backdrop-blur-sm">
              
              {/* Header Section */}
              <div className="flex justify-between items-start border-b-2 border-[#1a1a1c] pb-6 mb-6">
                <div>
                  <h1 className="text-3xl font-serif font-bold uppercase tracking-widest text-slate-900">Certificate of Birth</h1>
                  <p className="text-sm font-mono mt-1 text-slate-600">Department of Vital Records & Simulation</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs text-slate-500 uppercase">Subject ID</p>
                  <p className="font-mono text-lg font-bold text-slate-800">{lifeData?.id}</p>
                </div>
              </div>
              
              {/* Environmental Grid */}
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 font-serif text-sm border-b border-slate-300 pb-6 mb-6">
                <div>
                  <span className="block text-slate-500 font-mono text-xs uppercase mb-1">Location of Delivery</span>
                  <span className="font-bold text-slate-800">{lifeData?.hospital}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-mono text-xs uppercase mb-1">Time & Atmosphere</span>
                  <span className="font-bold text-slate-800">{lifeData?.time} / {lifeData?.weather}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-mono text-xs uppercase mb-1">Initial Family Dynamic</span>
                  <span className="font-bold text-slate-800">{lifeData?.familyDynamic}</span>
                </div>
                <div>
                  <span className="block text-slate-500 font-mono text-xs uppercase mb-1">Base Parental Bond</span>
                  <span className="font-bold text-slate-800">{lifeData?.parentalBond} / 100</span>
                </div>
              </div>

              {/* Traits Section */}
              <div className="mb-8">
                <span className="block text-slate-500 font-mono text-xs uppercase mb-3 border-b border-slate-300 pb-1">Identified Genetic Traits</span>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {lifeData?.normalTraits.map((trait, idx) => (
                    <li key={idx} className="bg-slate-100 px-3 py-2 text-sm font-serif font-medium text-slate-700 rounded-sm border border-slate-200">
                      {trait}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Special Trait Section */}
              <div className="bg-slate-900 text-slate-100 p-4 rounded-sm border-l-4 border-slate-700 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-mono text-xs uppercase text-slate-400">Primary Anomaly Detected</span>
                  <span className={`font-mono text-xs uppercase font-bold px-2 py-0.5 rounded bg-slate-800 ${lifeData?.specialTrait.color}`}>
                    Tier: {lifeData?.specialTrait.rarity}
                  </span>
                </div>
                <p className="text-xl font-serif font-medium tracking-wide text-white">{lifeData?.specialTrait.name}</p>
              </div>

              {/* Footer & Barcode */}
              <div className="mt-auto pt-6 border-t-2 border-[#1a1a1c] flex flex-col md:flex-row justify-between items-end gap-6">
                <div className="w-full md:w-1/2">
                  <span className="block text-slate-500 font-mono text-[10px] uppercase mb-1">Attending Physician Notes</span>
                  <p className="font-serif text-sm italic text-slate-700">"{lifeData?.physicianNote}"</p>
                </div>
                <div className="text-right w-full md:w-auto">
                  <div className="font-mono text-[8px] tracking-[0.2em] text-slate-800 break-all w-full max-w-[200px] ml-auto leading-tight mb-1">
                    {lifeData?.dnaHash.repeat(3)}
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 uppercase">Genomic Hash Sequence</span>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button 
              onClick={() => window.location.href='/game'} 
              className="group relative px-8 py-4 bg-[#1a1a1c] text-[#f5f5f0] font-mono text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-slate-800"
            >
              <span className="relative z-10">Accept Parameters & Begin Life</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-full bg-white/5 transition-all duration-300 ease-out group-hover:scale-[2.5]" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
