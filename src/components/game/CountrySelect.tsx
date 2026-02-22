import { useState } from 'react';
import { COUNTRIES, CountryCode } from '@/game/countries';

interface CountrySelectProps {
  onSelect: (name: string, country: CountryCode) => void;
}

const CountrySelect = ({ onSelect }: CountrySelectProps) => {
  const [name, setName] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<CountryCode | null>(null);
  const [step, setStep] = useState<'name' | 'country'>('name');

  const handleNameSubmit = () => {
    if (name.trim().length < 2) return;
    setStep('country');
  };

  const handleCountrySelect = (code: CountryCode) => {
    setSelectedCountry(code);
  };

  const handleStart = () => {
    if (!selectedCountry || !name.trim()) return;
    onSelect(name.trim(), selectedCountry);
  };

  if (step === 'name') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <h1 className="font-mono text-3xl tracking-widest text-foreground uppercase mb-2">LIFESPAN</h1>
            <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">A Life Simulation</p>
          </div>
          <div className="panel-header mb-0 rounded-t">Identity</div>
          <div className="bg-card border border-border border-t-0 rounded-b p-6 space-y-4">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">What is your name?</p>
            <input
              className="w-full bg-background border border-border text-foreground font-mono text-sm px-3 py-2 rounded focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              placeholder="Enter your name..."
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleNameSubmit()}
              autoFocus
              maxLength={30}
            />
            <button
              className="w-full bg-amber-600 hover:bg-amber-500 text-black font-mono text-xs uppercase tracking-widest py-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleNameSubmit}
              disabled={name.trim().length < 2}
            >
              Continue →
            </button>
          </div>
        </div>
      </div>
    );
  }

  const config = selectedCountry ? COUNTRIES[selectedCountry] : null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-mono text-3xl tracking-widest text-foreground uppercase mb-1">LIFESPAN</h1>
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">Welcome, {name}</p>
        </div>

        <div className="panel-header mb-0 rounded-t">Choose Your Country</div>
        <div className="bg-card border border-border border-t-0 rounded-b p-4 space-y-3">
          <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-4">
            Your country determines your school system, exam names, currency, and career market.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {(Object.keys(COUNTRIES) as CountryCode[]).map(code => {
              const c = COUNTRIES[code];
              const isSelected = selectedCountry === code;
              return (
                <button
                  key={code}
                  onClick={() => handleCountrySelect(code)}
                  className={`text-left p-3 rounded border transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 text-foreground'
                      : 'border-border bg-background hover:border-muted-foreground text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="text-xl mb-1">{c.flag}</div>
                  <div className="font-mono text-xs font-bold uppercase tracking-wider">{c.name}</div>
                  <div className="font-mono text-[10px] text-muted-foreground mt-1">
                    {c.exams.map(e => e.name).join(' · ')}
                  </div>
                </button>
              );
            })}
          </div>

          {config && selectedCountry && (
            <div className="mt-4 border border-border rounded p-3 bg-background space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                {config.flag} {config.name} — School System
              </div>
              {config.schoolStages.map(stage => (
                <div key={stage.name} className="flex justify-between text-xs font-mono">
                  <span className="text-foreground">{stage.name}</span>
                  <span className="text-muted-foreground">Age {stage.startAge}–{stage.endAge}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 mt-2 space-y-1">
                {config.exams.map(exam => (
                  <div key={exam.age} className="flex justify-between text-[10px] font-mono">
                    <span className="text-amber-400">{exam.name}</span>
                    <span className="text-muted-foreground">Age {exam.age}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-2 text-[10px] font-mono text-muted-foreground">
                Currency: {config.currencySymbol} · Retirement age: {config.retirementAge} · Working from: {config.minimumWorkingAge}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              className="flex-1 border border-border text-muted-foreground font-mono text-xs uppercase tracking-widest py-2 rounded hover:text-foreground transition-colors"
              onClick={() => setStep('name')}
            >
              ← Back
            </button>
            <button
              className="flex-1 bg-amber-600 hover:bg-amber-500 text-black font-mono text-xs uppercase tracking-widest py-2 rounded transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleStart}
              disabled={!selectedCountry}
            >
              Begin Life →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelect;
