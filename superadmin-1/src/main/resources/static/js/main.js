// Main application controller

// Current active section
let currentSection = 'profile';

// Set active navigation item and load content
function setActive(item) {
  // Update navigation
  const navItems = document.querySelectorAll('nav li');
  navItems.forEach(navItem => {
    navItem.classList.remove('bg-blue-700');
    const link = navItem.querySelector('a');
    if (link) {
      link.classList.remove('active');
    }
  });
  
  const activeItem = document.getElementById(item);
  if (activeItem) {
    activeItem.classList.add('bg-blue-700');
    const activeLink = activeItem.querySelector('a');
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }
  
  // Update content title and load section
  const contentTitle = document.getElementById('content-title');
  const content = document.getElementById('content');
  
  if (!contentTitle || !content) return;
  
  // Hide all section-specific elements
  hideElement('add-manager-section');
  hideElement('export-excel-btn');
  
  // Update current section
  currentSection = item;
  
  // Load appropriate section
  switch (item) {
    case 'profile':
      contentTitle.textContent = 'Super Admin Profile';
      loadProfileSection();
      break;
      
    case 'managers':
      contentTitle.textContent = '';
      loadManagersSection();
      break;
      
    case 'users':
      contentTitle.textContent = 'Users Management';
      loadUsersSection();
      break;
      
    case 'tracking':
      contentTitle.textContent = 'Work Assignment';
      loadWorkAssignedSection();
      break;
      
    case 'trackingSystem':
      contentTitle.textContent = 'Tracking System';
      loadTrackingSystemSection();
      break;
      
    default:
      contentTitle.textContent = 'Dashboard';
      content.innerHTML = '<p class="text-gray-600">Select a section from the sidebar.</p>';
  }
}

// Set login time to current date and time
function setLoginTime() {
  const now = new Date();
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  const loginTime = now.toLocaleString('en-US', options);
  const loginTimeElement = document.getElementById('login-time');
  if (loginTimeElement) {
    loginTimeElement.textContent = loginTime;
  }
}

// Export users to Excel function
async function exportToExcel() {
  if (users.length === 0) {
    showErrorNotification('No users data to export');
    return;
  }
  
  try {
    // Create CSV content
    let csvContent = "";
    
    // Add headers
    const headers = [
      "Name", "Email", "Phone", "Degree", "Institution", "Year", 
      "Skills", "Position", "Company", "Duration", "Projects", 
      "Certifications", "Achievements", "Languages", "Hobbies", 
      "Reference Name", "Reference Position", "Reference Contact"
    ];
    csvContent += headers.join(",") + "\n";
    
    // Add user data
    users.forEach(user => {
      const row = [
        `"${user.personalDetails.name}"`,
        `"${user.personalDetails.email}"`,
        `"${user.personalDetails.phone}"`,
        `"${user.education.degree}"`,
        `"${user.education.institution}"`,
        `"${user.education.year}"`,
        `"${user.skills.join('; ')}"`,
        `"${user.workExperience.position}"`,
        `"${user.workExperience.company}"`,
        `"${user.workExperience.duration}"`,
        `"${user.projects.join('; ')}"`,
        `"${user.certifications.join('; ')}"`,
        `"${user.achievements.join('; ')}"`,
        `"${user.languages.join('; ')}"`,
        `"${user.hobbies.join('; ')}"`,
        `"${user.references.name}"`,
        `"${user.references.position}"`,
        `"${user.references.contact}"`
      ];
      csvContent += row.join(",") + "\n";
    });

    // Check if File System Access API is supported
    if ('showSaveFilePicker' in window) {
      // Use File System Access API for better file saving experience
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'users_data.csv',
        types: [
          {
            description: 'CSV files',
            accept: {
              'text/csv': ['.csv'],
            },
          },
          {
            description: 'Excel files',
            accept: {
              'application/vnd.ms-excel': ['.xls'],
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            },
          },
        ],
      });

      const writable = await fileHandle.createWritable();
      await writable.write(csvContent);
      await writable.close();
      
      showSuccess('Users data exported successfully!');
    } else {
      // Fallback to traditional download method
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "users_data.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      showSuccess('Users data exported successfully!');
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Export failed:', error);
      showErrorNotification('Export failed. Please try again.');
    }
  }
}

// Sidebar toggle functions
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.toggle('open');
    if (sidebar.classList.contains('open')) {
      overlay.style.display = 'block';
    } else {
      overlay.style.display = 'none';
    }
  }
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  
  if (sidebar && overlay) {
    sidebar.classList.remove('open');
    overlay.style.display = 'none';
  }
}

// Initialize sidebar toggle for mobile
function initializeSidebarToggle() {
  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', function(e) {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (window.innerWidth <= 768 && sidebar && sidebar.classList.contains('open')) {
      if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        sidebar.classList.remove('open');
        if (overlay) {
          overlay.style.display = 'none';
        }
      }
    }
  });
  
  // Close sidebar on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeSidebar();
    }
  });
}

