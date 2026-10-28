// Shared interface behaviors.
// Login and signup authentication remain in each page's own script.

/* =========================================
   PASSWORD FIELDS
   ========================================= */

document.querySelectorAll('input[type="password"]').forEach((input) => {
  // Create a wrapper for the input and Show/Hide button.
  const wrap = document.createElement('div');
  wrap.className = 'password-control';

  input.before(wrap);
  wrap.append(input);

  // Create the Show/Hide button.
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'password-toggle';
  toggle.textContent = 'Show';
  toggle.setAttribute('aria-label', 'Show password');
  toggle.setAttribute('aria-pressed', 'false');

  toggle.addEventListener('click', () => {
    const showPassword = input.type === 'password';

    input.type = showPassword ? 'text' : 'password';
    toggle.textContent = showPassword ? 'Hide' : 'Show';

    toggle.setAttribute(
      'aria-label',
      showPassword ? 'Hide password' : 'Show password'
    );

    toggle.setAttribute('aria-pressed', String(showPassword));
  });

  wrap.append(toggle);

  // Warn users if Caps Lock is on.
  const capsWarning = document.createElement('p');
  capsWarning.className = 'password-hint';
  capsWarning.textContent = 'Caps Lock is on.';
  capsWarning.hidden = true;
  capsWarning.setAttribute('role', 'status');

  wrap.after(capsWarning);

  function updateCapsWarning(event) {
    if (typeof event.getModifierState === 'function') {
      capsWarning.hidden = !event.getModifierState('CapsLock');
    }
  }

  input.addEventListener('keydown', updateCapsWarning);
  input.addEventListener('keyup', updateCapsWarning);

  input.addEventListener('blur', () => {
    capsWarning.hidden = true;
  });

  // Display password guidance only on the signup page.
  if (document.getElementById('signup-form')) {
    const strength = document.createElement('p');
    strength.className = 'password-hint';
    strength.setAttribute('aria-live', 'polite');
    capsWarning.after(strength);

    input.addEventListener('input', () => {
      const password = input.value;

      if (!password) {
        strength.textContent = '';
        return;
      }

      // This is guidance, not a guarantee of password security.
      const checks = [
        password.length >= 12,
        /[a-z]/.test(password),
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[^A-Za-z0-9]/.test(password)
      ];

      const score = checks.filter(Boolean).length;

      if (password.length < 8) {
        strength.textContent = 'Use at least 8 characters.';
      } else if (score <= 2) {
        strength.textContent =
          'Try a longer password with a mix of characters.';
      } else if (score <= 4) {
        strength.textContent =
          'Getting stronger. A longer, unique password is better.';
      } else {
        strength.textContent =
          'Good variety. Make sure this password is unique.';
      }
    });
  }
});

/* =========================================
   FORM FEEDBACK
   ========================================= */

// Let assistive technology announce login and signup messages.
document
  .querySelectorAll('#error, #error-message, #message')
  .forEach((element) => {
    element.setAttribute('role', 'status');
  });

/* =========================================
   DASHBOARD TABS
   ========================================= */

const tabs = [...document.querySelectorAll('.nav-tab')];

// Update accessibility information to match the active tab.
function syncTabs() {
  tabs.forEach((tab) => {
    const panel = document.getElementById(tab.dataset.target);

    // Skip a tab if its matching panel cannot be found.
    if (!panel) return;

    const isActive = tab.classList.contains('active');

    tab.id = `nav-${tab.dataset.target}`;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', String(isActive));
    tab.setAttribute('aria-controls', panel.id);
    tab.tabIndex = isActive ? 0 : -1;

    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
  });
}

// Existing page scripts switch the active classes on click.
// This script updates accessibility information after that.
tabs.forEach((tab, index) => {
  tab.addEventListener('click', syncTabs);

  tab.addEventListener('keydown', (event) => {
    let next;

    if (event.key === 'ArrowRight') {
      next = (index + 1) % tabs.length;
    }

    if (event.key === 'ArrowLeft') {
      next = (index - 1 + tabs.length) % tabs.length;
    }

    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;

    if (next !== undefined) {
      event.preventDefault();
      tabs[next].click();
      tabs[next].focus();
    }
  });
});

