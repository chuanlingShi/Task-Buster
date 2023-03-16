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
            todoList.innerHTML = '<h2>To Do</h2>';
            for (const task of tasks.todo) {
                const taskElement = document.createElement('div');
                taskElement.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
                todoList.appendChild(taskElement);
            }
            taskListT.appendChild(todoList);

            // Add In Progress tasks
            const inprogressList = document.createElement('div');
            inprogressList.innerHTML = '<h2>In Progress</h2>';
            for (const task of tasks.inprogress) {
                const taskElement = document.createElement('div');
                taskElement.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
                inprogressList.appendChild(taskElement);
            }
            taskListI.appendChild(inprogressList);

            // Add Done tasks
            const doneList = document.createElement('div');
            doneList.innerHTML = '<h2>Done</h2>';
            for (const task of tasks.done) {
                const taskElement = document.createElement('div');
                taskElement.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
                doneList.appendChild(taskElement);
            }
            taskListD.appendChild(doneList);
        });
}

loadTasks(); // call the function to load the tasks when the page loads
