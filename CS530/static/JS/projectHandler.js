const addCardBtn = document.getElementById('add-card');
addCardBtn.addEventListener('click', function() {
  // create new card
  const card = document.createElement('div');
  card.classList.add('card');

  // create new editable p element
  const editableP = document.createElement('p');
  editableP.setAttribute('contenteditable', 'true');

  // add editable p to card
  card.appendChild(editableP);

  // add card to list body
  const listBody = this.parentNode.parentNode.querySelector('.list-body');
  listBody.appendChild(card);
});
