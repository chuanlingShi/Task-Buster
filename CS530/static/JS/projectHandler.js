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
            const card = createCard(task.id, task.title, task.description);
            listBody.appendChild(card);
          }
        }
      }
    }
  };
  xhr.send();
});

addCardButtons.forEach(function (addCardButton) {
  addCardButton.addEventListener('click', function () {
    const cardId = Math.random().toString(36).substring(2, 15); // generate a random id
    const card = createCard(cardId, '', '');
    const listBody = addCardButton.parentNode.nextElementSibling;
    listBody.appendChild(card);
  });
});

function createCard(cardId, titleText, descriptionText) {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-id', cardId);
  card.setAttribute('draggable', true);

  const title = document.createElement('input');
  title.type = 'text';
  title.contenteditable = true;
  title.value = titleText;
  card.appendChild(title);

  const description = document.createElement('textarea');
  description.contenteditable = true;
  description.setAttribute('name', 'description');
  description.value = descriptionText;
  card.appendChild(description);

  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'Delete';
  deleteButton.classList.add('delete-button');
  card.appendChild(deleteButton);

  addEventListenersForCard(card, title, description, deleteButton);

  return card;
}

function addEventListenersForCard(card, title, description, deleteButton) {
  title.addEventListener('blur', () => updateCardInDatabase(card));
  description.addEventListener('input', debounce(() => updateCardInDatabase(card), 500));
  addDragAndDropEventListeners(card);
  deleteButton.addEventListener('click', () => deleteCard(card));
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

function deleteCard(card) {
  const cardId = card.getAttribute('data-id');
  card.remove();

  const xhr = new XMLHttpRequest();
  xhr.open('POST', '/delete-card', true);
  xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  xhr.onload = function () {
    if (this.status === 200) {
      console.log('Card deleted successfully!');
    }
  };
  xhr.send(JSON.stringify({ id: cardId }));
}

function addDragAndDropEventListeners(card) {
  card.addEventListener('dragstart', function (event) {
    event.dataTransfer.setData('text/plain', card.getAttribute('data-id'));
    event.dataTransfer.effectAllowed = 'move';
    card.classList.add('dragging');
  });

  card.addEventListener('dragend', function (event) {
    card.classList.remove('dragging');
  });

  const lists = document.querySelectorAll('.list');

  lists.forEach(function (list) {
    list.addEventListener('dragover', function (event) {
      event.preventDefault();
      event.dataTransfer.dropEffect = 'move';
      list.classList.add('drag-over');
    });

    list.addEventListener('dragleave', function (event) {
      list.classList.remove('drag-over');
    });

    list.addEventListener('drop', function (event) {
      event.preventDefault();
      const cardId = event.dataTransfer.getData('text/plain');
      const card = document.querySelector(`[data-id="${cardId}"]`);
      const oldList = card.parentNode;
      const newList = list.querySelector('.list-body');
      newList.appendChild(card);
      list.classList.remove('drag-over');

      // Update card status in the database
      updateCardInDatabase(card);
    });
  });
}