const navTodo = document.getElementById('nav-todo');
const navCrop = document.getElementById('nav-crop');
const profileEditLink = document.getElementById('profile-edit-link');
const settingsLink = document.getElementById('settings-link');
const welcomePanel = document.getElementById('welcome-panel');
const appPanel = document.getElementById('app-panel');
const profilePanel = document.getElementById('profile-panel');
const settingsPanel = document.getElementById('settings-panel');
const appFrame = document.getElementById('app-frame');
const appTitle = document.getElementById('app-title');
const profileForm = document.getElementById('profile-form');
const profileSuccess = document.getElementById('profile-success');
const settingsForm = document.getElementById('settings-form');
const settingsSuccess = document.getElementById('settings-success');
const navButtons = [navTodo, navCrop].filter(Boolean);
const PROFILE_STORAGE_KEY = 'hub_profile_data';
const SETTINGS_STORAGE_KEY = 'hub_settings_data';

function showOnlyPanel(panelToShow) {
  if (welcomePanel) {
    welcomePanel.classList.toggle('d-none', panelToShow !== 'welcome');
  }

  if (appPanel) {
    appPanel.classList.toggle('d-none', panelToShow !== 'app');
  }

  if (profilePanel) {
    profilePanel.classList.toggle('d-none', panelToShow !== 'profile');
  }

  if (settingsPanel) {
    settingsPanel.classList.toggle('d-none', panelToShow !== 'settings');
  }
}

function openApp(name, path) {
  showOnlyPanel('app');

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

function openProfileEditor() {
  showOnlyPanel('profile');
  setActiveNav(null);
}

function openSettings() {
  showOnlyPanel('settings');
  setActiveNav(null);
}

function openTodoApp() {
  setActiveNav(navTodo);
  openApp('ToDo List', 'apps/todolist/index.html');
}

function openCropApp() {
  setActiveNav(navCrop);
  openApp('Crop Image', 'apps/cropimage/index.html');
}

function loadProfileData() {
  if (!profileForm) {
    return;
  }

  const rawData = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!rawData) {
    return;
  }

  try {
    const profileData = JSON.parse(rawData);
    const fieldNames = ['name', 'email', 'phone', 'location', 'bio'];

    fieldNames.forEach((fieldName) => {
      const field = profileForm.elements.namedItem(fieldName);
      if (field && typeof profileData[fieldName] === 'string') {
        field.value = profileData[fieldName];
      }
    });
  } catch (error) {
    localStorage.removeItem(PROFILE_STORAGE_KEY);
  }
}

function applySettings(settingsData) {
  document.body.classList.toggle('compact-mode', Boolean(settingsData.compactMode));
}

function getDefaultSettings() {
  return {
    language: 'el',
    timezone: 'Europe/Athens',
    startPage: 'welcome',
    compactMode: false,
    emailNotifications: true,
    pushNotifications: false,
    autosave: true,
  };
}

function loadSettingsData() {
  const defaultSettings = getDefaultSettings();
  let storedSettings = {};

  const rawData = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (rawData) {
    try {
      storedSettings = JSON.parse(rawData) || {};
    } catch (error) {
      localStorage.removeItem(SETTINGS_STORAGE_KEY);
    }
  }

  const settingsData = { ...defaultSettings, ...storedSettings };
  applySettings(settingsData);

  if (settingsForm) {
    const fields = {
      language: settingsData.language,
      timezone: settingsData.timezone,
      startPage: settingsData.startPage,
      compactMode: settingsData.compactMode,
      emailNotifications: settingsData.emailNotifications,
      pushNotifications: settingsData.pushNotifications,
      autosave: settingsData.autosave,
    };

    Object.entries(fields).forEach(([name, value]) => {
      const field = settingsForm.elements.namedItem(name);
      if (!field) {
        return;
      }

      if (field.type === 'checkbox') {
        field.checked = Boolean(value);
      } else {
        field.value = value;
      }
    });
  }

  return settingsData;
}

function showTemporaryAlert(alertElement) {
  if (!alertElement) {
    return;
  }

  alertElement.classList.remove('d-none');
  setTimeout(() => {
    alertElement.classList.add('d-none');
  }, 2000);
}

if (profileEditLink) {
  profileEditLink.addEventListener('click', (event) => {
    event.preventDefault();
    openProfileEditor();
  });
}

if (settingsLink) {
  settingsLink.addEventListener('click', (event) => {
    event.preventDefault();
    openSettings();
  });
}

if (profileForm) {
  profileForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const profileData = {
      name: profileForm.elements.namedItem('name')?.value?.trim() || '',
      email: profileForm.elements.namedItem('email')?.value?.trim() || '',
      phone: profileForm.elements.namedItem('phone')?.value?.trim() || '',
      location: profileForm.elements.namedItem('location')?.value?.trim() || '',
      bio: profileForm.elements.namedItem('bio')?.value?.trim() || '',
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profileData));
    showTemporaryAlert(profileSuccess);
  });
}

if (settingsForm) {
  settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const settingsData = {
      language: settingsForm.elements.namedItem('language')?.value || 'el',
      timezone: settingsForm.elements.namedItem('timezone')?.value || 'Europe/Athens',
      startPage: settingsForm.elements.namedItem('startPage')?.value || 'welcome',
      compactMode: Boolean(settingsForm.elements.namedItem('compactMode')?.checked),
      emailNotifications: Boolean(settingsForm.elements.namedItem('emailNotifications')?.checked),
      pushNotifications: Boolean(settingsForm.elements.namedItem('pushNotifications')?.checked),
      autosave: Boolean(settingsForm.elements.namedItem('autosave')?.checked),
    };

    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settingsData));
    applySettings(settingsData);
    showTemporaryAlert(settingsSuccess);
  });
}

if (navTodo) {
  navTodo.addEventListener('click', openTodoApp);
}

if (navCrop) {
  navCrop.addEventListener('click', openCropApp);
}

loadProfileData();
const settingsData = loadSettingsData();

if (settingsData.startPage === 'todo') {
  openTodoApp();
} else if (settingsData.startPage === 'crop') {
  openCropApp();
} else {
  showOnlyPanel('welcome');
  setActiveNav(null);
}