// Handle window resize
function handleWindowResize() {
  const sidebar = document.querySelector('.sidebar');
  if (window.innerWidth > 768 && sidebar) {
    sidebar.classList.remove('open');
  }
}

// Initialize search functionality
function initializeSearch() {
  // Add global search functionality if needed
  const searchInputs = document.querySelectorAll('input[type="search"], input[placeholder*="search"], input[placeholder*="Search"]');
  
  searchInputs.forEach(input => {
    // Add search icon if not present
    if (!input.parentElement.querySelector('.search-icon')) {
      const icon = document.createElement('div');
      icon.className = 'search-icon';
      icon.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      `;
      input.parentElement.insertBefore(icon, input);
    }
  });
}

// Initialize keyboard shortcuts
function initializeKeyboardShortcuts() {
  document.addEventListener('keydown', function(e) {
    // Alt + number keys for navigation
    if (e.altKey && !e.ctrlKey && !e.metaKey) {
      switch (e.key) {
        case '1':
          e.preventDefault();
          setActive('profile');
          break;
        case '2':
          e.preventDefault();
          setActive('managers');
          break;
        case '3':
          e.preventDefault();
          setActive('users');
          break;
        case '4':
          e.preventDefault();
          setActive('tracking');
          break;
        case '5':
          e.preventDefault();
          setActive('trackingSystem');
          break;
      }
    }
    
    // Ctrl/Cmd + E for export (when on users section)
    if ((e.ctrlKey || e.metaKey) && e.key === 'e' && currentSection === 'users') {
      e.preventDefault();
      exportToExcel();
    }
  });
}

// Initialize tooltips
function initializeTooltips() {
  // Add tooltips to navigation items
  const navItems = [
    { id: 'profile', tooltip: 'Super Admin Profile (Alt+1)' },
    { id: 'managers', tooltip: 'Managers Management (Alt+2)' },
    { id: 'users', tooltip: 'Users Management (Alt+3)' },
    { id: 'tracking', tooltip: 'Work Assignment (Alt+4)' },
    { id: 'trackingSystem', tooltip: 'Tracking System (Alt+5)' }
  ];
  
  navItems.forEach(item => {
    const element = document.getElementById(item.id);
    if (element) {
      element.title = item.tooltip;
    }
  });
}

// --- Notification Bar Logic ---

// REMOVE the following block from main.js:
// window.notificationQueue = [];
// let lastSeenNotificationTimestamp = 0;
// function notifySuperAdmin(message, type = 'info') { ... }
// function formatDate(date) { ... }
// function updateNotificationBadge() { ... }
// function getUnseenNotificationCount() { ... }
// function renderNotificationPanel() { ... }
// function toggleNotificationPanel() { ... }
// function closeNotificationPanel() { ... }
// function notificationPanelOutsideClick(e) { ... }
// ...and any related notification logic...

// --- End Notification Bar Logic ---

// Initialize app
async function initializeApp() {
  // Set initial login time
  setLoginTime();

  // Update login time every minute
  setInterval(setLoginTime, 60000);

  // Fetch users and managers from backend before loading UI
  await fetchUsersFromBackend();
  await fetchManagersFromBackend();

  // Set default active item
  const profileItem = document.getElementById('profile');
  if (profileItem) {
    profileItem.classList.add('bg-blue-700');
  }

  // Load initial section
  setActive('profile');

  // Initialize components
  initializeSidebarToggle();
  initializeSearch();
  initializeKeyboardShortcuts();
  initializeTooltips();

  // Initialize section-specific functionality
  initializeProfile();
  initializeManagers();
  initializeUsers();
  initializeWorkAssigned();
  initializeTrackingSystem();
  
  // Add window resize handler
  window.addEventListener('resize', handleWindowResize);
  
  // Add visibility change handler to update login time when tab becomes visible
  document.addEventListener('visibilitychange', function() {
    if (!document.hidden) {
      setLoginTime();
    }
  });
  
  console.log('Campus1 Admin Dashboard initialized successfully');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeApp);

// Handle page unload
window.addEventListener('beforeunload', function(e) {
  // Save any pending changes or cleanup
  // This is where you might want to save draft data to localStorage
});

// Global error handler
window.addEventListener('error', function(e) {
  console.error('Global error:', e.error);
  showErrorNotification('An unexpected error occurred. Please refresh the page.');
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', function(e) {
  console.error('Unhandled promise rejection:', e.reason);
  showErrorNotification('An unexpected error occurred. Please try again.');
});

// Patch: Notify on superadmin changes
// Example: After manager/user add/edit/delete, call notifySuperAdmin

// In managers.js, users.js, work-assigned.js, tracking-system.js, after successful add/edit/delete, call:
// notifySuperAdmin('Manager John Doe added', 'success');
// notifySuperAdmin('User Alice updated', 'info');
// notifySuperAdmin('User Bob deleted', 'warning');
// notifySuperAdmin('Bulk assignment completed', 'success');