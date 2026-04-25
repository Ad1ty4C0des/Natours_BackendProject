/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const toggleFavourite = async (tourId, heartEl) => {
  try {
    const res = await axios({
      method: 'POST',
      url: `/api/v1/favourites/toggle/${tourId}`,
    });

    if (res.data.status === 'success') {
      const isFav = res.data.data.favourited;
      heartEl.classList.toggle('heart--active', isFav);
      heartEl.classList.toggle('heart--inactive', !isFav);
      showAlert('success', isFav ? 'Added to favourites!' : 'Removed from favourites');
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Please log in to like tours');
  }
};
