import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/gameStore';

export function useGameController() {
  const { gameState, setCurrentEvent, updateStats } = useGameStore();

  const nextStep = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('stage', gameState.current_stage)
      .gte('min_age', gameState.current_age)
      .limit(1)
      .single();

    if (!error && data) {
      setCurrentEvent(data);
    }
  };

  return { nextStep };
}
