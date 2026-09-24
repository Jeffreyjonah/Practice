const Router = require('express');
const authMiddleware = require('../../middleware/authMiddleware');
const restrictTo = require('../../middleware/restrictTo');
const {
  listTrips,
  getTrip,
  createTrip,
  bookTrip,
  myBookings,
  cancelBooking,
} = require('./trips.controller');

const route = Router();

route.get('/trips', listTrips);
route.get('/trips/:id', getTrip);

route.post('/trips', authMiddleware, restrictTo('admin'), createTrip);
route.post('/trips/:id/book', authMiddleware, bookTrip);
route.get('/bookings/me', authMiddleware, myBookings);
route.delete('/bookings/:id', authMiddleware, cancelBooking);

module.exports = route;