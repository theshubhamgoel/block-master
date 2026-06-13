// --- Hash-Based View Router ---
const navLinks = {
  'home': document.getElementById('link-home'),
  'updates': document.getElementById('link-updates'),
  'giftcodes': document.getElementById('link-giftcodes'),
  'privacy': document.getElementById('link-privacy')
};

const views = {
  'home': document.getElementById('view-home'),
  'updates': document.getElementById('view-updates'),
  'giftcodes': document.getElementById('view-giftcodes'),
  'privacy': document.getElementById('view-privacy')
};

function routePage() {
  // Get current hash, default to 'home'
  let hash = window.location.hash.substring(1);
  if (!hash) hash = 'home';

  let targetView = hash;
  const subPrivacyHashes = ['commitment', 'collection', 'appstore', 'children', 'purchases', 'control', 'changes', 'contact'];
  
  if (subPrivacyHashes.includes(hash)) {
    targetView = 'privacy';
  }

  // Hide all views and remove active class from all header links
  Object.keys(views).forEach(key => {
    views[key].classList.remove('active');
  });
  Object.keys(navLinks).forEach(key => {
    navLinks[key].classList.remove('active');
  });

  // Activate target view
  if (views[targetView]) {
    views[targetView].classList.add('active');
    if (navLinks[targetView]) {
      navLinks[targetView].classList.add('active');
    }
  } else {
    views['home'].classList.add('active');
    navLinks['home'].classList.add('active');
  }

  // Smooth scroll if landing on a specific privacy subsection
  if (subPrivacyHashes.includes(hash)) {
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else {
    window.scrollTo(0, 0);
  }
}

window.addEventListener('hashchange', routePage);
window.addEventListener('load', routePage);


// --- Hamburger Menu Logic ---
const hamburgerBtn = document.getElementById('hamburger-btn');
const navMenu = document.getElementById('nav-menu');
const menuLinks = document.querySelectorAll('.nav-link');

hamburgerBtn.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburgerBtn.classList.toggle('open');
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

// Close menu on clicking link
menuLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });
});

// Close menu on clicking outside
document.addEventListener('click', (e) => {
  if (!hamburgerBtn.contains(e.target) && !navMenu.contains(e.target)) {
    navMenu.classList.remove('open');
    hamburgerBtn.classList.remove('open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  }
});


// --- Theme Switcher Setup ---
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = themeToggle.querySelector('.theme-label');
const themeIcon = themeToggle.querySelector('.theme-icon');

let currentTheme = localStorage.getItem('block-master-theme') || 'dark';
document.body.setAttribute('data-theme', currentTheme === 'woody' ? 'woody' : 'dark');
updateThemeUI();

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'woody' : 'dark';
  document.body.setAttribute('data-theme', currentTheme);
  localStorage.setItem('block-master-theme', currentTheme);
  updateThemeUI();

  // Close mobile dropdown menu
  navMenu.classList.remove('open');
  hamburgerBtn.classList.remove('open');
  hamburgerBtn.setAttribute('aria-expanded', 'false');
});

function updateThemeUI() {
  if (currentTheme === 'woody') {
    themeLabel.textContent = 'Woody Theme';
    themeIcon.textContent = '🪵';
  } else {
    themeLabel.textContent = 'Neon Theme';
    themeIcon.textContent = '🔮';
  }
}


// --- Intersection Observer for Privacy Sections ---
const sections = document.querySelectorAll('.content-card');
const sideLinks = document.querySelectorAll('.toc-link');

const observerOptions = {
  root: null,
  rootMargin: '-20% 0px -60% 0px',
  threshold: 0
};

