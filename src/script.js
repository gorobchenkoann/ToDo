// ToDo Class
class Todo {
  constructor(title, comment) {
    this.title = title;
    this.comment = comment;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}

// UI Class
class UI {
  static DisplayTodos() {   
    const todos = Store.getItems();
    todos.forEach(todo => UI.AddTodo(todo));    
  }
  
  static AddTodo(todo) {
    let list = document.querySelector('.todos'); 
    let card = document.createElement('div');
    
    card.className = 'card mb-3';
    card.dataset.id = todo.id;
    
    if (todo.comment !== undefined && todo.comment !== '') {
      card.innerHTML = `
        <div class="card-header full d-flex justify-content-between align-items-center">
          <span>
            ${todo.title}            
          </span>
          <i class="fas fa-caret-down"></i>
        </div>
        <div class="card-body d-none">${todo.comment}</div>

        <button class="btn-danger remove ">
          <i class="fas fa-times"></i>
        </button>
      `;
    } else {
      card.innerHTML = `
        <div class="card-header d-flex justify-content-between">
          <span>${todo.title}</span>          
        </div>
        <button class="btn-danger remove">
          <i class="fas fa-times"></i>
        </button>
      `;
    } 
    
    list.appendChild(card);  
  }
  
  static ClearInputs() {
    const title = document.querySelector('#title').value = '';
    const comment = document.querySelector('#comment').value = '';
  }
  
  static HandleTodoClick(item) {
    if (item.classList.contains('remove') || item.parentElement.classList.contains('remove')) {
      let parent = findClosest(item, 'card');
      let id = parent.dataset.id;
      parent.remove();
      
      // Show success alert
      let message = 'ToDo removed!'
      UI.ShowAlert(message, 'success');  
      
      // Remove todo from localstorage
      Store.removeItem(id);
      
    } else if (item.classList.contains('card-header') || item.parentElement.classList.contains('card-header')) {
      let card = findClosest(item, 'card');
      let cardBody = card.querySelector('.card-body');
      if (cardBody) {
        cardBody.classList.contains('d-none') 
        ? cardBody.classList.remove('d-none')
        : cardBody.classList.add('d-none');
      }
    }
  }
  
  static ShowAlert(message, cls, action=null) {
    let alert = document.querySelector('.alert');
    let div = document.createElement('div');
    let form = document.querySelector('.todo-form');
    let formParent = form.parentElement;
    
    div.className = `w-50 alert alert-${cls} text-center`;
    div.append(document.createTextNode(message));
    formParent.insertBefore(div, form);
    
    if (action === 'add') {
      form.querySelector('button').disabled = true;
    }    
    
    setTimeout(() => {
      div.remove();
      if (action === 'add') {
        form.querySelector('button').disabled = false;
      }      
    }, 1500)
  }
}

// Storage Class
class Store {
  static getItems() {
    let storedItems;
    if (localStorage.getItem('todos') === null) {
      storedItems = [];
    } else {
      storedItems = JSON.parse(localStorage.getItem('todos'));
    }
    
    return storedItems;
  }
  
  static addItem(item) {
    const items = Store.getItems();
    items.push(item);
    localStorage.setItem('todos', JSON.stringify(items));
  }
  
  static removeItem(id) {
    const items = Store.getItems();
    
    items.forEach((el, index) => {
      if (el.id === id) {
        items.splice(index, 1);
      }
    });
    
    localStorage.setItem('todos', JSON.stringify(items));
  }
}

// Event: Display Todos
document.addEventListener('DOMContentLoaded', UI.DisplayTodos);

// Event: Save Todo
let form = document.querySelector('.todo-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  
  // Get form values
  const title = document.querySelector('#title').value;
  const comment = document.querySelector('#comment').value;
  
  // Validate
  if (title !== '') {
    // Initiate todo
    const todo = new Todo(title, comment);      
    
    // Show todo
    UI.AddTodo(todo);
    
    // Add todo to localstorage
    Store.addItem(todo);
    
    // Show success alert
    let message = 'ToDo added!'
    UI.ShowAlert(message, 'success', 'add');

    // Clear inputs values
    UI.ClearInputs();
  } else {
    // Show success alert
    let message = 'Title is required field';
    UI.ShowAlert(message, 'danger', 'add');
  }  
  
});

// Event: Handle Todo Click
let list = document.querySelector('.todos');
list.addEventListener('click', e => {
  UI.HandleTodoClick(e.target);
});

// Get closest parent element with class
// https://stackoverflow.com/a/22119674
function findClosest(el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}