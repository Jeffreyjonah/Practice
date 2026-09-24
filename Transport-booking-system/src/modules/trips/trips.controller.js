const catchAsync = require('../../utils/catchAsync');
const tripsService = require('./trips.service');

const listTrips = catchAsync(async (req, res) => {
  const { origin, destination, date, page, limit } = req.query;
  const result = await tripsService.getTrips({ origin, destination, date, page, limit });
  res.status(200).json({ success: true, ...result });
});

const getTrip = catchAsync(async (req, res) => {
  const trip = await tripsService.getTripById(req.params.id);
  res.status(200).json({ success: true, trip });
});

const createTrip = catchAsync(async (req, res) => {
  const trip = await tripsService.createTrip(req.body);
  res.status(201).json({ success: true, trip });
});

const bookTrip = catchAsync(async (req, res) => {
  const booking = await tripsService.bookSeat({
    tripId: req.params.id,
    seat: req.body.seat,
    userId: req.user.id,
  });
  res.status(201).json({ success: true, booking });
});

const myBookings = catchAsync(async (req, res) => {
  const bookings = await tripsService.getMyBookings(req.user.id);
  res.status(200).json({ success: true, bookings });
});

const cancelBooking = catchAsync(async (req, res) => {
  const booking = await tripsService.cancelBooking({
    bookingId: req.params.id,
    userId: req.user.id,
  });
  res.status(200).json({ success: true, booking });
});

module.exports = { listTrips, getTrip, createTrip, bookTrip, myBookings, cancelBooking };