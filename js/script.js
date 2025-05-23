/**
 * PS3 Jailbreak Guide - Enhanced Main JavaScript File
 * 
 * Improvements:
 * - Better theme handling with localStorage
 * - Enhanced accessibility features
 * - Smoother animations
 * - Better mobile menu handling
 * - Improved error handling
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  try {
    // Initialize all components
    initThemeToggle();
    initMobileMenu();
    initTabSystem();
    generateChecklists();
    generateHomebrewApps();
    generateToolsTable();
    initParticles();
    updateLastModifiedDate();
    updateCurrentYear();
    
    // Add scroll reveal animations
    initScrollReveal();
    
    console.log('PS3 Jailbreak Guide initialized successfully');
  } catch (error) {
    console.error('Initialization error:', error);
    // Show error to user in a non-intrusive way
    const errorElement = document.createElement('div');
    errorElement.className = 'error-notice';
    errorElement.textContent = 'An error occurred while loading the page. Some features may not work properly.';
    errorElement.style.cssText = 'position: fixed; bottom: 20px; left: 20px; right: 20px; background: #F44336; color: white; padding: 10px; border-radius: 4px; z-index: 9999; text-align: center;';
    document.body.appendChild(errorElement);
    
    // Remove error after 5 seconds
    setTimeout(() => {
      errorElement.style.opacity = '0';
      setTimeout(() => errorElement.remove(), 300);
    }, 5000);
  }
});

/**
 * Theme Toggle Functionality
 * Switches between dark and light mode, saves preference to localStorage
 */
function initThemeToggle() {
  const themeToggle = document.getElementById('theme-toggle');
  if (!themeToggle) return;

  // Check for saved theme preference or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Apply theme based on preferences
  if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
    document.body.classList.add('light-mode');
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  themeToggle.addEventListener('click', () => {
    const isLightMode = document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', isLightMode ? 'light' : 'dark');
    
    // Update button icon and label
    if (isLightMode) {
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
      themeToggle.setAttribute('aria-label', 'Switch to dark mode');
    } else {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      themeToggle.setAttribute('aria-label', 'Switch to light mode');
    }
  });
}

/**
 * Mobile Menu Toggle
 * Handles the responsive hamburger menu functionality
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    const isExpanded = hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    hamburger.setAttribute('aria-expanded', isExpanded);
    
    // Disable scrolling when menu is open
    document.body.style.overflow = isExpanded ? 'hidden' : '';
  });

  // Close menu when clicking on links (for mobile)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && 
        !e.target.closest('.nav-links') && 
        !e.target.closest('.hamburger') &&
        navLinks.classList.contains('active')) {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Tab System Initialization
 * Handles the Windows/macOS guide tabs with improved accessibility
 */
function initTabSystem() {
  const tabButtons = document.querySelectorAll('.tab-button');
  if (tabButtons.length === 0) return;

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const tabId = button.getAttribute('data-tab');
      if (!tabId) return;
      
      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      });
      
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Add active class to clicked button and corresponding content
      button.classList.add('active');
      button.setAttribute('aria-selected', 'true');
      
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.classList.add('active');
        // Focus the first focusable element in the tab for keyboard users
        const focusable = tabContent.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable) focusable.focus();
      }
    });

    // Add keyboard navigation
    button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        button.click();
      }
    });
  });

  // Initialize first tab by default
  const firstTab = document.querySelector('.tab-button');
  if (firstTab) firstTab.click();
}

/**
 * Generate Interactive Checklists
 * Creates the prerequisite checklists for both Windows and macOS guides
 */
