import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { COUNTRIES } from '../data/geography';

export function IdentityConfig({ onComplete }) {
  const [data, setData] = useState({ name: '', gender: 'Male', country: 'United Kingdom', location: 'London' });
  const setIdentity = useGameStore(state => state.setIdentity);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] p-10 flex flex-col justify-center font-serif">
      <div className="max-w-xs space-y-6">
        <h2 className="text-[#c2410c] uppercase tracking-[0.4em] text-[10px]">Identity Setup</h2>
        <input className="w-full bg-transparent border-b border-[#1c1c1f] py-2 outline-none" placeholder="Name" onChange={(e)=>setData({...data, name: e.target.value})} />
        
        <select className="w-full bg-[#0a0a0a] border-b border-[#1c1c1f] py-2" onChange={(e)=>setData({...data, country: e.target.value})}>
          {Object.keys(COUNTRIES).map(c => <option key={c}>{c}</option>)}
        </select>

        <select className="w-full bg-[#0a0a0a] border-b border-[#1c1c1f] py-2" onChange={(e)=>setData({...data, location: e.target.value})}>
          {COUNTRIES[data.country].map(city => <option key={city}>{city}</option>)}
        </select>

        <button onClick={() => {setIdentity(data); onComplete();}} className="w-full py-4 border border-[#c2410c] text-[#c2410c] uppercase text-[10px]">Confirm</button>
      </div>
    </div>
  );
}
