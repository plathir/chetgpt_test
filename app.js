const STORAGE_KEY = 'todo-list-items';

const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const clearCompletedButton = document.getElementById('clear-completed');

function loadTodos() {
  try {
    const storedTodos = localStorage.getItem(STORAGE_KEY);
    if (!storedTodos) {
      return [];
    }

    const parsedTodos = JSON.parse(storedTodos);
    if (!Array.isArray(parsedTodos)) {
      return [];
    }

    return parsedTodos
      .filter((todo) => todo && typeof todo.text === 'string')
      .map((todo) => ({
        id: String(todo.id || createTodoId()),
        text: todo.text,
        completed: Boolean(todo.completed),
      }));
  } catch {
    return [];
  }
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createTodoId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

let todos = loadTodos();

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
      saveTodos();
      renderTodos();
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Διαγραφή';
    deleteButton.addEventListener('click', () => {
      todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
      saveTodos();
      renderTodos();
    });

    actions.append(doneButton, deleteButton);
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
    id: createTodoId(),
    text,
    completed: false,
  });

  todoInput.value = '';
  todoInput.focus();
  saveTodos();
  renderTodos();
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

renderTodos();
