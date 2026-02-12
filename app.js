const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const clearCompletedButton = document.getElementById('clear-completed');

let todos = [];

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
    });

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.className = 'delete-btn';
    deleteButton.textContent = 'Διαγραφή';
    deleteButton.addEventListener('click', () => {
      todos = todos.filter((currentTodo) => currentTodo.id !== todo.id);
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
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  todoInput.value = '';
  todoInput.focus();
  renderTodos();
});

clearCompletedButton.addEventListener('click', () => {
  todos = todos.filter((todo) => !todo.completed);
  renderTodos();
});

renderTodos();
