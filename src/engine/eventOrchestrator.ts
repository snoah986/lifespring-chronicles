import { supabase } from '../lib/supabase';
import { useGameStore } from '../store/gameStore';

export async function fetchNextEvent(age: number, stage: string) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('stage', stage)
    .gte('min_age', age)
    .lte('max_age', age)
    .limit(1)
    .single();
  
  if (error) return null;
  return data;
}
