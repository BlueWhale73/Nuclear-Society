// ===== Application Data =====
const appData = {
  energyFlowData: [
    {"source": "Coal", "target": "Electricity", "value": 720},
    {"source": "Oil & Gas", "target": "Transportation", "value": 280},
    {"source": "Nuclear", "target": "Electricity", "value": 50},
    {"source": "Renewables", "target": "Electricity", "value": 120},
    {"source": "Electricity", "target": "Industry", "value": 400},
    {"source": "Electricity", "target": "Residential", "value": 300},
    {"source": "Electricity", "target": "Commercial", "value": 190}
  ],
  investmentData: [
    {"country": "USA", "investment": 85, "projects": 12},
    {"country": "China", "investment": 120, "projects": 18},
    {"country": "India", "investment": 45, "projects": 8},
    {"country": "France", "investment": 35, "projects": 6},
    {"country": "UK", "investment": 28, "projects": 5}
  ],
  workforceProjections: [
    {"year": 2024, "current": 100000, "required": 100000},
    {"year": 2030, "current": 150000, "required": 200000},
    {"year": 2040, "current": 250000, "required": 300000},
    {"year": 2050, "current": 375000, "required": 375000}
  ],
  reactorSpecs: [ // from test branch
    {"reactor": "BSMR-200", "capacity": "200 MWe", "timeline": "2028-2030", "applications": "Industrial, Grid"},
    {"reactor": "BSMR-55", "capacity": "55 MWe", "timeline": "2030-2032", "applications": "Remote, Island"}
  ],
  timelineData: [ // from test branch
    {"phase": "Lecture Series", "duration": "Months 1-3", "description": "Nuclear physics and reactor theory"},
    {"phase": "Software Training", "duration": "Months 4-6", "description": "OpenMC, OpenFOAM, simulation tools"},
    {"phase": "Team Formation", "duration": "Months 7-9", "description": "Mission mode teams with KPI tracking"}
  ]
};

// ===== Section Mapping =====
const sections = {
  1: 'Introduction',
  2: 'Motivation', 3: 'Motivation', 4: 'Motivation', 5: 'Motivation', 6: 'Motivation',
  7: "India's Program", 8: "India's Program",
  9: 'Challenges', 10: 'Challenges', 11: 'Challenges', 12: 'Challenges',
  13: 'Your Role', 14: 'Your Role',
  15: 'Outcomes', 16: 'Outcomes', 17: 'Outcomes',
  18: 'Timeline', 19: 'Timeline', 20: 'Timeline'
};

// ===== State =====
let currentSlide = 1;
const totalSlides = 20;
let slides, prevBtn, nextBtn, currentSlideSpan, totalSlidesSpan, sectionNameSpan, navDots;

// ===== Init =====
document.addEventListener('DOMContentLoaded', function() {
  initializeElements();
  setupNavigation();
  setupKeyboardNavigation();
  createNavigationDots();
  updateSlideInfo();
  updateButtonStates();
  addSlideAnimations();
  setTimeout(() => { initializeCharts(); }, 200); // delayed init
});

// ===== Elements =====
function initializeElements() {
  slides = document.querySelectorAll('.slide');
  prevBtn = document.getElementById('prevBtn');
  nextBtn = document.getElementById('nextBtn');
  currentSlideSpan = document.getElementById('currentSlide');
  totalSlidesSpan = document.getElementById('totalSlides');
  sectionNameSpan = document.getElementById('sectionName');
  navDots = document.getElementById('navDots');
  if (totalSlidesSpan) totalSlidesSpan.textContent = totalSlides;
}

// ===== Navigation =====
function setupNavigation() {
  if (prevBtn) prevBtn.addEventListener('click', previousSlide);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
}

function setupKeyboardNavigation() {
  document.addEventListener('keydown', function(e) {
    switch(e.key) {
      case 'ArrowLeft': e.preventDefault(); previousSlide(); break;
      case 'ArrowRight':
      case ' ': e.preventDefault(); nextSlide(); break;
      case 'Home': goToSlide(1); break;
      case 'End': goToSlide(totalSlides); break;
    }
  });
}

