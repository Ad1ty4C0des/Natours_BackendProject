/* eslint-disable */
import { displayMap } from './mapbox';
import { login, logout, signup, forgotPassword, resetPassword } from './login';
import { udpateSettings } from './updateSettings';
import { bookTour } from './stripe';
import { showAlert } from './alerts';
import { submitReview, editReview, deleteReview } from './review';
import { toggleFavourite } from './favourite';
import { deleteResource } from './admin';

//DOM Elements
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');
const reviewForm = document.getElementById('review-form');
const ratingStars = document.querySelectorAll('.form__star');
const signupForm = document.querySelector('.form--signup');
const forgotPasswordForm = document.querySelector('.form--forgot-password');
const resetPasswordForm = document.querySelector('.form--reset-password');

//VALUES

//DELEGATION
if (mapBox) {
  mapboxgl.accessToken = mapBox.dataset.token;
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signup(name, email, password, passwordConfirm);
  });
}

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.querySelector('.btn--forgot-password');
    btn.textContent = 'Sending...';
    const email = document.getElementById('email').value;
    forgotPassword(email).then(() => {
      btn.textContent = 'Send reset link';
    });
  });
}

if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.querySelector('.btn--reset-password');
    btn.textContent = 'Resetting...';
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    const token = resetPasswordForm.dataset.token;
    resetPassword(password, passwordConfirm, token);
  });
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    udpateSettings(form, 'data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await udpateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password',
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

// =============================================
// TOUR BOOKING — Date picker + People counter
// =============================================
const tourDateSelect = document.getElementById('tour-date');
const numPeopleInput = document.getElementById('num-people');
const peopleMinus = document.getElementById('people-minus');
const peoplePlus = document.getElementById('people-plus');

// When a date is selected, update the max people allowed
if (tourDateSelect && numPeopleInput) {
  tourDateSelect.addEventListener('change', () => {
    const selectedDate = tourDateSelect.value;
    if (!selectedDate) {
      numPeopleInput.max = 1;
      numPeopleInput.value = 1;
      return;
    }

    const dates = JSON.parse(tourDateSelect.dataset.dates || '[]');
    const maxGroup = parseInt(tourDateSelect.dataset.maxGroup, 10) || 1;
    const dateObj = dates.find((d) => d.date === selectedDate);

    if (dateObj) {
      const spotsLeft = maxGroup - dateObj.participants;
      numPeopleInput.max = spotsLeft;
      numPeopleInput.value = Math.min(parseInt(numPeopleInput.value, 10), spotsLeft) || 1;
    }
  });
}

// +/- buttons for number of people
if (peopleMinus && numPeopleInput) {
  peopleMinus.addEventListener('click', () => {
    const current = parseInt(numPeopleInput.value, 10);
    if (current > 1) numPeopleInput.value = current - 1;
  });
}

if (peoplePlus && numPeopleInput) {
  peoplePlus.addEventListener('click', () => {
    const current = parseInt(numPeopleInput.value, 10);
    const max = parseInt(numPeopleInput.max, 10) || 1;
    if (current < max) numPeopleInput.value = current + 1;
  });
}

if (bookBtn)
  bookBtn.addEventListener('click', (e) => {
    const dateSelect = document.getElementById('tour-date');
    const startDate = dateSelect ? dateSelect.value : '';

    if (!startDate) {
      showAlert('error', 'Please select a start date before booking!');
      return;
    }

    const numPeople = parseInt(document.getElementById('num-people')?.value, 10) || 1;

    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId, startDate, numPeople);
  });

// Interactive star rating (tour detail page review form)
if (ratingStars.length > 0) {
  let selectedRating = 0;

  const highlightStars = (rating) => {
    ratingStars.forEach((star) => {
      const val = parseInt(star.dataset.value, 10);
      star.classList.toggle('form__star--active', val <= rating);
      star.classList.toggle('form__star--inactive', val > rating);
    });
  };

  ratingStars.forEach((star) => {
    star.addEventListener('click', () => {
      selectedRating = parseInt(star.dataset.value, 10);
      document.getElementById('review-rating').value = selectedRating;
      highlightStars(selectedRating);
    });

    star.addEventListener('mouseenter', () => {
      highlightStars(parseInt(star.dataset.value, 10));
    });

    star.addEventListener('mouseleave', () => {
      highlightStars(selectedRating);
    });
  });
}

