const deleteCommentForms = document.querySelectorAll('.form__deleteComment');
const postCommentForm = document.getElementById('form__postComment');

for (const commentForm of deleteCommentForms) {
  commentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(commentForm);
    const commentData = Object.fromEntries(formData);

    try {
      const response = await fetch('/comment', {
        method: 'DELETE',
        body: JSON.stringify(commentData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const message = data.message;
        document.getElementById('message__comment').textContent = message;
      }
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (err) {}
  });
}

postCommentForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(postCommentForm);
  const commentData = Object.fromEntries(formData);
  try {
    const response = await fetch('/comment', {
      method: 'POST',
      body: JSON.stringify(commentData),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      const message = data.message;
      document.getElementById('message__comment').textContent = message;
      if (response.status === 200) {
        window.location.href = data.redirectUrl;
      }
    }
  } catch (err) {}
});
