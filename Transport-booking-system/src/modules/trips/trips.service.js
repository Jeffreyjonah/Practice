const crypto = require('crypto');
const { readDB, updateDB } = require('../../utils/db');
const AppError = require('../../utils/appError');

async function getTrips({ origin, destination, date, page = 1, limit = 10 }) {
  const db = await readDB();
  let trips = db.trips;

  if (origin) {
    trips = trips.filter((t) => t.origin.toLowerCase() === origin.toLowerCase());
  }
  if (destination) {
    trips = trips.filter((t) => t.destination.toLowerCase() === destination.toLowerCase());
  }
  if (date) {

    trips = trips.filter((t) => t.departureTime.startsWith(date));
  }

  const total = trips.length;
  const start = (Number(page) - 1) * Number(limit);
  const paginated = trips.slice(start, start + Number(limit));

  return {
    trips: paginated.map(withRemainingSeats),
    pagination: { total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / limit) },
  };
}

async function getTripById(id) {
  const db = await readDB();
  const trip = db.trips.find((t) => t.id === id);
  if (!trip) throw new AppError('Trip not found', 404);
  return withRemainingSeats(trip);
}

function withRemainingSeats(trip) {
  return { ...trip, remainingSeats: trip.totalSeats - trip.seatsBooked.length };
}

async function createTrip(data) {
  const { origin, destination, departureTime, vehicle, totalSeats, price } = data;

  if (!origin || !destination || !departureTime || !totalSeats || price === undefined) {
    throw new AppError('origin, destination, departureTime, totalSeats and price are required', 400);
  }

  if (new Date(departureTime) < new Date()) {
    throw new AppError('departureTime cannot be in the past', 400);
  }

  const newTrip = {
    id: crypto.randomUUID(),
    origin: origin.trim(),
    destination: destination.trim(),
    departureTime,
    vehicle: vehicle || 'Unspecified',
    totalSeats: Number(totalSeats),
    seatsBooked: [],
    price: Number(price),
  };

  await updateDB((data) => {
    data.trips.push(newTrip);
    return data;
  });

  return newTrip;
}


async function bookSeat({ tripId, seat, userId }) {
  if (!seat) throw new AppError('seat is required', 400);

  let newBooking;

  await updateDB((data) => {
    const trip = data.trips.find((t) => t.id === tripId);

    if (!trip) throw new AppError('Trip not found', 404);
    if (new Date(trip.departureTime) < new Date()) {
      throw new AppError('This trip has already departed', 400);
    }
    if (trip.seatsBooked.length >= trip.totalSeats) {
      throw new AppError('This trip is fully booked', 400);
    }
    if (trip.seatsBooked.includes(seat)) {
      throw new AppError(`Seat ${seat} is already booked`, 409);
    }

    trip.seatsBooked.push(seat);

    newBooking = {
      id: crypto.randomUUID(),
      userId,
      tripId,
      seat,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };
    data.bookings.push(newBooking);

    return data;
  });

  return newBooking;
}

async function getMyBookings(userId) {
  const db = await readDB();
  return db.bookings.filter((b) => b.userId === userId);
}

async function cancelBooking({ bookingId, userId }) {
  let cancelled;

  await updateDB((data) => {
    const booking = data.bookings.find((b) => b.id === bookingId);

    if (!booking) throw new AppError('Booking not found', 404);
    if (booking.userId !== userId) throw new AppError('You can only cancel your own bookings', 403);
    if (booking.status === 'cancelled') throw new AppError('Booking is already cancelled', 400);

    booking.status = 'cancelled';

    const trip = data.trips.find((t) => t.id === booking.tripId);
    if (trip) {
      trip.seatsBooked = trip.seatsBooked.filter((s) => s !== booking.seat);
    }

    cancelled = booking;
    return data;
  });

  return cancelled;
}

module.exports = { getTrips, getTripById, createTrip, bookSeat, getMyBookings, cancelBooking };