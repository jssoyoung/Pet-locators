const userContainer = document.querySelectorAll('.container__user');
const messageContainer = document.querySelectorAll('.container__messages');
let lastOpenedConversation = localStorage.getItem('lastOpenedConversation');

if (userContainer) {
  for (const container of userContainer) {
    container.addEventListener('click', () => {
      const conversation = container.dataset.conversationid;
      for (const container of messageContainer) {
        container.classList.add('hidden');
      }
      const matchingContainer = document.querySelector(
        `[data-conversationIdMessage="${conversation.toString()}"]`
      );
      if (matchingContainer) {
        matchingContainer.classList.remove('hidden');
        lastOpenedConversation = conversation.toString();
        localStorage.setItem('lastOpenedConversation', lastOpenedConversation);
      }
    });
    if (
      lastOpenedConversation &&
      container.dataset.conversationid === lastOpenedConversation
    ) {
      container.click();
    }
  }
}
