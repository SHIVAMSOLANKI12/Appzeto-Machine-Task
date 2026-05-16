import app from './app.js';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import releaseExpiredLocks from './utils/releaseExpiredLocks.js';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  // Start server
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    
    // Optional: Periodically release expired seat locks (every 5 minutes)
    setInterval(releaseExpiredLocks, 5 * 60000);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
});
