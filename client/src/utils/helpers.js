export const getMovieImage = (title, currentUrl) => {
  if (currentUrl && currentUrl.startsWith('http')) return currentUrl;

  const t = title?.toLowerCase() || '';
  
  // High-reliability Unsplash image IDs for specific genres/titles
  if (t.includes('nun') || t.includes('horror')) 
    return 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=500&auto=format&fit=crop&q=80';
  
  if (t.includes('oppenheimer') || t.includes('nuclear') || t.includes('history')) 
    return 'https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=500&auto=format&fit=crop&q=80';
  
  if (t.includes('barbie') || t.includes('pink') || t.includes('fashion')) 
    return 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=500&auto=format&fit=crop&q=80';
  
  if (t.includes('spider') || t.includes('hero') || t.includes('marvel')) 
    return 'https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop&q=80';
  
  if (t.includes('past lives') || t.includes('romance') || t.includes('drama')) 
    return 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=500&auto=format&fit=crop&q=80';

  if (t.includes('joker')) 
    return 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop&q=80';

  if (t.includes('batman') || t.includes('dark knight')) 
    return 'https://images.unsplash.com/photo-1531259683007-016a703b9993?w=500&auto=format&fit=crop&q=80';

  // Default professional movie theater placeholder
  return 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=80';
};
