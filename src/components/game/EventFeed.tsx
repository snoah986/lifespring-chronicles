import type { ActiveEvent, EventChoice } from '@/game/types';

interface EventFeedProps {
  currentEvent: ActiveEvent | null;
  onChoice: (choice: EventChoice) => void;
}

const EventFeed = ({ currentEvent, onChoice }: EventFeedProps) => {
  if (!currentEvent) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="font-mono text-sm text-muted-foreground">No pending events</p>
          <p className="font-mono text-[10px] text-muted-foreground mt-1 opacity-60">
            Press "Next Year" to advance
          </p>
        </div>
      </div>
    );
  }

  const { event } = currentEvent;

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      <div className="max-w-lg mx-auto animate-fade-in">
        <div className="mb-1">
          <span className="font-mono text-[10px] uppercase tracking-widest text-primary">
            Life Event
          </span>
        </div>
        <h2 className="text-xl font-semibold text-foreground mb-3">
          {event.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-8">
          {event.description}
        </p>

        <div className="space-y-3">
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Your Choice
          </span>
          {event.choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoice(choice)}
              className="choice-btn"
            >
              {choice.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventFeed;