const observer = new IntersectionObserver((entries) => {
  if (!views['privacy'].classList.contains('active')) return;

  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      sideLinks.forEach(link => {
        if (link.getAttribute('href') === `#${id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, observerOptions);

sections.forEach(section => observer.observe(section));


// --- Interactive Hero Game Board Simulator ---
const heroGameBoard = document.getElementById('hero-gameboard');
const heroPresetBlocks = [
  // Setup nice shapes (e.g. 1 is active, 0 is empty)
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 1, 1, 0],
  [0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0]
];

const blockColors = ['active-blue', 'active-pink', 'active-purple', 'active-amber'];

function buildHeroBoard() {
  heroGameBoard.innerHTML = '';
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cell = document.createElement('div');
      cell.classList.add('hero-cell');
      
      // Assign initial block states
      if (heroPresetBlocks[r][c] === 1) {
        const colorClass = blockColors[(r + c) % blockColors.length];
        cell.classList.add(colorClass);
      }
      
      cell.dataset.row = r;
      cell.dataset.col = c;
      
      cell.addEventListener('click', () => triggerBlast(r, c));
      heroGameBoard.appendChild(cell);
    }
  }
}

function triggerBlast(r, c) {
  // Clearing blocks inside a small radius to simulate a puzzle "blast" combo
  const cells = heroGameBoard.querySelectorAll('.hero-cell');
  
  // Flash effect on board border
  heroGameBoard.style.borderColor = 'var(--accent-theme)';
  setTimeout(() => {
    heroGameBoard.style.borderColor = '';
  }, 250);

  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    
    // Check Manhattan distance <= 1 (target cell + direct neighbors)
    if (Math.abs(row - r) + Math.abs(col - c) <= 1) {
      // Clear block class active states
      cell.className = 'hero-cell';
      
      // Brief popping scale animation
      cell.style.transform = 'scale(0.8)';
      cell.style.background = 'rgba(255, 255, 255, 0.2)';
      
      setTimeout(() => {
        cell.style.transform = '';
        cell.style.background = '';
      }, 300);
    }
  });

  // Increment simulated high score on click in simulator widget if active
  scoreCount += 150 * comboMultiplier;
  localStorage.setItem('block-master-score-sim', scoreCount);
  updateSimulatorUI();
}

buildHeroBoard();


// --- Interactive Block Sandbox Simulator (Privacy View) ---
const simGameBoard = document.getElementById('sim-gameboard');
const scoreSpan = document.getElementById('sim-score');
const icloudStatusSpan = document.getElementById('sim-icloud');
const syncToggleBtn = document.getElementById('sim-sync-btn');
const resetBtn = document.getElementById('sim-reset-btn');
const wipeOverlay = document.getElementById('wipe-overlay');

let scoreCount = parseInt(localStorage.getItem('block-master-score-sim')) || 0;
let icloudEnabled = localStorage.getItem('block-master-icloud-sim') !== 'disabled';
let comboMultiplier = parseInt(localStorage.getItem('block-master-combo-sim')) || 1;

// Maintain simulator grid array (0 = empty, 1, 2, 3 = colored active states)
let simGridState = Array(64).fill(0);
// Seed some initial random squares
for (let i = 0; i < 64; i++) {
  if (Math.random() < 0.25) {
    simGridState[i] = Math.floor(Math.random() * 3) + 1; // Random color type
  }
}

function buildSimBoard() {
  simGameBoard.innerHTML = '';
  for (let i = 0; i < 64; i++) {
    const cell = document.createElement('div');
    cell.classList.add('sim-cell');
    
    if (simGridState[i] > 0) {
      cell.classList.add(`active-color${simGridState[i]}`);
    }
    
    cell.dataset.index = i;
    cell.addEventListener('click', () => {
      // Toggle cell state
      if (simGridState[i] > 0) {
        simGridState[i] = 0;
        cell.className = 'sim-cell';
      } else {
        const randomColorType = Math.floor(Math.random() * 3) + 1;
        simGridState[i] = randomColorType;
        cell.classList.add(`active-color${randomColorType}`);
        
        scoreCount += 40 * comboMultiplier;
        localStorage.setItem('block-master-score-sim', scoreCount);
      }
      
      updateSimulatorUI();
    });
    
    simGameBoard.appendChild(cell);
  }
}

syncToggleBtn.addEventListener('click', () => {
  icloudEnabled = !icloudEnabled;
  localStorage.setItem('block-master-icloud-sim', icloudEnabled ? 'enabled' : 'disabled');
  updateSimulatorUI();
});

resetBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to RESET game storage? This wipes all simulated progress.')) {
    wipeOverlay.classList.add('active');

    setTimeout(() => {
      scoreCount = 0;
      comboMultiplier = 1;
      icloudEnabled = true;
      simGridState.fill(0);
      
      localStorage.removeItem('block-master-score-sim');
      localStorage.removeItem('block-master-icloud-sim');
      localStorage.removeItem('block-master-combo-sim');
      
      buildSimBoard();
      updateSimulatorUI();
    }, 1200);

    setTimeout(() => {
      wipeOverlay.classList.remove('active');
    }, 2000);
  }
});

function updateSimulatorUI() {
  scoreSpan.textContent = scoreCount.toLocaleString();

  // Create JSON string representation of data to calculate storage size in bytes
  const serializedState = JSON.stringify({
    score: scoreCount,
    icloud: icloudEnabled,
    combo: comboMultiplier,
    grid: simGridState,
    theme: currentTheme,
    soundOn: true,
    hapticOn: true
  });
  
  const bytesSize = new Blob([serializedState]).size;
  document.getElementById('sim-size').textContent = `${bytesSize} bytes`;

  if (icloudEnabled) {
    icloudStatusSpan.textContent = 'Enabled (Active)';
    icloudStatusSpan.style.color = '#10b981';
    syncToggleBtn.textContent = 'Disable iCloud Sync';
  } else {
    icloudStatusSpan.textContent = 'Disabled (Local Only)';
    icloudStatusSpan.style.color = 'var(--text-muted)';
    syncToggleBtn.textContent = 'Enable iCloud Sync';
  }
}

// Startup grid creation
buildSimBoard();
updateSimulatorUI();


// --- Interactive Gift Code Redemption Validator ---
const giftInput = document.getElementById('gift-code-input');
const claimBtn = document.getElementById('claim-btn');
const claimMsg = document.getElementById('claim-msg');

claimBtn.addEventListener('click', () => {
  const code = giftInput.value.trim().toUpperCase();

  if (!code) {
    showFeedback('Please enter a block promo code!', 'error');
    return;
  }

  if (code === 'FREEBLASTS') {
    scoreCount += 1000;
    saveStateAndShowSuccess('Promo accepted! +1,000 points added to your dashboard simulator!');
  } else if (code === 'NEONBLOCKS') {
    saveStateAndShowSuccess('Promo accepted! Neon Grid skin unlocked. View in your layout options.');
  } else if (code === 'MASTERBOOST') {
    comboMultiplier = 2;
    localStorage.setItem('block-master-combo-sim', comboMultiplier);
    saveStateAndShowSuccess('Promo accepted! Score combo rate doubled (x2 Multiplier active).');
  } else if (code === 'CLASSICGRID') {
    showFeedback('Error: Code CLASSICGRID expired on May 1st, 2026.', 'error');
  } else {
    showFeedback('Invalid promotional code. Please check spelling and try again.', 'error');
  }
});

function saveStateAndShowSuccess(successText) {
  localStorage.setItem('block-master-score-sim', scoreCount);
  updateSimulatorUI();
  showFeedback(successText, 'success');
  giftInput.value = '';
}

function showFeedback(text, type) {
  claimMsg.className = 'redeem-result-msg';
  claimMsg.textContent = text;
  
  if (type === 'success') {
    claimMsg.classList.add('msg-success');
  } else {
    claimMsg.classList.add('msg-error');
  }
}
