const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const todoList = document.getElementById('todo-list');
const emptyState = document.getElementById('empty-state');
const clearCompletedButton = document.getElementById('clear-completed');
const saveButton = document.getElementById('save-todos');
const addButton = document.getElementById('todo-add-btn');

const STORAGE_KEY = 'todolist_apps';
const HUB_SETTINGS_KEY = 'hub_settings_data';

let currentLanguage = 'en';
let todos = [];

const TRANSLATIONS = {
  en: {
    title: 'ToDo List',
    placeholder: 'Add a task...',
    add: 'Add',
    empty: 'No tasks yet.',
    clearCompleted: 'Clear Completed',
    save: 'Save',
    done: 'Complete',
    undo: 'Undo',
    edit: 'Edit',
    del: 'Delete',
    editPrompt: 'Edit task:',
    savedAlert: 'Tasks saved.',
  },
  el: {
    title: 'Λίστα Εργασιών',
    placeholder: 'Πρόσθεσε μια εργασία...',
    add: 'Προσθήκη',
    empty: 'Δεν υπάρχουν εργασίες ακόμα.',
    clearCompleted: 'Καθαρισμός Ολοκληρωμένων',
    save: 'Αποθήκευση',
    done: 'Ολοκλήρωση',
    undo: 'Αναίρεση',
    edit: 'Επεξεργασία',
    del: 'Διαγραφή',
    editPrompt: 'Επεξεργασία εργασίας:',
    savedAlert: 'Οι εργασίες αποθηκεύτηκαν.',
  },
};

function getLanguageFromSettings() {
  const rawSettings = localStorage.getItem(HUB_SETTINGS_KEY);
  if (!rawSettings) {
    return 'en';
  }

  try {
    const settings = JSON.parse(rawSettings);
    return settings.language === 'el' ? 'el' : 'en';
  } catch {
    return 'en';
  }
}

function t() {
  return TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
}

function applyLanguage() {
  const translation = t();
  document.documentElement.lang = currentLanguage;

  const title = document.getElementById('todo-title');
  if (title) {
    title.textContent = translation.title;
  }

  todoInput.placeholder = translation.placeholder;
  addButton.textContent = translation.add;
  emptyState.textContent = translation.empty;
  clearCompletedButton.textContent = translation.clearCompleted;
  saveButton.textContent = translation.save;
}

function saveTodos() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function renderTodos() {
  const translation = t();
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
    doneButton.textContent = todo.completed ? translation.undo : translation.done;
    doneButton.addEventListener('click', () => {
      todo.completed = !todo.completed;
      renderTodos();
      saveTodos();
    });

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'btn btn-warning btn-sm';
    editButton.textContent = translation.edit;
    editButton.addEventListener('click', () => {
      const nextText = prompt(translation.editPrompt, todo.text);
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
    deleteButton.textContent = translation.del;
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
  alert(t().savedAlert);
});

const savedTodos = sessionStorage.getItem(STORAGE_KEY);
if (savedTodos) {
  try {
    todos = JSON.parse(savedTodos);
  } catch {
    todos = [];
  }
}

currentLanguage = getLanguageFromSettings();
applyLanguage();
renderTodos();
