/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const deleteResource = async (resource, id) => {
  try {
    await axios({
      method: 'DELETE',
      url: `/api/v1/${resource}/${id}`,
    });

    showAlert('success', `${resource.slice(0, -1)} deleted successfully!`);
    window.setTimeout(() => {
      location.reload();
    }, 1500);
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Error deleting resource');
  }
};
