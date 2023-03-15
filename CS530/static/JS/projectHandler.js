const addCardButtons = document.querySelectorAll('.add-card');
window.addEventListener('DOMContentLoaded', function () {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/get-tasks');
  xhr.onload = function () {
    if (this.status === 200) {
      const tasks = JSON.parse(this.responseText);
      const listBodies = document.querySelectorAll('.list-body');
      for (let i = 0; i < listBodies.length; i++) {
        const listBody = listBodies[i];
        const status = listBody.parentNode.querySelector('.list-title').textContent;
        if (status in tasks) {
          for (let j = 0; j < tasks[status].length; j++) {
            const task = tasks[status][j];
            const card = document.createElement('div');
            card.classList.add('card');
            card.setAttribute('data-id', task.id);

            const title = document.createElement('input');
            title.type = 'text';
            title.contenteditable = true;
            title.value = task.title;
            card.appendChild(title);

            const description = document.createElement('textarea');
            description.contenteditable = true;
            description.setAttribute('name', 'description');
            description.value = task.description;
            card.appendChild(description);

            listBody.appendChild(card);

            // Add event listeners for existing cards
            addEventListenersForCard(card, title, description);
          }
        }
      }
    }
  };
  xhr.send();
});

addCardButtons.forEach(function (addCardButton) {
  addCardButton.addEventListener('click', function () {
    // ... (Existing code for creating a new card)

    // Add event listeners for new cards
    addEventListenersForCard(card, title, description);
  });
});

function addEventListenersForCard(card, title, description) {
  title.addEventListener('blur', () => updateCardInDatabase(card));
  description.addEventListener('input', debounce(() => updateCardInDatabase(card), 500));
}

function updateCardInDatabase(card) {
  const formData = {
    id: card.getAttribute('data-id'),
    title: card.querySelector('input[type="text"]').value,
    description: card.querySelector('textarea[name="description"]').value,
    status: card.parentNode.parentNode.querySelector('.list-title').textContent
  };

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/save-card', true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onload = function () {
    if (this.status === 200) {
      console.log('Card updated successfully!');
    }
  };
  xhr.send(JSON.stringify(formData));
}

function debounce(fn, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}