import { useEffect, useRef } from 'react';
import type { ChronicleEntry } from '@/game/types';

interface ChronicleProps {
  entries: ChronicleEntry[];
}

const Chronicle = ({ entries }: ChronicleProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries.length]);

  return (
    <div className="col-span-2 border-t border-border flex flex-col" style={{ background: 'hsl(var(--chronicle-bg))' }}>
      <div className="panel-header">Chronicle</div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-1">
        {entries.map((entry, i) => (
          <div key={i} className={`chronicle-entry ${entry.valence}`}>
            <span className="text-muted-foreground mr-2">[{entry.age}]</span>
            {entry.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chronicle;
