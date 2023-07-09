const settingsForm = document.getElementById('form__settings');
const settingsMessage = document.getElementById('message__settings');

settingsForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(settingsForm);
  const settingsData = Object.fromEntries(formData);

  try {
    const response = await fetch('/settings', {
      method: 'POST',
      body: JSON.stringify(settingsData),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok && response.status === 200) {
      const data = await response.json();
      const message = data.message;
      settingsMessage.textContent = message;
      document.location.replace('/user');
    } else if (response.status === 400) {
      const data = await response.json();
      const errorMessage = data.message;
      settingsMessage.textContent = errorMessage;
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
