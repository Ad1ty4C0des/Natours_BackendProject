/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51TLmZADbmknP91hYFHrIFb9zZb0tKy3Ss0S8m3nxsF2xqG7PWA657qWalgaFmqFa8xJuE3qrFIOExQeyfdiQ2JY700bGQvZVIc',
);

export const bookTour = async (tourId, startDate, numPeople = 1) => {
  try {
    //1. Get the checkout session from API
    const session = await axios(
      `/api/v1/bookings/checkout-session/${tourId}?startDate=${startDate}&numPeople=${numPeople}`,
    );
    //2. Redirect to Stripe-hosted checkout page
    window.location.assign(session.data.session.url);
  } catch (err) {
    console.log(err);
    showAlert('error', err.response?.data?.message || 'Something went wrong!');
  }
};