function generateChecklists() {
  const checklistData = {
    windows: [
      { id: 'win1', label: 'Install ps3hen from official site' },
      { id: 'win2', label: 'USB flash drive (FAT32 formatted)' },
      { id: 'win3', label: 'PS3 system software 4.90 or lower' },
      { id: 'win4', label: 'Windows PC with internet connection' },
      { id: 'win5', label: 'PS3Xploit files downloaded' }
    ],
    macos: [
      { id: 'mac1', label: 'Install ps3hen from official site' },
      { id: 'mac2', label: 'USB flash drive (FAT32 formatted)' },
      { id: 'mac3', label: 'PS3 system software 4.90 or lower' },
      { id: 'mac4', label: 'macOS computer with internet connection' },
      { id: 'mac5', label: 'PS3HEN files downloaded' }
    ]
  };

  // Generate Windows checklist
  const windowsContent = document.getElementById('windows');
  if (windowsContent) {
    windowsContent.innerHTML = createChecklistHTML(checklistData.windows, 'Windows');
    windowsContent.innerHTML += createGuideStepsHTML('windows');
  }

  // Generate macOS checklist
  const macosContent = document.getElementById('macos');
  if (macosContent) {
    macosContent.innerHTML = createChecklistHTML(checklistData.macos, 'macOS');
    macosContent.innerHTML += createGuideStepsHTML('macos');
  }

  // Add event listeners to checkboxes
  document.querySelectorAll('.checklist-item input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
      const item = this.closest('.checklist-item');
      item.classList.toggle('completed', this.checked);
      
      // Play a subtle animation when completing an item
      if (this.checked) {
        item.style.transform = 'scale(1.02)';
        setTimeout(() => {
          item.style.transform = '';
        }, 300);
      }
    });
  });
}

/**
 * Create Checklist HTML
 * Helper function to generate checklist markup
 */
function createChecklistHTML(items, platform) {
  let html = `
    <div class="checklist">
      <h3>${platform} Prerequisites Checklist</h3>
  `;
  
  items.forEach(item => {
    html += `
      <div class="checklist-item">
        <input type="checkbox" id="${item.id}" aria-label="${item.label}">
        <label for="${item.id}">${item.label}</label>
      </div>
    `;
  });
  
  html += `</div>`;
  return html;
}

/**
 * Create Guide Steps HTML
 * Helper function to generate guide steps markup
 */
function createGuideStepsHTML(platform) {
  const platformName = platform === 'windows' ? 'Windows' : 'macOS';
  const toolName = platform === 'windows' ? 'PS3Xploit' : 'PS3HEN';
  
  return `
    <div class="guide-steps">
      <div class="step-card">
        <div class="step-number">1</div>
        <h3 class="step-title">Prepare Your PS3</h3>
        <div class="step-content">
          <p>Go to <strong>Settings > System Settings > System Information</strong> and verify your PS3 model and firmware version.</p>
          <div class="warning-box" role="alert">
            <h4>Warning</h4>
            <p>Jailbreaking may void your warranty and get you banned from PSN. Proceed at your own risk.</p>
          </div>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">2</div>
        <h3 class="step-title">Download Required Files</h3>
        <div class="step-content">
          <p>Download the latest version of ${toolName} for ${platformName}:</p>
          <a href="#" class="neon-button" style="display: inline-block; margin-top: 10px;">Download ${toolName}</a>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">3</div>
        <h3 class="step-title">Prepare USB Drive</h3>
        <div class="step-content">
          <p>Format your USB drive to FAT32 and create the following folder structure:</p>
          <pre><code>PS3/UPDATE/PS3UPDAT.PUP</code></pre>
          <p>Place the downloaded files in the correct folders.</p>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">4</div>
        <h3 class="step-title">Run Exploit</h3>
        <div class="step-content">
          <p>Insert the USB drive into your PS3 and follow these steps:</p>
          <ol>
            <li>Navigate to <strong>Settings > System Update</strong></li>
            <li>Select <strong>Update via Storage Media</strong></li>
            <li>Follow the on-screen instructions</li>
          </ol>
        </div>
      </div>
      
      <div class="step-card">
        <div class="step-number">5</div>
        <h3 class="step-title">Install Homebrew</h3>
        <div class="step-content">
          <p>Once jailbroken, install the Homebrew Enabler (HEN) or Custom Firmware (CFW) package.</p>
          <p>After installation, your PS3 will reboot and you'll have access to homebrew applications.</p>
        </div>
      </div>
    </div>
  `;
}

/**
 * Generate Homebrew Apps Gallery
 * Creates the filterable grid of homebrew applications
 */
