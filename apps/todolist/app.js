const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const clearCompletedButton = document.getElementById('clear-completed');
const saveButton = document.getElementById('save-todos');

const STORAGE_KEY = 'todolist_apps';
let todos = [];

function saveTodos() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
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
    doneButton.className = 'btn btn-success btn-sm';
    doneButton.textContent = todo.completed ? 'Αναίρεση' : 'Ολοκλήρωση';
    doneButton.addEventListener('click', () => {
      todo.completed = !todo.completed;
      renderTodos();
      saveTodos();
    });

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-warning btn-sm';
    editButton.textContent = 'Επεξεργασία';
    editButton.addEventListener('click', () => {
      const nextText = prompt('Επεξεργασία εργασίας:', todo.text);
      if (nextText === null) {
        return;
      }
      const trimmed = nextText.trim();
      if (!trimmed) {
        return;
      }
      todo.text = trimmed;
      renderTodos();
      saveTodos();
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'btn btn-danger btn-sm';
    deleteButton.textContent = 'Διαγραφή';
    deleteButton.addEventListener('click', () => {
      todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
      renderTodos();
      saveTodos();
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
  saveTodos();
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  renderTodos();
  saveTodos();
});

saveButton.addEventListener('click', () => {
  saveTodos();
  alert('Οι εργασίες αποθηκεύτηκαν.');
});

const savedTodos = sessionStorage.getItem(STORAGE_KEY);
if (savedTodos) {
  try {
    todos = JSON.parse(savedTodos);
  } catch {
    todos = [];
  }
}

renderTodos();
