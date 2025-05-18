/* eslint-disable */
import { showAlert } from './alerts.js';

export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    // Create headers object
    const headers = {};

    // Only set Content-Type for JSON (password updates)
    if (type === 'password') {
      headers['Content-Type'] = 'application/json';
    }

    // Prepare the request body
    const body = type === 'password' ? JSON.stringify(data) : data;

    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body,
      credentials: 'include',
    });

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || 'Update failed');
    }

    if (responseData.status === 'success') {
      showAlert('success', `${type.toUpperCase()} Data updated successfully`);
      // Optional: Reload the page for photo updates to show changes
      if (type === 'data') {
        window.setTimeout(() => location.reload(), 1500);
      }
    }
  } catch (err) {
    showAlert('error', err.message);
  }
};
