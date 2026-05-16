/**
 * Updated seat pricing logic
 * Seats 1-10: ₹150
 * Seats 11-20: ₹180
 * Seats 21-30: ₹200
 */
export const calculateTotalPrice = (selectedSeats) => {
  return selectedSeats.reduce((total, seatNumber) => {
    if (seatNumber <= 10) return total + 150;
    if (seatNumber <= 20) return total + 180;
    return total + 200;
  }, 0);
};
