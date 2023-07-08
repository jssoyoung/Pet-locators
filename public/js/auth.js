// Grab the form elements:
const loginForm = document.getElementById('form__login');
const signupForm = document.getElementById('form__signup');

// Add event listener to login form:
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  // Use FormData to grab the form data:
  // Fyi, FormData is a built-in browser API that allows us to grab the form data:
  const formData = new FormData(loginForm);
  const loginData = Object.fromEntries(formData);

  // Send a POST request to the server with the form data:
  try {
    const response = await fetch('/user/login', {
      method: 'POST',
      body: JSON.stringify(loginData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // If the response is ok, grab the data from the response and display the message:
    // It also checks for any errors and displays the error message:
    if (response.ok) {
      const data = await response.json();
      const message = data.message;
      document.getElementById('message__login').textContent = message;

      if (response.status === 200) {
        window.location.href = '/';
      }
    } else if (response.status === 400 || response.status === 404) {
      const data = await response.json();
      const errorMessage = data.Message;
      document.getElementById('message__login').textContent = errorMessage;
    } else {
      console.error('Error:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Add event listener to signup form:
signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(signupForm);
  const signupData = Object.fromEntries(formData);

  // Send a POST request to the server with the form data:
  try {
    const response = await fetch('/user/signup', {
      method: 'POST',
      body: JSON.stringify(signupData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // If the response is ok, grab the data from the response and display the message:
    // It also checks for any errors and displays the error message:
    if (response.ok) {
      const data = await response.json();
      const message = data.message;
      document.getElementById('message__signup').textContent = message;

      if (response.status === 200) {
        window.location.href = '/';
      }
    } else if (
      response.status === 400 ||
      response.status === 404 ||
      response.status === 409 ||
      response.status === 500
    ) {
      const data = await response.json();
      const errorMessage = data.Message;
      document.getElementById('message__signup').textContent = errorMessage;
    } else {
      console.error('Error:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
