export const SEAT_PRICES = {
  CLASSIC: 150,
  PRIME: 180,
  RECLINER: 200,
};

export const getSeatPrice = (seatNumber) => {
  if (seatNumber <= 10) return SEAT_PRICES.CLASSIC;
  if (seatNumber <= 20) return SEAT_PRICES.PRIME;
  return SEAT_PRICES.RECLINER;
};

export const getSeatTier = (seatNumber) => {
  if (seatNumber <= 10) return 'Classic';
  if (seatNumber <= 20) return 'Prime';
  return 'Recliner';
};
