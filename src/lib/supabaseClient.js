
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nubwwczvxswyonvbyslt.supabase.co';
const supabaseKey = 'sb_publishable_1S737RzqDdJjtv9gYFMzxQ_3HehLHoU'; // User provided key

export const supabase = createClient(supabaseUrl, supabaseKey);
