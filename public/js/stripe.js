/* eslint-disable */
import { showAlert } from './alerts.js';
const bookBtn = document.getElementById('book-tour');

const stripe = Stripe(
  'pk_test_51ROgQwR2MLdmVeqdh6UCoA5H1Fp5sqDrNleru4qFPfFbHlfbOykjnKIFquiycuMfqRSh9OHOk8XGoq8LZFY67A8200pAWpxCi1'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const response = await fetch(
      `/api/v1/bookings/checkout-session/${tourId}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get checkout session');
    }

    const session = await response.json();

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.session.id, // Note: Changed from session.data.session.id
    });
  } catch (err) {
    console.log(err);
    if (bookBtn) {
      bookBtn.textContent = 'Book your tour now!';
    }

    showAlert('error', err.message); // Changed to err.message
  }
};
