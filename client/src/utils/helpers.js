export const getMovieImage = (title, currentUrl, genre) => {
  // 1. Check if currentUrl is already a valid specific URL (not the default placeholder)
  const isDefault = !currentUrl || currentUrl.includes('photo-1485846234645-a62644f84728');
  if (currentUrl && currentUrl.startsWith('http') && !isDefault) return currentUrl;

  const t = title?.toLowerCase() || '';
  // Handle genre array or string
  const g = Array.isArray(genre) ? genre.join(' ').toLowerCase() : (genre?.toLowerCase() || '');
  
  // 2. Specific Title Matching (Premium Hand-picked)
  if (t.includes('nun')) return 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&q=80';
  if (t.includes('conjuring')) return 'https://images.unsplash.com/photo-1533107862482-0e6974b06ec4?w=500&q=80';
  if (t.includes('hangover')) return 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&q=80';
  if (t.includes('titanic')) return 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=500&q=80';
  if (t.includes('oppenheimer')) return 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=500&q=80';
  if (t.includes('barbie')) return 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&q=80';
  if (t.includes('spider')) return 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&q=80';
  if (t.includes('past lives')) return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&q=80';
  if (t.includes('john wick') || t.includes('wick')) return 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80';
  if (t.includes('avatar')) return 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80';
  if (t.includes('mario')) return 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500&q=80';
  if (t.includes('fast x') || t.includes('fast & furious')) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80';
  if (t.includes('interstellar')) return 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500&q=80';
  if (t.includes('joker')) return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&q=80';
  if (t.includes('batman') || t.includes('dark knight')) return 'https://images.unsplash.com/photo-1531259683007-016a703b9993?w=500&q=80';

  // 3. Combined Keyword Search (Title + Genre)
  const combined = `${t} ${g}`;
  if (combined.includes('horror') || combined.includes('scary') || combined.includes('mystery')) return 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&q=80';
  if (combined.includes('action') || combined.includes('thriller') || combined.includes('crime')) return 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=500&q=80';
  if (combined.includes('sci-fi') || combined.includes('science') || combined.includes('fantasy')) return 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&q=80';
  if (combined.includes('romance') || combined.includes('love') || combined.includes('drama')) return 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=500&q=80';
  if (combined.includes('comedy') || combined.includes('animation')) return 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&q=80';

  // 4. Ultimate Fallback
  return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
};
