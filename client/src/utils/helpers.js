export const getMovieImage = (title, currentUrl) => {
  if (currentUrl && currentUrl.startsWith('http')) return currentUrl;

  const t = title?.toLowerCase() || '';
  
  // Specific Title Matching
  if (t.includes('nun')) return 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&q=80';
  if (t.includes('oppenheimer')) return 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=500&q=80';
  if (t.includes('barbie')) return 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&q=80';
  if (t.includes('spider')) return 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&q=80';
  if (t.includes('past lives')) return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&q=80';
  if (t.includes('john wick') || t.includes('wick')) return 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500&q=80'; // Action/Gun
  if (t.includes('avatar')) return 'https://images.unsplash.com/photo-1464802686167-b939a6910659?w=500&q=80'; // Sci-fi/Space
  if (t.includes('mario')) return 'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500&q=80'; // Gaming/Colorful
  if (t.includes('fast x') || t.includes('fast & furious')) return 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500&q=80'; // Sports car
  if (t.includes('interstellar')) return 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=500&q=80';
  if (t.includes('joker')) return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&q=80';
  if (t.includes('batman')) return 'https://images.unsplash.com/photo-1531259683007-016a703b9993?w=500&q=80';

  // Genre-based Fallbacks (if title doesn't match)
  if (t.includes('horror') || t.includes('scary')) return 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&q=80';
  if (t.includes('action') || t.includes('thriller')) return 'https://images.unsplash.com/photo-1533928298208-27ff66555d8d?w=500&q=80';
  if (t.includes('sci-fi') || t.includes('science')) return 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=500&q=80';
  if (t.includes('romance') || t.includes('love')) return 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=500&q=80';
  if (t.includes('comedy')) return 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&q=80';

  // Default professional movie theater placeholder
  return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
};
