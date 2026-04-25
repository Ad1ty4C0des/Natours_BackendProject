const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('./handlerFactory');
const User = require('../models/userModel');

// Middleware: auto-set tour and user IDs from nested route params
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

// Middleware: check if the selected tour date is still available (for API bookings)
exports.checkAvailability = catchAsync(async (req, res, next) => {
  const { tour: tourId, startDate, numPeople } = req.body;
  const people = parseInt(numPeople, 10) || 1;

  if (!tourId) return next(new AppError('Booking must belong to a tour.', 400));
  if (!startDate)
    return next(new AppError('Please select a start date for this tour.', 400));

  const tour = await Tour.findById(tourId);
  if (!tour) return next(new AppError('No tour found with that ID.', 404));

  // Find the matching date subdocument
  const dateObj = tour.startDates.find(
    (d) => d.date.toISOString() === new Date(startDate).toISOString(),
  );

  if (!dateObj) {
    return next(
      new AppError('The selected date does not exist for this tour.', 400),
    );
  }

  if (dateObj.soldOut) {
    return next(
      new AppError(
        'Sorry, this tour date is fully booked. Please choose another date.',
        400,
      ),
    );
  }

  const spotsLeft = tour.maxGroupSize - dateObj.participants;
  if (people > spotsLeft) {
    return next(
      new AppError(
        `Only ${spotsLeft} spot(s) left for this date. Please reduce your group size.`,
        400,
      ),
    );
  }

  // Increment participants by the number of people
  dateObj.participants += people;
  if (dateObj.participants >= tour.maxGroupSize) {
    dateObj.soldOut = true;
  }

  await tour.save({ validateModifiedOnly: true });

  next();
});

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1. Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (!tour) return next(new AppError('No tour found with that ID.', 404));

  // 2. Validate the selected start date
  const { startDate, numPeople } = req.query;
  const people = parseInt(numPeople, 10) || 1;

  if (!startDate) {
    return next(new AppError('Please select a start date.', 400));
  }

  const dateObj = tour.startDates.find(
    (d) => d.date.toISOString() === new Date(startDate).toISOString(),
  );

  if (!dateObj) {
    return next(
      new AppError('The selected date does not exist for this tour.', 400),
    );
  }

  if (dateObj.soldOut) {
    return next(
      new AppError(
        'Sorry, this tour date is fully booked. Please choose another date.',
        400,
      ),
    );
  }

  const spotsLeft = tour.maxGroupSize - dateObj.participants;
  if (people > spotsLeft) {
    return next(
      new AppError(
        `Only ${spotsLeft} spot(s) left for this date. Please reduce your group size.`,
        400,
      ),
    );
  }

  // 3. Reserve spots immediately by incrementing participants
  dateObj.participants += people;
  if (dateObj.participants >= tour.maxGroupSize) {
    dateObj.soldOut = true;
  }
  await tour.save({ validateModifiedOnly: true });

  // 4. Create Checkout Session with startDate and numPeople in metadata
  const dateFormatted = new Date(startDate).toLocaleDateString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/my-tours?alert=booking&tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price * people}&startDate=${new Date(startDate).toISOString()}&numPeople=${people}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    metadata: {
      startDate: new Date(startDate).toISOString(),
      numPeople: String(people),
    },
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: `${tour.summary} | Date: ${dateFormatted} | ${people} person(s)`,
            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
            ],
          },
        },
        quantity: people,
      },
    ],
  });

  // 5. Send session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

// Redirect-based fallback: creates booking from success URL query params
// Works in dev mode where Stripe webhooks aren't configured
exports.createBookingFromRedirect = catchAsync(async (req, res, next) => {
  const { tour, user, price, startDate, numPeople } = req.query;

  // If any booking param is missing, skip (normal page visit)
  if (!tour || !user || !price || !startDate) return next();

  const people = parseInt(numPeople, 10) || 1;

  // Use try/catch to handle duplicate bookings (if webhook already created it)
  try {
    await Booking.create({
      tour,
      user,
      price: parseFloat(price),
      startDate,
      numPeople: people,
    });
  } catch (err) {
    // Duplicate key error (11000) means webhook already created this booking — safe to ignore
    if (err.code !== 11000) throw err;
  }

  // Redirect to clean URL (strip query params)
  res.redirect(req.originalUrl.split('?')[0]);
});

// Webhook-based: creates booking when Stripe fires checkout.session.completed
const createBookingFromWebhook = async (session) => {
  const tourId = session.client_reference_id;
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.amount_total / 100;
  const startDate = session.metadata?.startDate;
  const numPeople = parseInt(session.metadata?.numPeople, 10) || 1;

  if (!startDate) {
    console.error('No startDate found in session metadata');
    return;
  }

  // Participants were already incremented in getCheckoutSession,
  // so we only create the booking record here.
  try {
    await Booking.create({
      tour: tourId,
      user,
      price,
      startDate,
      numPeople,
    });
  } catch (err) {
    // Duplicate key error — redirect already created this booking
    if (err.code !== 11000) throw err;
  }
};

exports.webhookCheckout = async (req, res, next) => {
  const signature = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    return res.status(400).send(`Webhook error: ${error.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    try {
      await createBookingFromWebhook(event.data.object);
    } catch (err) {
      console.error('Error creating booking from webhook:', err);
      return res.status(500).json({ error: 'Booking creation failed' });
    }
  }

  res.status(200).json({ received: true });
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
