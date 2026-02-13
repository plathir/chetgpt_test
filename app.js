const navTodo = document.getElementById('nav-todo');
const navCrop = document.getElementById('nav-crop');
const navTable = document.getElementById('nav-table');
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
const navButtons = [navTodo, navCrop, navTable].filter(Boolean);
const PROFILE_STORAGE_KEY = 'hub_profile_data';
const SETTINGS_STORAGE_KEY = 'hub_settings_data';

let currentLanguage = 'en';
let currentAppKey = null;

const APP_CONFIG = {
  todo: {
    path: 'apps/todolist/index.html',
    names: { en: 'ToDo List', el: 'Λίστα Εργασιών' },
  },
  crop: {
    path: 'apps/cropimage/index.html',
    names: { en: 'Crop Image', el: 'Περικοπή Εικόνας' },
  },
  table: {
    path: 'apps/editabletable/index.html',
    names: { en: 'Editable Table', el: 'Επεξεργάσιμος Πίνακας' },
  },
};

const TRANSLATIONS = {
  en: {
    profileMenuLabel: 'Profile',
    editProfile: 'Edit Profile',
    settings: 'Settings',
    signOut: 'Sign Out',
    applications: 'Applications',
    navTodo: 'ToDo List',
    navCrop: 'Crop Image',
    navTable: 'Editable Table',
    welcomeTitle: 'Welcome',
    welcomeSubtitle: 'Choose an app from the left panel to open it here.',
    profileTitle: 'Edit Profile',
    profileSubtitle: 'Update your profile details and save.',
    profileSaved: 'Profile details saved.',
    fullName: 'Full Name',
    phone: 'Phone',
    location: 'Location',
    shortBio: 'Short Bio',
    profileSave: 'Save',
    settingsTitle: 'Settings',
    settingsSubtitle: 'Common account and experience preferences.',
    settingsSaved: 'Settings saved.',
    language: 'Language',
    timeZone: 'Time Zone',
    startPage: 'Start Page',
    emailNotifications: 'Email Notifications',
    pushNotifications: 'Push Notifications',
    saveSettings: 'Save Settings',
    placeholderName: 'e.g. John Smith',
    placeholderPhone: '+1 555 000 0000',
    placeholderLocation: 'New York',
    placeholderBio: 'Write a few lines about yourself...',
    languageEnglish: 'English',
    languageGreek: 'Greek',
    startWelcome: 'Welcome Screen',
    startTodo: 'ToDo List',
    startCrop: 'Crop Image',
    startTable: 'Editable Table',
  },
  el: {
    profileMenuLabel: 'Προφίλ',
    editProfile: 'Επεξεργασία Προφίλ',
    settings: 'Ρυθμίσεις',
    signOut: 'Αποσύνδεση',
    applications: 'Εφαρμογές',
    navTodo: 'ToDo List',
    navCrop: 'Crop Image',
    navTable: 'Editable Table',
    welcomeTitle: 'Κεντρική Οθόνη',
    welcomeSubtitle: 'Διάλεξε εφαρμογή από το αριστερό panel για να ανοίξει εδώ.',
    profileTitle: 'Επεξεργασία Προφίλ',
    profileSubtitle: 'Ενημέρωσε τα στοιχεία σου και πάτησε αποθήκευση.',
    profileSaved: 'Τα στοιχεία προφίλ αποθηκεύτηκαν.',
    fullName: 'Ονοματεπώνυμο',
    phone: 'Τηλέφωνο',
    location: 'Τοποθεσία',
    shortBio: 'Σύντομο βιογραφικό',
    profileSave: 'Αποθήκευση',
    settingsTitle: 'Ρυθμίσεις',
    settingsSubtitle: 'Συχνές ρυθμίσεις λογαριασμού και εμπειρίας χρήσης.',
    settingsSaved: 'Οι ρυθμίσεις αποθηκεύτηκαν.',
    language: 'Γλώσσα',
    timeZone: 'Ζώνη ώρας',
    startPage: 'Αρχική σελίδα',
    emailNotifications: 'Email ειδοποιήσεις',
    pushNotifications: 'Push ειδοποιήσεις',
    saveSettings: 'Αποθήκευση ρυθμίσεων',
    placeholderName: 'π.χ. Γιάννης Παπαδόπουλος',
    placeholderPhone: '+30 69XXXXXXXX',
    placeholderLocation: 'Αθήνα',
    placeholderBio: 'Γράψε μερικές γραμμές για εσένα...',
    languageEnglish: 'Αγγλικά',
    languageGreek: 'Ελληνικά',
    startWelcome: 'Κεντρική οθόνη',
    startTodo: 'ToDo List',
    startCrop: 'Crop Image',
    startTable: 'Editable Table',
  },
};