syncTabs();

/* =========================================
   DASHBOARD EMPTY STATES
   ========================================= */

// Messages shown while dashboard content is still being developed.
const emptyMessages = {
  'events-tab': {
    title: 'Community starts here',
    text: 'Events will appear here when they are available.'
  },

  'prevention-tab': {
    title: 'Keep learning',
    text: 'Prevention resources will appear here when they are available.'
  },

  'shadowing-tab': {
    title: 'Explore new opportunities',
    text: 'Shadowing opportunities will appear here when they are available.'
  },

  'points-tab': {
    title: 'Your progress matters',
    text: 'Points and rewards will appear here when this feature is available.'
  },

  'postings-tab': {
    title: 'Share your experience',
    text: 'Your shadowing postings will appear here.'
  },

  'applicants-tab': {
    title: 'Connect with students',
    text: 'Applicants will appear here when this feature is available.'
  },

  'sponsored-events-tab': {
    title: 'Support your community',
    text: 'Your sponsored events will appear here.'
  },

  'reporting-tab': {
    title: 'Your impact, at a glance',
    text: 'Engagement reports will appear here once reporting is connected.'
  }
};

document
  .querySelectorAll('.dashboard-page section.tab-content')
  .forEach((panel) => {
    const message = emptyMessages[panel.id] || {
      title: 'Good things are ahead',
      text: 'This section is ready for content. There is nothing to display yet.'
    };

    const state = document.createElement('div');
    state.className = 'empty-state';

    const icon = document.createElement('span');
    icon.className = 'empty-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = panel.id.includes('reporting') ? '↗' : '✦';

    const heading = document.createElement('h3');
    heading.textContent = message.title;

    const description = document.createElement('p');
    description.textContent = message.text;

    state.append(icon, heading, description);

    if (!panel.querySelector('.sub-tabs')) {
  panel.append(state);
}
  });

  /* =========================================
   SMALLER DASHBOARD TABS
   ========================================= */

document.querySelectorAll('.sub-tabs').forEach((group) => {
  const buttons = [...group.querySelectorAll('.sub-tab')];
  const panels = [...group.querySelectorAll('.sub-tab-panel')];
  const tabList = group.querySelector('.sub-tab-buttons');

  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', 'Category sections');

  function selectTab(selectedButton) {
    buttons.forEach((button) => {
      const selected = button === selectedButton;

      button.classList.toggle('active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });

    panels.forEach((panel) => {
      panel.hidden = panel.id !== selectedButton.dataset.panel;
    });
  }

  buttons.forEach((button, index) => {
    const panel = document.getElementById(button.dataset.panel);

    if (!panel || !group.contains(panel)) return;

    button.id = `tab-${panel.id}`;
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', panel.id);

    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', button.id);

    button.addEventListener('click', () => {
      selectTab(button);
    });

    button.addEventListener('keydown', (event) => {
      let next;

      if (event.key === 'ArrowRight') {
        next = (index + 1) % buttons.length;
      }

      if (event.key === 'ArrowLeft') {
        next = (index - 1 + buttons.length) % buttons.length;
      }

      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = buttons.length - 1;

      if (next !== undefined) {
        event.preventDefault();
        selectTab(buttons[next]);
        buttons[next].focus();
      }
    });
  });

  const initialTab = group.querySelector('.sub-tab.active') || buttons[0];

  if (initialTab) {
    selectTab(initialTab);
  }
});

/* =========================================
   LIGHT AND DARK MODE
   ========================================= */

const themeButton = document.querySelector('.theme-toggle');

// Load the saved theme, if the user chose one before.
const savedTheme = localStorage.getItem('p3-theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

function updateThemeButton() {
  if (!themeButton) return;

  const isDark = document.body.classList.contains('dark-mode');

  themeButton.textContent = isDark ? '☀️ Light mode' : '🌙 Dark mode';
  themeButton.setAttribute('aria-pressed', String(isDark));
}

updateThemeButton();

if (themeButton) {
  themeButton.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-mode');

    localStorage.setItem('p3-theme', isDark ? 'dark' : 'light');
    updateThemeButton();
  });
}