import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ehapkfbgmiazuqmwvijj.supabase.co';
const supabaseKey = 'sb_publishable_0P5piXVCT47RkvqBYX0aHA_y7dqswC2';

export const supabase = createClient(supabaseUrl, supabaseKey);
