/* eslint-disable */

export const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
};

// type is "success" or "error"
export const showAlert = (type, msg) => {
  hideAlert();

  // const markup = `<div class="alert alert--${type}">${msg}</div>`;
  // console.log('Show Alert: ', type, ' : ', msg);
  // document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  // window.setTimeout(hideAlert, 5000);

  // Safer approach
  const div = document.createElement('div');
  div.className = `alert alert--${type}`;
  div.textContent = msg; // Automatically escapes HTML
  document.body.insertAdjacentElement('afterbegin', div);
  window.setTimeout(hideAlert, 5000);
};
