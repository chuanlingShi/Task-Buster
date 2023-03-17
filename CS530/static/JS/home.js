function loadTasks() {
    fetch('/get-Mytasks')
        .then(response => response.json())
        .then(tasks => {
            const taskListT = document.getElementById('task-listT');
            taskListT.innerHTML = '';
            const taskListI = document.getElementById('task-listI');
            taskListI.innerHTML = '';
            const taskListD = document.getElementById('task-listD');
            taskListD.innerHTML = '';

            // Add To Do tasks
            const todoList = document.createElement('div');
            todoList.innerHTML = '';
            for (const task of tasks.todo) {
                const taskElement = document.createElement('div');
                taskElement.classList.add('user-notes');
                taskElement.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
                todoList.appendChild(taskElement);
            }
            taskListT.appendChild(todoList);

            // Add In Progress tasks
            const inprogressList = document.createElement('div');
            inprogressList.innerHTML = '';
            for (const task of tasks.inprogress) {
                const taskElement = document.createElement('div');
                taskElement.classList.add('user-notes');
                taskElement.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
                inprogressList.appendChild(taskElement);
            }
            taskListI.appendChild(inprogressList);

            // Add Done tasks
            const doneList = document.createElement('div');
            doneList.innerHTML = '';
            for (const task of tasks.done) {
                const taskElement = document.createElement('div');
                taskElement.classList.add('user-notes');
                taskElement.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
                doneList.appendChild(taskElement);
            }
            taskListD.appendChild(doneList);
        });
}

loadTasks(); // call the function to load the tasks when the page loads

function loadNTasks() {
    fetch('/get-Mytasks')
        .then(response => response.json())
        .then(tasks => {
            const taskListI = document.getElementById('task-listN');
            taskListI.innerHTML = '';
  
            // Add In Progress tasks
            const inprogressList = document.createElement('div');
            var inprogressListT = '<h2>Task that are still need to be done</h2>'
            var inprogressListTT = '<h3>In Progress:</h3>'
            inprogressList.innerHTML = inprogressListT + inprogressListTT;
            for (const task of tasks.inprogress) {
                const taskElement = document.createElement('div');
                taskElement.classList.add('user-notes');
                taskElement.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
                inprogressList.appendChild(taskElement);
            }
            taskListI.appendChild(inprogressList);
            
        });
}

loadNTasks(); // call the function to load the tasks when the page loads



function loadNote() {

    // make an AJAX request to the Flask route that fetches the notes from the database
    fetch('/get-notes')
    .then(response => response.json())
    .then(notes => {
        /// populate the note list with the notes
        const noteList = document.getElementById('note-list');
        noteList.innerHTML = '';
        for (const note of notes) {
            const div = document.createElement('div');
            div.classList.add('user-notes');
            div.innerText = note.content;
            noteList.appendChild(div);
        }
    });
}

loadNote(); // call the function to load the tasks when the page loads


// function loadNote() {
//     // make an AJAX request to the Flask route that fetches the notes from the database
//     fetch('/get-notes')
//     .then(response => response.json())
//     .then(users => {
//         // populate the note list with the notes for each user
//         const noteList = document.getElementById('note-list');
//         noteList.innerHTML = '';
//         for (const user of users) {
//             const userDiv = document.createElement('div');
//             userDiv.classList.add('user-notes');
            
//             const notesList = document.createElement('ul');
//             for (const note of user.notes) {
//                 const li = document.createElement('li');
//                 li.innerText = note.content;
//                 notesList.appendChild(li);
//             }
//             userDiv.appendChild(notesList);
//             noteList.appendChild(userDiv);
//         }
//     });
// }

// loadNote();
