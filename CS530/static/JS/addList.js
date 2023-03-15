const addListButton = document.createElement('button');
addListButton.classList.add('add-list-button');
addListButton.textContent = 'Add List';
document.querySelector('.list-column').appendChild(addListButton);

const colors = [
  'rgb(46, 215, 216)',
  'rgb(0, 170, 255)',
  'rgb(161, 121, 242)',
  'rgb(255, 95, 95)',
  'rgb(255, 168, 95)',
  'rgb(255, 235, 59)'
];

addListButton.addEventListener('click', function () {
  const listTitle = prompt('Enter the list title:');
  if (listTitle) {
    const list = createList(listTitle);
    addListButton.insertAdjacentElement('beforebegin', list);
  }
});

function createList(titleText) {
  const list = document.createElement('div');
  list.classList.add('list');

  const listHeader = document.createElement('div');
  listHeader.classList.add('list-header');
  listHeader.style.height = '60px';
  listHeader.style.alignItems = 'center';
  listHeader.style.paddingLeft = '15px';
  listHeader.style.paddingRight = '15px';
  listHeader.style.borderRadius = '4px';
  listHeader.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
  list.appendChild(listHeader);

  const listTitle = document.createElement('h2');
  listTitle.classList.add('list-title');
  listTitle.textContent = titleText;
  listHeader.appendChild(listTitle);

  const addCardButton = document.createElement('button');
  addCardButton.classList.add('add-card');
  addCardButton.textContent = '+ Add a card';
  listHeader.appendChild(addCardButton);

  const listBody = document.createElement('div');
  listBody.classList.add('list-body');
  list.appendChild(listBody);

  addCardButton.addEventListener('click', function () {
    const cardId = Math.random().toString(36).substring(2, 15); // generate a random id
    const card = createCard(cardId, '', '');
    listBody.appendChild(card);
  });

  addDragAndDropEventListeners(list);

  return list;
}