function createNavigationDots() {
  if (!navDots) return;
  navDots.innerHTML = '';
  for (let i = 1; i <= totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'nav-dot';
    if (i === 1) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${i}`);
    dot.tabIndex = 0;
    dot.addEventListener('click', () => goToSlide(i));
    dot.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') goToSlide(i); });
    navDots.appendChild(dot);
  }
}

// ===== Slide Movement =====
function previousSlide() {
  if (currentSlide > 1) goToSlide(currentSlide - 1);
}

function nextSlide() {
  if (currentSlide < totalSlides) goToSlide(currentSlide + 1);
}

function goToSlide(slideNumber) {
  if (slideNumber < 1 || slideNumber > totalSlides || slideNumber === currentSlide) return;
  const currentSlideElement = document.querySelector('.slide.active');
  if (currentSlideElement) {
    currentSlideElement.classList.remove('active');
    currentSlideElement.classList.add('prev');
  }
  const newSlideElement = document.querySelector(`[data-slide="${slideNumber}"]`);
  if (newSlideElement) {
    newSlideElement.classList.remove('prev');
    newSlideElement.classList.add('active');
  }
  setTimeout(() => slides.forEach(slide => slide.classList.remove('prev')), 500);
  currentSlide = slideNumber;
  updateSlideInfo();
  updateNavigationDots();
  updateButtonStates();
  loadSlideSpecificContent(slideNumber);
}

function updateSlideInfo() {
  if (currentSlideSpan) currentSlideSpan.textContent = currentSlide;
  if (sectionNameSpan) sectionNameSpan.textContent = sections[currentSlide] || 'Introduction';
}

function updateNavigationDots() {
  const dots = navDots ? navDots.querySelectorAll('.nav-dot') : [];
  dots.forEach((dot, index) => dot.classList.toggle('active', index + 1 === currentSlide));
}

function updateButtonStates() {
  if (prevBtn) {
    prevBtn.disabled = currentSlide === 1;
    prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
  }
  if (nextBtn) {
    nextBtn.disabled = currentSlide === totalSlides;
    nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
    nextBtn.textContent = nextBtn.disabled ? 'Complete' : 'Next';
  }
}

function addSlideAnimations() {
  document.querySelectorAll('.slide').forEach(slide =>
    slide.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
  );
}

// ===== Chart Loading =====
function initializeCharts() {
  // Using lazy load logic from test
  const chartObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slideNumber = parseInt(entry.target.dataset.slide);
        if (slideNumber === 2 && !entry.target.dataset.sankeyLoaded) { safeCreateChart(createSankeyDiagram, 'Sankey'); entry.target.dataset.sankeyLoaded = 'true'; }
        if (slideNumber === 5 && !entry.target.dataset.investmentLoaded) { safeCreateChart(createInvestmentChart, 'Investment'); entry.target.dataset.investmentLoaded = 'true'; }
        if (slideNumber === 12 && !entry.target.dataset.workforceLoaded) { safeCreateChart(createWorkforceChart, 'Workforce'); entry.target.dataset.workforceLoaded = 'true'; }
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('[data-slide="2"], [data-slide="5"], [data-slide="12"]').forEach(slide => chartObserver.observe(slide));
}

// ===== Slide-Specific Chart Calls (from dolphin) =====
function loadSlideSpecificContent(slideNumber) {
  if (slideNumber === 2) safeCreateChart(createSankeyDiagram, 'Sankey');
  if (slideNumber === 5) safeCreateChart(createInvestmentChart, 'Investment');
  if (slideNumber === 12) safeCreateChart(createWorkforceChart, 'Workforce');
}

// ===== Chart Functions =====
function createSankeyDiagram() { /* keep your existing sankey code here */ }
function createInvestmentChart() { /* keep your existing investment chart code here */ }
function createWorkforceChart() { /* keep your existing workforce chart code here */ }

function safeCreateChart(fn, name) {
  try { fn(); } catch (err) { console.warn(`Failed to create ${name} chart`, err); }
}

// ===== Touch Swipe =====
let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, { passive: true });
document.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].screenX;
  if (Math.abs(diff) > 50) diff > 0 ? nextSlide() : previousSlide();
}, { passive: true });

// ===== Export =====
window.NuclearPresentation = { goToSlide, nextSlide, previousSlide, getCurrentSlide: () => currentSlide, getTotalSlides: () => totalSlides };