function generateHomebrewApps() {
  const homebrewApps = [
    {
      id: 1,
      title: 'WebMAN MOD',
      category: 'utility',
      description: 'Allows you to manage your PS3 games, control fan speed, and mount ISO files directly from XMB.',
      rating: '★★★★★',
      icon: 'fa-cogs'
    },
    {
      id: 2,
      title: 'RetroArch',
      category: 'emulator',
      description: 'All-in-one emulator for various retro gaming consoles (NES, SNES, Genesis, etc.).',
      rating: '★★★★☆',
      icon: 'fa-gamepad'
    },
    {
      id: 3,
      title: 'PKGi',
      category: 'utility',
      description: 'Download and install PS3 games directly to your console.',
      rating: '★★★★☆',
      icon: 'fa-download'
    },
    {
      id: 4,
      title: 'MultiMAN',
      category: 'utility',
      description: 'File manager and game launcher for PS3 with support for backup management.',
      rating: '★★★★★',
      icon: 'fa-folder-open'
    },
    {
      id: 5,
      title: 'PPSSPP',
      category: 'emulator',
      description: 'PSP emulator that lets you play PSP games on your PS3.',
      rating: '★★★☆☆',
      icon: 'fa-mobile'
    },
    {
      id: 6,
      title: 'IRISMAN',
      category: 'utility',
      description: 'Alternative file manager with NTFS support and game conversion tools.',
      rating: '★★★★☆',
      icon: 'fa-hdd'
    },
    {
      id: 7,
      title: 'Managunz',
      category: 'utility',
      description: 'Game manager with support for ISO, PKG, and folder games.',
      rating: '★★★★☆',
      icon: 'fa-compact-disc'
    },
    {
      id: 8,
      title: 'PS3 Media Server',
      category: 'utility',
      description: 'Stream media from your computer to your PS3.',
      rating: '★★★★☆',
      icon: 'fa-film'
    }
  ];

  const homebrewGrid = document.querySelector('.homebrew-grid');
  if (!homebrewGrid) return;

  // Clear existing content (if any)
  homebrewGrid.innerHTML = '';

  // Create app cards
  homebrewApps.forEach(app => {
    const appCard = document.createElement('div');
    appCard.className = 'app-card';
    appCard.setAttribute('data-category', app.category);
    appCard.setAttribute('data-title', app.title.toLowerCase());
    
    appCard.innerHTML = `
      <div class="app-image" aria-hidden="true">
        <i class="fas ${app.icon}"></i>
      </div>
      <div class="app-content">
        <h3 class="app-title">${app.title}</h3>
        <span class="app-category">${app.category}</span>
        <p class="app-description">${app.description}</p>
        <div class="rating" aria-label="Rating: ${app.rating.replace(/★/g, 'star ').replace(/☆/g, 'half-star ')}">
          ${app.rating}
        </div>
        <button class="install-button" aria-label="Install guide for ${app.title}">Install Guide</button>
      </div>
    `;
    
    homebrewGrid.appendChild(appCard);
  });

  // Filter functionality
  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const filter = button.getAttribute('data-filter');
      
      // Update active button
      filterButtons.forEach(btn => {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      });
      button.classList.add('active');
      button.setAttribute('aria-pressed', 'true');
      
      // Filter apps
      document.querySelectorAll('.app-card').forEach(card => {
        const shouldShow = filter === 'all' || 
                         card.getAttribute('data-category') === filter;
        card.style.display = shouldShow ? 'block' : 'none';
      });
    });
  });

  // Initialize first filter button
  const firstFilter = document.querySelector('.filter-button');
  if (firstFilter) firstFilter.click();

  // Add hover effects to app cards
  document.querySelectorAll('.app-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.app-image').style.transform = 'scale(1.1)';
    });
    card.addEventListener('mouseleave', () => {
      card.querySelector('.app-image').style.transform = 'scale(1)';
    });
  });
}

/**
 * Generate Tools Table
 * Creates the searchable tools/downloads table
 */
