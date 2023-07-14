const form = document.querySelector("form");
const taskList = document.querySelector("#task-list")





function addTask(task) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<input type="checkbox" /> <span>${task}</span> <button>Delete</button>`;
    taskList.appendChild(listItem);
}


form.addEventListener('submit', (event) =>{
    event.preventDefault();
    const input = document.querySelector('#task-input');
    const task = input.value;
    if(task === ''){
        alert("Input field is empty");
    }else{
        addTask(task);
        input.value='';
        console.log(task);
    }            
})

taskList.addEventListener('click', (event)=> {
    if(event.target.tagName === 'BUTTON'){
        const listItem = event.target.parentElement;
        taskList.removeChild(listItem);
    }
})