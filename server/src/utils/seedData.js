import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';
import connectDB from '../config/db.js';

dotenv.config();

const movies = [
  {
    title: 'Avatar: The Way of Water',
    description: 'Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na\'vi race to protect their home.',
    duration: 192,
    genre: ['Action', 'Sci-Fi'],
    releaseDate: '2022-12-16',
    cast: ['Sam Worthington', 'Zoe Saldaña', 'Sigourney Weaver'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg'
  },
  {
    title: 'John Wick: Chapter 4',
    description: 'John Wick uncovers a path to defeating The High Table. But before he can earn his freedom, Wick must face off against a new enemy with powerful alliances across the globe and forces that turn old friends into foes.',
    duration: 169,
    genre: ['Action', 'Thriller'],
    releaseDate: '2023-03-24',
    cast: ['Keanu Reeves', 'Donnie Yen', 'Bill Skarsgård'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg'
  },
  {
    title: 'The Super Mario Bros. Movie',
    description: 'A plumber named Mario travels through an underground labyrinth with his brother, Luigi, trying to save a captured princess.',
    duration: 92,
    genre: ['Animation', 'Comedy', 'Adventure'],
    releaseDate: '2023-04-05',
    cast: ['Chris Pratt', 'Anya Taylor-Joy', 'Charlie Day'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qNhM16b0aU2z04P73sJqM90586e.jpg'
  },
  {
    title: 'Oppenheimer',
    description: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.',
    duration: 180,
    genre: ['Drama', 'History'],
    releaseDate: '2023-07-21',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Matt Damon'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg'
  },
  {
    title: 'Spider-Man: Across the Spider-Verse',
    description: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.',
    duration: 140,
    genre: ['Animation', 'Action', 'Adventure'],
    releaseDate: '2023-06-02',
    cast: ['Shameik Moore', 'Hailee Steinfeld', 'Oscar Isaac'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg'
  },
  {
    title: 'Fast X',
    description: 'Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.',
    duration: 141,
    genre: ['Action', 'Adventure'],
    releaseDate: '2023-05-19',
    cast: ['Vin Diesel', 'Jason Momoa', 'Michelle Rodriguez'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg'
  },
  {
    title: 'The Nun II',
    description: '1956 – France. A priest is murdered. An evil is spreading. The sequel to the worldwide smash hit follows Sister Irene as she once again comes face-to-face with Valak, the demon nun.',
    duration: 110,
    genre: ['Horror', 'Mystery'],
    releaseDate: '2023-09-08',
    cast: ['Taissa Farmiga', 'Jonas Bloquet', 'Storm Reid'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/5gzzk0uY2c5Z932aJvLg03xY9T9.jpg'
  },
  {
    title: 'Barbie',
    description: 'Barbie and Ken are having the time of their lives in the colorful and seemingly perfect world of Barbie Land. However, when they get a chance to go to the real world, they soon discover the joys and perils of living among humans.',
    duration: 114,
    genre: ['Comedy', 'Fantasy'],
    releaseDate: '2023-07-21',
    cast: ['Margot Robbie', 'Ryan Gosling', 'America Ferrera'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg'
  },
  {
    title: 'Past Lives',
    description: 'Nora and Hae Sung, two deeply connected childhood friends, are wrested apart after Nora\'s family emigrates from South Korea. Twenty years later, they are reunited for one fateful week as they confront notions of love and destiny.',
    duration: 106,
    genre: ['Romance', 'Drama'],
    releaseDate: '2023-06-02',
    cast: ['Greta Lee', 'Teo Yoo', 'John Magaro'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/zf1dO4a2JqSgW65yJd1S5G3vH3J.jpg'
  },
  {
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space in an attempt to ensure humanity\'s survival.',
    duration: 169,
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    releaseDate: '2014-11-07',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    duration: 152,
    genre: ['Action', 'Crime', 'Drama'],
    releaseDate: '2008-07-18',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg'
  },
  {
    title: 'The Hangover',
    description: 'Three buddies wake up from a bachelor party in Las Vegas, with no memory of the previous night and the bachelor missing. They make their way around the city in order to find their friend before his wedding.',
    duration: 100,
    genre: ['Comedy'],
    releaseDate: '2009-06-05',
    cast: ['Bradley Cooper', 'Ed Helms', 'Zach Galifianakis'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/eshEkiG7NmU4ekA8CtpIdYiYufZ.jpg'
  },
  {
    title: 'Titanic',
    description: 'A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious, ill-fated R.M.S. Titanic.',
    duration: 194,
    genre: ['Romance', 'Drama'],
    releaseDate: '1997-12-19',
    cast: ['Leonardo DiCaprio', 'Kate Winslet', 'Billy Zane'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/sCzcYW9h55WcesOqA12cgEr9Exw.jpg'
  },
  {
    title: 'The Conjuring',
    description: 'Paranormal investigators Ed and Lorraine Warren work to help a family terrorized by a dark presence in their farmhouse.',
    duration: 112,
    genre: ['Horror', 'Thriller'],
    releaseDate: '2013-07-19',
    cast: ['Vera Farmiga', 'Patrick Wilson', 'Lili Taylor'],
    language: 'English',
    posterUrl: 'https://image.tmdb.org/t/p/w500/aorBPOk59D17812tE3E1wM8701q.jpg'
  }
];

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Movie.deleteMany();
    await Show.deleteMany();

    // Insert movies
    const createdMovies = await Movie.insertMany(movies);
    console.log('Movies seeded!');

    // Create shows for each movie
    const shows = [];
    createdMovies.forEach(movie => {
      const baseTime = new Date();
      baseTime.setHours(18, 0, 0, 0); // 6:00 PM today

      // Add 3 shows per movie at different times
      for (let i = 0; i < 3; i++) {
        const showTime = new Date(baseTime);
        showTime.setHours(baseTime.getHours() + (i * 3)); // 6pm, 9pm, 12am
        shows.push({
          movieId: movie._id,
          time: showTime,
        });
      }
    });

    await Show.insertMany(shows);
    console.log('Shows seeded!');

    process.exit();
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