function generateToolsTable() {
  const toolsData = [
    {
      name: 'PS3Xploit',
      version: 'v3.0.2',
      compatibility: 'All CFW-compatible models',
      download: '#',
      checksum: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6'
    },
    {
      name: 'PS3HEN',
      version: 'v3.2.1',
      compatibility: 'All HEN-compatible models',
      download: '#',
      checksum: 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5'
    },
    {
      name: 'MultiMAN',
      version: 'v4.85.00',
      compatibility: 'All models',
      download: '#',
      checksum: 'k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9j0'
    },
    {
      name: 'WebMAN MOD',
      version: 'v1.47.41',
      compatibility: 'All models',
      download: '#',
      checksum: 'p6q7r8s9t0u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5'
    },
    {
      name: 'QA Toggle',
      version: 'v1.0',
      compatibility: 'All models',
      download: '#',
      checksum: 'u1v2w3x4y5z6a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
    },
    {
      name: 'IRISMAN',
      version: 'v4.87',
      compatibility: 'All models',
      download: '#',
      checksum: 'z6a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5'
    }
  ];

  const toolsTable = document.querySelector('.tools-table tbody');
  if (!toolsTable) return;

  // Clear existing rows (if any)
  toolsTable.innerHTML = '';

  // Create table rows
  toolsData.forEach(tool => {
    const row = document.createElement('tr');
    row.setAttribute('data-name', tool.name.toLowerCase());
    
    row.innerHTML = `
      <td>${tool.name}</td>
      <td>${tool.version}</td>
      <td>${tool.compatibility}</td>
      <td>
        <a href="${tool.download}" class="download-link" aria-label="Download ${tool.name}">
          Download
        </a>
        <button class="checksum-button" aria-label="Show checksum for ${tool.name}" aria-expanded="false">
          <i class="fas fa-fingerprint"></i>
        </button>
        <span class="checksum">${tool.checksum}</span>
      </td>
    `;
    
    toolsTable.appendChild(row);
  });

  // Search functionality
  const searchInput = document.getElementById('tool-search');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(() => {
      const searchTerm = searchInput.value.trim().toLowerCase();
      
      document.querySelectorAll('.tools-table tbody tr').forEach(row => {
        const toolName = row.getAttribute('data-name');
        row.style.display = toolName.includes(searchTerm) ? '' : 'none';
      });
    }, 300));
  }

  // Checksum toggle buttons
  document.querySelectorAll('.checksum-button').forEach(button => {
    button.addEventListener('click', function() {
      const checksum = this.nextElementSibling;
      checksum.classList.toggle('visible');
      
      // Update ARIA label
      const isVisible = checksum.classList.contains('visible');
      this.setAttribute('aria-label', 
        isVisible ? 'Hide checksum' : 'Show checksum');
      this.setAttribute('aria-expanded', isVisible);
    });
  });
}

/**
 * Initialize Particles.js Background
 * Creates the animated particle background for the hero section
 */
function initParticles() {
  if (typeof particlesJS !== 'undefined') {
    particlesJS('particles-js', {
      "particles": {
        "number": {
          "value": 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#8A2BE2"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5,
          "random": true,
          "anim": {
            "enable": true,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#8A2BE2",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": true,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "push": {
            "particles_nb": 4
          }
        }
      },
      "retina_detect": true
    });
  } else {
    console.warn('particlesJS not loaded - background animation disabled');
  }
}

/**
 * Update Last Modified Date
 * Displays when the content was last updated
 */
function updateLastModifiedDate() {
  const dateElement = document.getElementById('update-date');
  if (dateElement) {
    const lastUpdated = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    dateElement.textContent = lastUpdated;
  }
}

/**
 * Update Current Year in Footer
 */
function updateCurrentYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Initialize Scroll Reveal Animations
 */
function initScrollReveal() {
  const animateOnScroll = (element, animation) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animation);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(element).forEach(el => {
      observer.observe(el);
    });
  };

  // Add animations to sections
  animateOnScroll('.section', 'fade-in');
  animateOnScroll('.step-card', 'slide-up');
  animateOnScroll('.app-card', 'fade-up');
}

/**
 * Debounce Function
 * Limits how often a function can be called
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this, args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}
