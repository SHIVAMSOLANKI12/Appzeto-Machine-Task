import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: {
    type: Number,
    required: true
  },
  isBooked: {
    type: Boolean,
    default: false
  },
  lockedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lockExpiry: {
    type: Date,
    default: null
  }
}, { _id: false });

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie ID is required']
  },
  time: {
    type: Date,
    required: [true, 'Show time is required']
  },
  totalSeats: {
    type: Number,
    default: 30,
    immutable: true
  },
  seats: [seatSchema]
}, {
  timestamps: true
});

// Middleware to automatically generate 30 seats before saving a new show
showSchema.pre('save', function (next) {
  if (this.isNew && (!this.seats || this.seats.length === 0)) {
    const seats = [];
    for (let i = 1; i <= 30; i++) {
      seats.push({
        seatNumber: i,
        isBooked: false,
        lockedBy: null,
        lockExpiry: null
      });
    }
    this.seats = seats;
  }
  next();
});

const Show = mongoose.model('Show', showSchema);

export default Show;
