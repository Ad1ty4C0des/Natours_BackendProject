/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe(
  'pk_test_51TLmZADbmknP91hYFHrIFb9zZb0tKy3Ss0S8m3nxsF2xqG7PWA657qWalgaFmqFa8xJuE3qrFIOExQeyfdiQ2JY700bGQvZVIc',
);

export const bookTour = async (tourId) => {
  try {
    //1. Get the checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    //2. Create checkout from + charge the credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
