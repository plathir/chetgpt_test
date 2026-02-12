const navTodo = document.getElementById('nav-todo');
const navCrop = document.getElementById('nav-crop');
const welcomePanel = document.getElementById('welcome-panel');
const appPanel = document.getElementById('app-panel');
const appFrame = document.getElementById('app-frame');
const appTitle = document.getElementById('app-title');
const navButtons = [navTodo, navCrop].filter(Boolean);

function openApp(name, path) {
  if (welcomePanel) {
    welcomePanel.classList.add('d-none');
  }

  if (appPanel) {
    appPanel.classList.remove('d-none');
  }

  if (appTitle) {
    appTitle.textContent = name;
  }

  if (appFrame && appFrame.getAttribute('src') !== path) {
    appFrame.setAttribute('src', path);
  }
}

function setActiveNav(activeButton) {
  navButtons.forEach((button) => {
    if (button === activeButton) {
      button.classList.add('active');
    } else {
      button.classList.remove('active');
    }
  });
}

if (navTodo) {
  navTodo.addEventListener('click', () => {
    setActiveNav(navTodo);
    openApp('ToDo List', 'apps/todolist/index.html');
  });
}

if (navCrop) {
  navCrop.addEventListener('click', () => {
    setActiveNav(navCrop);
    openApp('Crop Image', 'apps/cropimage/index.html');
  });
}