// Review form submission (tour detail page)
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const tourId = reviewForm.dataset.tourId;
    const review = document.getElementById('review-text').value;
    const rating = parseInt(document.getElementById('review-rating').value, 10);

    if (!rating || rating < 1) {
      showAlert('error', 'Please select a star rating before submitting.');
      return;
    }

    document.querySelector('.btn--submit-review').textContent = 'Submitting...';
    submitReview(tourId, review, rating);
  });
}

// =============================================
// MY REVIEWS PAGE — Edit/Delete/Cancel handlers
// =============================================
const myReviewCards = document.querySelectorAll('.my-review-card');

if (myReviewCards.length > 0) {
  // Helper: setup star interaction within a specific card's edit area
  const setupEditStars = (card) => {
    const stars = card.querySelectorAll('.edit-rating-stars .form__star');
    const ratingInput = card.querySelector('.edit-rating-input');
    let selected = parseInt(ratingInput.value, 10);

    const highlight = (rating) => {
      stars.forEach((s) => {
        const v = parseInt(s.dataset.value, 10);
        s.classList.toggle('form__star--active', v <= rating);
        s.classList.toggle('form__star--inactive', v > rating);
      });
    };

    stars.forEach((star) => {
      star.addEventListener('click', () => {
        selected = parseInt(star.dataset.value, 10);
        ratingInput.value = selected;
        highlight(selected);
      });
      star.addEventListener('mouseenter', () => {
        highlight(parseInt(star.dataset.value, 10));
      });
      star.addEventListener('mouseleave', () => {
        highlight(selected);
      });
    });
  };

  myReviewCards.forEach((card) => {
    const reviewId = card.dataset.reviewId;
    const displayEl = card.querySelector('.my-review-card__display');
    const editEl = card.querySelector('.my-review-card__edit');
    const actionsEl = card.querySelector('.my-review-card__actions');
    const editBtn = card.querySelector('.btn--edit-review');
    const deleteBtn = card.querySelector('.btn--delete-review');
    const saveBtn = card.querySelector('.btn--save-review');
    const cancelBtn = card.querySelector('.btn--cancel-review');

    // Edit button — toggle to edit mode
    editBtn.addEventListener('click', () => {
      displayEl.style.display = 'none';
      actionsEl.style.display = 'none';
      editEl.style.display = 'block';
      setupEditStars(card);
    });

    // Cancel button — toggle back to display mode
    cancelBtn.addEventListener('click', () => {
      editEl.style.display = 'none';
      displayEl.style.display = 'block';
      actionsEl.style.display = 'flex';
    });

    // Save button — submit the edit
    saveBtn.addEventListener('click', () => {
      const newReview = card.querySelector('.edit-review-text').value;
      const newRating = parseInt(
        card.querySelector('.edit-rating-input').value,
        10,
      );

      if (!newRating || newRating < 1) {
        showAlert('error', 'Please select a star rating.');
        return;
      }

      saveBtn.textContent = 'Saving...';
      editReview(reviewId, newReview, newRating);
    });

    // Delete button — confirm and delete
    deleteBtn.addEventListener('click', () => {
      const confirmed = confirm(
        'Are you sure you want to delete this review? This cannot be undone.',
      );
      if (confirmed) {
        deleteBtn.textContent = 'Deleting...';
        deleteReview(reviewId);
      }
    });
  });
}

// =============================================
// FAVOURITE / LIKE TOUR — Heart button handler
// =============================================
const heartBtns = document.querySelectorAll('.heart-btn');

if (heartBtns.length > 0) {
  heartBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const tourId = btn.dataset.tourId;
      toggleFavourite(tourId, btn);
    });
  });
}

// =============================================
// ADMIN — Delete resource handler
// =============================================
const deleteBtns = document.querySelectorAll('.btn-delete-resource');

if (deleteBtns.length > 0) {
  deleteBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const resource = btn.dataset.resource;
      const id = btn.dataset.id;
      const confirmed = confirm(
        `Are you sure you want to delete this ${resource.slice(0, -1)}? This cannot be undone.`,
      );
      if (confirmed) {
        btn.closest('.manage-table__row').style.opacity = '0.5';
        deleteResource(resource, id);
      }
    });
  });
}

const alertMessage = document.querySelector('body').dataset.alert;
if (alertMessage) showAlert('success', alertMessage, 7);
