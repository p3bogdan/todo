const form = document.querySelector("form");
const taskList = document.querySelector("#task-list");

function addTask(task) {
  const listItem = document.createElement('li');
  listItem.innerHTML = `<input type="checkbox" /> <span>${task}</span> <button>Delete</button>`;
  taskList.appendChild(listItem);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const input = document.querySelector('#task-input');
  const task = input.value;
  if (task === '') {
    alert("Input field is empty");
  } else {
    addTask(task);
    addTaskToServer(task);
    input.value = '';
    console.log(task);
  }
});

taskList.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const listItem = event.target.parentElement;
    const task = listItem.querySelector('span').textContent;
    deleteTaskFromServer(task);
    taskList.removeChild(listItem);
  }
});

// Fetch and display tasks from the server
function fetchTasksFromServer() {
  fetch('http://localhost:3000/get-tasks')
    .then(response => response.json())
    .then(data => {
      data.forEach(task => {
        addTask(task.value);
      });
    })
    .catch(error => {
      console.error('Error fetching tasks from server:', error);
    });
}

// Add task to the server
function addTaskToServer(task) {
  fetch('http://localhost:3000/add-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ task: task })
  })
    .then(response => {
      if (response.ok) {
        console.log('Task added to server successfully');
      } else {
        console.error('Error adding task to server');
      }
    })
    .catch(error => {
      console.error('Error adding task to server:', error);
    });
}

// Delete task from the server
function deleteTaskFromServer(task) {
  fetch('http://localhost:3000/delete-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ task: task })
  })
    .then(response => {
      if (response.ok) {
        console.log('Task deleted from server successfully');
      } else {
        console.error('Error deleting task from server');
      }
    })
    .catch(error => {
      console.error('Error deleting task from server:', error);
    });
}

// Fetch and display tasks when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchTasksFromServer();
});
