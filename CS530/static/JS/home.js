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
                taskElement.innerHTML = ` <h3><i class="fas fa-solid fa-clipboard-list"></i> </h3> <h1>${task.title}</h1><p style = "font-size: 30px;">${task.description}</p>`;

                todoList.appendChild(taskElement);
            }
            taskListT.appendChild(todoList);

            // Add In Progress tasks
            const inprogressList = document.createElement('div');
            inprogressList.innerHTML = '';
            for (const task of tasks.inprogress) {
                const taskElement = document.createElement('div');
                taskElement.classList.add('user-notes');
                taskElement.innerHTML = `<h3><i class="fas fa-spinner"></i></h3> <h1>${task.title}</h1><p style = "font-size: 30px;">${task.description}</p>`;
                inprogressList.appendChild(taskElement);
            }
            taskListI.appendChild(inprogressList);

            // Add Done tasks
            const doneList = document.createElement('div');
            doneList.innerHTML = '';
            for (const task of tasks.done) {
                const taskElement = document.createElement('div');
                taskElement.classList.add('user-notes');
                taskElement.innerHTML = `<h2><i class="fas fa-thin fa-clipboard-check"></i></h2> <h1>${task.title}</h1><p style = "font-size: 30px;">${task.description}</p>`;
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
                taskElement.innerHTML = `<h3><i class="fas fa-spinner"></i></h3> <h1>${task.title}</h1><p style = "font-size: 30px;">${task.description}</p>`;
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




function updateTime() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var timeString = hours + ':' + minutes + ':' + seconds;
    document.getElementById('clock').innerHTML = timeString;
}

// Update the time every second
setInterval(updateTime, 1000);
  





// function to draw the calendar on the canvas
function drawCalendar() {

    // get canvas element and context
    const canvas = document.getElementById("calendar");
    const ctx = canvas.getContext("2d");

    // set up some constants for styling the calendar
    const CELL_SIZE = 50;
    const CELL_PADDING = 5;
    const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const MONTHS = [
      "January", "February", "March", "April", "May", "June", "July",
      "August", "September", "October", "November", "December"
    ];

    // set up some variables for tracking the current date and selected date
    let currentDate = new Date();
    let selectedDate = new Date();

    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // draw month and year
    ctx.fillStyle = "#fff";
    ctx.font = "bold 40px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(MONTHS[currentDate.getMonth()] + " " + currentDate.getFullYear(), canvas.width/2, 50);

    // draw weekdays
    ctx.font = "bold 20px sans-serif";
    ctx.textAlign = "center";
    for (let i = 0; i < WEEKDAYS.length; i++) {
        ctx.fillText(WEEKDAYS[i], (i+0.5)*CELL_SIZE, 100);
    }

    // get first day of month and number of days in month
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const numDays = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

    // draw each day in month
    ctx.font = "16px sans-serif";
    ctx.textAlign = "center";
    for (let i = 0; i < numDays; i++) {
        const day = i + 1;
        const x = ((i + firstDay) % 7 + 0.5) * CELL_SIZE;
        const y = Math.floor((i + firstDay) / 7) * CELL_SIZE + 140;

        // highlight current day
        if (currentDate.getFullYear() === selectedDate.getFullYear() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            day === selectedDate.getDate()) {
        ctx.fillStyle = "#69c";
        ctx.fillRect(x - CELL_SIZE/2, y - CELL_SIZE/2, CELL_SIZE, CELL_SIZE);
        ctx.fillStyle = "#fff";
        } else if (currentDate.getFullYear() === currentDate.getFullYear() &&
               currentDate.getMonth() === currentDate.getMonth() &&
               day === currentDate.getDate()) {
            ctx.fillStyle = "#eee";
            ctx.fillRect(x - CELL_SIZE/2, y - CELL_SIZE/2, CELL_SIZE, CELL_SIZE);
            ctx.fillStyle = "#fff";
        } else {
            ctx.fillStyle = "#fff";
        }

        ctx.fillText(day, x, y);
    }
}

