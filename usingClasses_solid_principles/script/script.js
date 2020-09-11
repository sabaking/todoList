'use strict';

class Task {
    constructor(title) {
        this.id = this.generateId();
        this.title = title;
        this.isCompleted = false;
    }

    generateId() {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }

}

class TaskList {
    constructor(tasks) {
        this.tasks = tasks || [];
    }

    getTasks() {
        return this.tasks;
    }

    addTask(task) {
        this.tasks.push(task);
        return this;
    }

    findIndexByTaskId(taskId) {
        return this.tasks.findIndex(x => x.id === taskId);
    }

    editTask(taskId, title) {
        const editedTaskIndex = this.findIndexByTaskId(taskId);
        this.tasks[editedTaskIndex].title = title;
        return this;
    }

    removeTask(taskId) {
        this.tasks = this.tasks.filter(x => x.id !== taskId);
        return this;
    }

    completedTaskToggle(taskId) {
        const completedTaskIndex = this.findIndexByTaskId(taskId);
        this.tasks[completedTaskIndex].isCompleted = false;
        return this;
    }

    unCompletedTaskToggle(taskId) {
        const completedTaskIndex = this.findIndexByTaskId(taskId);
        this.tasks[completedTaskIndex].isCompleted = true;
        return this;
    }

    loadFromStorage() {
        this.tasks = JSON.parse(window.localStorage.getItem('taskList'));
        return this;
    }

    saveToStorage() {
        window.localStorage.setItem('taskList', JSON.stringify(this.tasks));
        return this;
    }
}

class OutputRender {
    constructor(tasks) {
        this.tasks = tasks || [];
    }

    setTasks(tasksArray) {
        this.tasks = tasksArray;
    }

    toHTML() {
        let htmlTasks = '';
        // sorting array
        this.tasks.sort((a, b) => (a.title > b.title) ? 1 : -1);
        this.tasks.forEach((item) => {
            htmlTasks += `
              <li id="${item.id}" ${item.isCompleted ? 'class="task-completed"' : ''}>
                  <input class="checkbox-task-completed" type="checkbox" ${item.isCompleted ? 'checked' : ''}/>
                <div class="task-title" contenteditable="true" aria-multiline="true">${item.title}</div>
                <div role="img" class="remove-button" title="remove"></div>
              </li>`;
        });
        return htmlTasks;
    }

    addTasksEvents() {
        // attach remove events
        const removeButtons = document.querySelectorAll('.remove-button');
        for (const removeButton of removeButtons) {
            removeButton.addEventListener('click', event => {
                if (confirm("Are you sure remove the task?") === true) {
                    event.preventDefault();
                    const liParent = event.target.parentNode;
                    taskList.removeTask(liParent.id).saveToStorage();
                    liParent.remove();
                }
            });
        }
        // edit tasks
        const editTaskDivs = document.querySelectorAll('.task-title');
        for (const editTaskDiv of editTaskDivs) {
            editTaskDiv.addEventListener('keyup', event => {
                const liParent = event.target.parentNode;
                taskList.editTask(liParent.id, editTaskDiv.textContent).saveToStorage();
            });
        }

        // check completed
        const checkboxTasksCompleted = document.querySelectorAll('.checkbox-task-completed');
        for (const checkboxTaskCompleted of checkboxTasksCompleted) {
            checkboxTaskCompleted.addEventListener('click', event => {
                const liParent = event.target.parentNode;
                if (event.target.checked === true) {
                    liParent.classList.add('task-completed');
                    taskList.unCompletedTaskToggle(liParent.id).saveToStorage();
                } else {
                    liParent.classList.remove('task-completed');
                    taskList.completedTaskToggle(liParent.id).saveToStorage();
                }
            });
        }
        return this;
    }
}


const tasksField = document.getElementById('tasksList');
const addTaskField = document.getElementById('taskTitle');
const addTaskButton = document.getElementById('addTaskBtn');

const taskList = new TaskList();
const render = new OutputRender();

// load tasks from localStorage
if (window.localStorage.getItem('taskList')) {
    render.setTasks(taskList.loadFromStorage().getTasks());
    tasksField.innerHTML = render.toHTML();
    render.addTasksEvents();
}

let newTaskAction = (event) => {
    if (addTaskField.value) {
        // mb escapeHTML if needed  for addTaskField.value
        taskList.addTask(new Task(addTaskField.value)).saveToStorage();
        render.setTasks(taskList.getTasks());
        tasksField.innerHTML = render.toHTML();
        render.addTasksEvents();
        addTaskField.value = '';
    }
}


// event listeners
addTaskButton.addEventListener('click', event => {
    event.preventDefault();
    newTaskAction(event);
});
addTaskField.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        newTaskAction(event);
    }
});


