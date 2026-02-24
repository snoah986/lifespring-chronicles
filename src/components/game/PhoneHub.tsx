import React from 'react';

export function PhoneHub() {
  return (
    <div className="w-full h-full bg-[#0a0a0b] p-4 flex flex-col gap-4">
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">📱</div>
          <span className="text-[10px] uppercase font-mono">Social</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-pink-600 rounded-xl flex items-center justify-center">❤️</div>
          <span className="text-[10px] uppercase font-mono">Dating</span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">🛒</div>
          <span className="text-[10px] uppercase font-mono">Shop</span>
        </div>
      </div>
    </div>
  );
}
