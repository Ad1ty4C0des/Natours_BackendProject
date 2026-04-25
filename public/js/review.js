/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const submitReview = async (tourId, review, rating) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/tours/${tourId}/reviews`,
      data: {
        review,
        rating,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review submitted successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const editReview = async (reviewId, review, rating) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/reviews/${reviewId}`,
      data: {
        review,
        rating,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Review updated successfully!');
      window.setTimeout(() => {
        location.reload(true);
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const deleteReview = async (reviewId) => {
  try {
    await axios({
      method: 'DELETE',
      url: `/api/v1/reviews/${reviewId}`,
    });

    showAlert('success', 'Review deleted successfully!');
    window.setTimeout(() => {
      location.reload(true);
    }, 1500);
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
