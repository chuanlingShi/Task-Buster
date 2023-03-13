        const addCardButtons = document.querySelectorAll('.add-card');

        addCardButtons.forEach(function(addCardButton) {
        addCardButton.addEventListener('click', function() {
        const card = document.createElement('div');
        card.classList.add('card');

        const title = document.createElement('input');
        title.type = 'text';
        title.contenteditable = true;
        card.appendChild(title);

        const description = document.createElement('textarea');
        description.contenteditable = true;
        description.setAttribute('name', 'description');
        card.appendChild(description);

        title.value = '';
        description.value = '';

        const listBody = addCardButton.parentNode.nextElementSibling;
        listBody.appendChild(card);

        let timeoutId; // define a variable to hold the timeout ID

        // add event listener to submit the form data to the server when the input fields are blurred
        title.addEventListener('blur', function() {
          clearTimeout(timeoutId); // clear the previous timeout
          timeoutId = setTimeout(function() {
            const formData = {
              title: title.value,
              description: description.value,
              status: listBody.parentNode.querySelector('.list-title').textContent
            };

            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/save-card', true);
            xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
            xhr.onload = function() {
              if (this.status === 200) {
                console.log('Card created successfully!');
              }
            };
            xhr.send(JSON.stringify(formData));
            }, 500); // wait for 500 milliseconds before sending the request
        });
        });
        });
