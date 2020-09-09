'use strict'; //only for modern browsers

const addTaskField = document.getElementById('taskTitle');
const addTaskButton = document.getElementById('addTaskBtn');
const tasksList = document.getElementById('tasksList');
let tasks = [];

function generateId() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}


function addTask() {
    if (addTaskField.value) {
        const newTask = {
            id: generateId(),
            title: addTaskField.value,
            checked: false
        }
        tasks.push(newTask);
        // save to localStorage
        syncTasksToLocalStorage();
        renderTasks();
        // empty task text field
        addTaskField.value = '';
    }
}

function renderTasks() {
    let htmlTask = '';
    // reverse sorting array
    tasks.sort((a, b) => (a.title > b.title) ? -1 : 1);
    tasks.forEach((item) => {
        htmlTask += `
          <li id="task_${item.id}" ${item.checked ? 'class="task-completed"' : ''}>
            <span class="task-complete">
              <input id="checkbox_${item.id}" type="checkbox" onclick="taskCompleted('${item.id}')" ${item.checked ? 'checked' : ''}/>
            </span>
            <div class="task-title" id="task_title_${item.id}" contenteditable="true" aria-multiline="true"  onkeydown="syncUItoLocalSorage('${item.id}')">${item.title}</div>
            <div role="img" class="remove-button" title="remove" onclick="removeTask('${item.id}')"></div>
          </li>	
	  `;
    });
    tasksList.innerHTML = htmlTask;
}

function syncTasksToLocalStorage() {
    window.localStorage.setItem('taskList', JSON.stringify(tasks));
}


function taskCompleted(taskId) {
    const taskCheckBox = document.getElementById('checkbox_' + taskId);
    const task = document.getElementById('task_' + taskId);
    const checkedTaskIndex = tasks.findIndex(x => x.id === taskId);
    if (taskCheckBox.checked === true) {
        task.classList.add('task-completed');
        tasks[checkedTaskIndex].checked = true;
    } else {
        task.classList.remove('task-completed');
        tasks[checkedTaskIndex].checked = false;
    }
    // sync complete action with localStorage
    syncTasksToLocalStorage();
}

function removeTask(taskId) {
    if (confirm("Are you sure remove the task?") === true) {
        tasks = tasks.filter(x => x.id !== taskId);
        document.getElementById('task_' + taskId).remove();
        syncTasksToLocalStorage();
    }
}


function syncUItoLocalSorage(taskId) {
    const editedTaskIndex = tasks.findIndex(x => x.id === taskId);
    const taskEdited = document.getElementById('task_title_' + taskId);
    tasks[editedTaskIndex].title = taskEdited.textContent;
    syncTasksToLocalStorage();
}


// load tasks from localStorage
if (window.localStorage.getItem('taskList')) {
    tasks = JSON.parse(window.localStorage.getItem('taskList'));
    renderTasks();
}
// event listeners
addTaskButton.addEventListener('click', addTask);
addTaskField.addEventListener('keydown', event => {
    if (event.key === "Enter") {
        addTask();
    }
});
