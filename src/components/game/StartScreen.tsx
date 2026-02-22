import { useState } from 'react';

interface StartScreenProps {
  onStart: (name: string) => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onStart(name.trim());
  };

  return (
    <div className="start-screen">
      <div className="text-center animate-fade-in">
        <h1 className="start-title mb-2">LIFESPAN</h1>
        <p className="font-mono text-xs text-muted-foreground tracking-[0.15em] mb-12">
          A LIFE SIMULATION
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xs mx-auto">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
              Enter Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-secondary border border-border rounded-sm px-4 py-3 font-mono text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
              placeholder="Your name..."
              autoFocus
            />
          </div>
          
          <div className="text-[10px] font-mono text-muted-foreground">
            BIRTH YEAR: 1985
          </div>
          
          <button
            type="submit"
            disabled={!name.trim()}
            className="next-year-btn w-full disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Begin Life
          </button>
        </form>
        
        <p className="mt-12 text-[10px] font-mono text-muted-foreground opacity-50">
          Every choice matters. None can be undone.
        </p>
      </div>
    </div>
  );
};

export default StartScreen;
