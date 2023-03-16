function loadTasks() {
    fetch('/get-Mytasks')
        .then(response => response.json())
        .then(tasks => {
            const taskList = document.getElementById('task-list');
            taskList.innerHTML = '';

            for (const id in tasks) {
                const task = tasks[id];
                const taskElement = document.createElement('div');
                taskElement.innerHTML = `<h3>${task.title}</h3><p>${task.description}</p>`;
                taskList.appendChild(taskElement);
            }
        });
}

loadTasks(); // call the function to load the tasks when the page loads