function getTranslation(language) {
  return TRANSLATIONS[language] || TRANSLATIONS.en;
}

function setTextById(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

function setLabelText(fieldId, text) {
  const label = document.querySelector(`label[for="${fieldId}"]`);
  if (label) {
    label.textContent = text;
  }
}

function setOptionText(selectId, optionValue, text) {
  const option = document.querySelector(`#${selectId} option[value="${optionValue}"]`);
  if (option) {
    option.textContent = text;
  }
}

function getAppName(appKey) {
  return APP_CONFIG[appKey]?.names?.[currentLanguage] || APP_CONFIG[appKey]?.names?.en || '';
}

function applyLanguage(language) {
  currentLanguage = language === 'el' ? 'el' : 'en';
  const t = getTranslation(currentLanguage);
  document.documentElement.lang = currentLanguage;

  setTextById('profile-menu-label', t.profileMenuLabel);
  setTextById('profile-edit-link', t.editProfile);
  setTextById('settings-link', t.settings);
  setTextById('logout-link', t.signOut);
  setTextById('apps-title', t.applications);
  setTextById('nav-todo', t.navTodo);
  setTextById('nav-crop', t.navCrop);
  setTextById('nav-table', t.navTable);
  setTextById('welcome-title', t.welcomeTitle);
  setTextById('welcome-subtitle', t.welcomeSubtitle);
  setTextById('profile-panel-title', t.profileTitle);
  setTextById('profile-panel-subtitle', t.profileSubtitle);
  setTextById('profile-success', t.profileSaved);
  setTextById('profile-save-btn', t.profileSave);
  setTextById('settings-panel-title', t.settingsTitle);
  setTextById('settings-panel-subtitle', t.settingsSubtitle);
  setTextById('settings-success', t.settingsSaved);
  setTextById('settings-save-btn', t.saveSettings);

  setLabelText('profile-name', t.fullName);
  setLabelText('profile-phone', t.phone);
  setLabelText('profile-location', t.location);
  setLabelText('profile-bio', t.shortBio);
  setLabelText('settings-language', t.language);
  setLabelText('settings-timezone', t.timeZone);
  setLabelText('settings-start-page', t.startPage);
  setLabelText('settings-email-notifications', t.emailNotifications);
  setLabelText('settings-push-notifications', t.pushNotifications);

  const nameInput = document.getElementById('profile-name');
  const phoneInput = document.getElementById('profile-phone');
  const locationInput = document.getElementById('profile-location');
  const bioInput = document.getElementById('profile-bio');

  if (nameInput) {
    nameInput.placeholder = t.placeholderName;
  }
  if (phoneInput) {
    phoneInput.placeholder = t.placeholderPhone;
  }
  if (locationInput) {
    locationInput.placeholder = t.placeholderLocation;
  }
  if (bioInput) {
    bioInput.placeholder = t.placeholderBio;
  }

  setOptionText('settings-language', 'en', t.languageEnglish);
  setOptionText('settings-language', 'el', t.languageGreek);
  setOptionText('settings-start-page', 'welcome', t.startWelcome);
  setOptionText('settings-start-page', 'todo', t.startTodo);
  setOptionText('settings-start-page', 'crop', t.startCrop);
  setOptionText('settings-start-page', 'table', t.startTable);

  if (currentAppKey && appTitle) {
    appTitle.textContent = getAppName(currentAppKey);
  }
}

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

function openApp(appKey) {
  const appConfig = APP_CONFIG[appKey];
  if (!appConfig) {
    return;
  }

  showOnlyPanel('app');
  currentAppKey = appKey;

  if (appTitle) {
    appTitle.textContent = getAppName(appKey);
  }

  if (appFrame && appFrame.getAttribute('src') !== appConfig.path) {
    appFrame.setAttribute('src', appConfig.path);
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
  openApp('todo');
}

function openCropApp() {
  setActiveNav(navCrop);
  openApp('crop');
}

function openTableApp() {
  setActiveNav(navTable);
  openApp('table');
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
  applyLanguage(settingsData.language);
}

function getDefaultSettings() {
  return {
    language: 'en',
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
      language: settingsForm.elements.namedItem('language')?.value || 'en',
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

if (navTable) {
  navTable.addEventListener('click', openTableApp);
}

loadProfileData();
const settingsData = loadSettingsData();

if (settingsData.startPage === 'todo') {
  openTodoApp();
} else if (settingsData.startPage === 'crop') {
  openCropApp();
} else if (settingsData.startPage === 'table') {
  openTableApp();
} else {
  showOnlyPanel('welcome');
  setActiveNav(null);
}
