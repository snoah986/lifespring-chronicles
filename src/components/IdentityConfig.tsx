import React, { useState } from 'react';
import { useGameStore } from '../store/gameStore';

export function IdentityConfig({ onComplete }) {
  const [data, setData] = useState({ name: '', gender: 'Male', location: 'Wembley, UK' });
  const setIdentity = useGameStore(state => state.setIdentity);

  const handleConfirm = () => {
    if (!data.name) return alert("Identify Subject Name.");
    setIdentity(data);
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#d4d4d8] p-10 flex flex-col justify-center font-serif">
      <div className="max-w-xs space-y-10">
        <h2 className="text-[#c2410c] uppercase tracking-[0.4em] text-xs">Identity Configuration</h2>
        
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase text-[#3f3f46] tracking-widest">Subject Name</label>
            <input 
              className="bg-transparent border-b border-[#1c1c1f] focus:border-[#c2410c] outline-none py-2 text-xl font-light transition-colors"
              onChange={(e) => setData({...data, name: e.target.value})}
              placeholder="Enter Name..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase text-[#3f3f46] tracking-widest">Biological Class</label>
            <select 
              className="bg-[#0a0a0a] border-b border-[#1c1c1f] outline-none py-2"
              onChange={(e) => setData({...data, gender: e.target.value})}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Non-Binary</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-[9px] uppercase text-[#3f3f46] tracking-widest">Deployment Zone</label>
            <select 
              className="bg-[#0a0a0a] border-b border-[#1c1c1f] outline-none py-2"
              onChange={(e) => setData({...data, location: e.target.value})}
            >
              <option value="Wembley, UK">Wembley, UK</option>
              <option value="London, UK">London, UK</option>
              <option value="Birmingham, UK">Birmingham, UK</option>
            </select>
          </div>
        </div>

        <button 
          onClick={handleConfirm}
          className="w-full py-4 border border-[#c2410c] text-[#c2410c] text-[10px] tracking-[0.5em] uppercase hover:bg-[#c2410c] hover:text-white transition-all"
        >
          Confirm Extraction
        </button>
      </div>
    </div>
  );
}
