const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const clearCompletedButton = document.getElementById('clear-completed');
const saveButton = document.getElementById('save-todos');

let todos = [];

// Load todos from sessionStorage if available
const savedTodos = sessionStorage.getItem('todos');
if (savedTodos) {
  try {
    todos = JSON.parse(savedTodos);
  } catch (e) {
    todos = [];
  }
}
// Save todos to sessionStorage
function saveTodosToSession() {
  sessionStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
  todoList.innerHTML = '';

  if (todos.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  todos.forEach((todo) => {
    const listItem = document.createElement('li');

    const text = document.createElement('span');
    text.className = `todo-text${todo.completed ? ' completed' : ''}`;
    text.textContent = todo.text;

    const actions = document.createElement('div');
    actions.className = 'actions';

    const doneButton = document.createElement('button');
    doneButton.type = 'button';
    doneButton.className = 'done-btn';
    doneButton.textContent = todo.completed ? 'Αναίρεση' : 'Ολοκλήρωση';
    doneButton.addEventListener('click', () => {
      todo.completed = !todo.completed;
      renderTodos();
      saveTodosToSession();
    });

    // Edit button
    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'edit-btn';
    editButton.textContent = 'Επεξεργασία';
    editButton.addEventListener('click', () => {
      const newText = prompt('Επεξεργασία εργασίας:', todo.text);
      if (newText !== null) {
        const trimmed = newText.trim();
        if (trimmed) {
          todo.text = trimmed;
          renderTodos();
          saveTodosToSession();
        }
      }
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Διαγραφή';
    deleteButton.addEventListener('click', () => {
      const confirmed = confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτή την εργασία;');
      if (confirmed) {
        todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
        renderTodos();
        saveTodosToSession();
      }
    });

    actions.append(doneButton, editButton, deleteButton);
    listItem.append(text, actions);
    todoList.appendChild(listItem);
  });
}

todoForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = todoInput.value.trim();
  if (!text) {
    return;
  }

  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  todoInput.value = '';
  todoInput.focus();
  renderTodos();
  saveTodosToSession();
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  renderTodos();
});

// Save button event
saveButton.addEventListener('click', () => {
  saveTodosToSession();
  alert('Οι εργασίες αποθηκεύτηκαν στο session!');
});

renderTodos();
