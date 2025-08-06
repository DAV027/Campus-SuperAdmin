// Users section functionality
let currentUsersTab = 'all';
let usersCurrentPage = 1;
const usersPageSize = 10;
let currentSourceFilter = null; // To track the current source filter

// Load users section
async function loadUsersSection() {
  const content = document.getElementById('content');
  if (!content) return;
  
  // Reset filters when loading the section
  currentSourceFilter = null;
  currentUsersTab = 'all';
  
  await fetchUsersFromBackend();
  
  content.innerHTML = `
    <div class="users-container">
      <div class="users-header">
        <div>
          <h3 class="users-title">
            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Work Data
          </h3>
        </div>
        <div class="users-stats">
          <span class="users-count" id="usersCount">Total: ${users.length} users</span>
        </div>
      </div>
      
      <!-- Tab Navigation -->
      <div class="users-tabs">
        <button onclick="setUsersTab('all')" id="allUsersTab" class="users-tab active">
          All Users
        </button>
        <button onclick="setUsersTab('assigned')" id="assignedUsersTab" class="users-tab">
          Assigned Users
        </button>
      </div>
      
      <!-- Source Filter -->
      <div class="users-source-filter">
        <div class="source-filter-label">Filter by Source:</div>
        <div class="source-filter-buttons">
          <button onclick="setSourceFilter(null)" id="sourceAllBtn" class="source-filter-btn active">
            All Sources
          </button>
          <button onclick="setSourceFilter('LinkedIn')" id="sourceLinkedInBtn" class="source-filter-btn">
            LinkedIn
          </button>
          <button onclick="setSourceFilter('Naukri')" id="sourceNaukriBtn" class="source-filter-btn">
            Naukri
          </button>
          <button onclick="setSourceFilter('Personal')" id="sourcePersonalBtn" class="source-filter-btn">
            Personal
          </button>
        </div>
      </div>
      
      <div class="users-search-container">
        <div class="users-search-wrapper">
          <div class="users-search-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" id="usersSearchInput" placeholder="Search users by name, email or source..." 
                 class="users-search-input" onkeyup="searchUsers()" oninput="searchUsers()">
          <button onclick="clearUsersSearch()" id="clearUsersSearchBtn" class="users-search-clear" style="display: none;">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="users-upload-buttons">
          <button onclick="openUsersExcelUploadDialog()" class="users-upload-btn excel-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Upload Excel
          </button>
          <button onclick="downloadUsersExcel()" class="users-upload-btn excel-btn">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Excel
          </button>
        </div>
      </div>
      
      <div class="users-table-container">
        <table class="users-table">
          <thead class="users-table-header">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Assigned Manager</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody id="usersTableBody" class="users-table-body">
            <!-- Users will be loaded here -->
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  setUsersTab('all');
  setSourceFilter(null); // Initialize with no source filter
}

function setUsersTab(tabName) {
  currentUsersTab = tabName;
  
  // Update tab buttons
  document.querySelectorAll('.users-tab').forEach(tab => tab.classList.remove('active'));
  document.getElementById(tabName + 'UsersTab').classList.add('active');
  
  // Reset to first page when changing tabs
  usersCurrentPage = 1;
  
  displayUsers();
}

function setSourceFilter(source) {
  currentSourceFilter = source;
  
  // Update source filter buttons
  document.querySelectorAll('.source-filter-btn').forEach(btn => btn.classList.remove('active'));
  
  if (source === null) {
    document.getElementById('sourceAllBtn').classList.add('active');
  } else if (source === 'LinkedIn') {
    document.getElementById('sourceLinkedInBtn').classList.add('active');
  } else if (source === 'Naukri') {
    document.getElementById('sourceNaukriBtn').classList.add('active');
  } else if (source === 'Personal') {
    document.getElementById('sourcePersonalBtn').classList.add('active');
  }
  
  // Reset to first page when applying a new filter
  usersCurrentPage = 1;
  
  // Refresh the display with the new filter
  displayUsers();
  
  // Show which filter is applied
  if (source === null) {
    showSuccess('Showing all sources');
  } else {
    showSuccess(`Showing ${source} users only`);
  }
}

function displayUsers() {
  const tableBody = document.getElementById('usersTableBody');
  if (!tableBody) return;
  
  let usersToShow = [...users]; // Create a copy of the users array
  
  // Apply tab filter
  if (currentUsersTab === 'assigned') {
    usersToShow = usersToShow.filter(user => user.assignedTo !== null);
  }
  
  // Apply source filter
  if (currentSourceFilter !== null) {
    usersToShow = usersToShow.filter(user => user.source === currentSourceFilter);
  }
  
  // Apply search filter
  const searchTerm = document.getElementById('usersSearchInput')?.value.toLowerCase();
  if (searchTerm) {
    usersToShow = usersToShow.filter(user => {
      const name = (user.name || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const phone = (user.phone || '').toLowerCase();
      const source = (user.source || '').toLowerCase();
      
      return (
        name.includes(searchTerm) ||
        email.includes(searchTerm) ||
        phone.includes(searchTerm) ||
        source.includes(searchTerm)
      );
    });
  }
  
  const total = usersToShow.length;
  const totalPages = Math.ceil(total / usersPageSize);
  if (usersCurrentPage > totalPages) usersCurrentPage = totalPages || 1;
  const startIdx = (usersCurrentPage - 1) * usersPageSize;
  const endIdx = startIdx + usersPageSize;
  const pageUsers = usersToShow.slice(startIdx, endIdx);
  
  if (pageUsers.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-gray-500">
          <div class="users-empty">
            <div class="users-empty-icon">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h3 class="users-empty-title">No Users Found</h3>
            <p class="users-empty-text">No users match your search criteria.</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = pageUsers.map(user => `
      <tr class="users-table-row">
        <td class="users-table-cell">
          <div class="users-table-cell-id">${user.id}</div>
        </td>
        <td class="users-table-cell">
          <div class="users-table-cell-name">${user.name || '-'}</div>
        </td>
        <td class="users-table-cell">
          <div class="users-table-cell-contact">${user.email || '-'}</div>
        </td>
        <td class="users-table-cell">
          <div class="users-table-cell-contact">${user.phone || '-'}</div>
        </td>
        <td class="users-table-cell">
          <div class="users-table-cell-assigned">${user.assignedToName || 'Not assigned'}</div>
        </td>
        <td class="users-table-cell">
          <div class="users-table-cell-source">
            ${user.source ? `<span class="source-badge source-${user.source.toLowerCase()}">${user.source}</span>` : '-'}
          </div>
        </td>
      </tr>
    `).join('');
  }
  
  updateUsersCount();
  renderUsersPagination(totalPages);
}

// Render pagination controls for users
function renderUsersPagination(totalPages) {
  let paginationHtml = '';
  if (totalPages > 1) {
    paginationHtml = `<div class="pagination">`;
    paginationHtml += `<button onclick="usersGoToPage(${usersCurrentPage-1})" ${usersCurrentPage===1?'disabled':''}>&laquo; Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `<button onclick="usersGoToPage(${i})" ${i===usersCurrentPage?'class="active"':''}>${i}</button>`;
    }
    paginationHtml += `<button onclick="usersGoToPage(${usersCurrentPage+1})" ${usersCurrentPage===totalPages?'disabled':''}>Next &raquo;</button>`;
    paginationHtml += `</div>`;
  }
  
  const table = document.querySelector('.users-table-container');
  if (table) {
    let pagDiv = table.querySelector('.pagination');
    if (pagDiv) pagDiv.remove();
    table.insertAdjacentHTML('beforeend', paginationHtml);
  }
}

// Go to page for users
function usersGoToPage(page) {
  const total = users.length;
  const totalPages = Math.ceil(total / usersPageSize);
  if (page < 1 || page > totalPages) return;
  usersCurrentPage = page;
  displayUsers();
}

// Search users
function searchUsers() {
  const searchInput = document.getElementById('usersSearchInput');
  const clearBtn = document.getElementById('clearUsersSearchBtn');
  
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.trim();
  
  // Show/hide clear button
  if (clearBtn) {
    clearBtn.style.display = searchTerm ? 'block' : 'none';
  }
  
  // Reset to first page when searching
  usersCurrentPage = 1;
  
  displayUsers();
}

// Clear users search
function clearUsersSearch() {
  const searchInput = document.getElementById('usersSearchInput');
  const clearBtn = document.getElementById('clearUsersSearchBtn');
  
  if (searchInput) searchInput.value = '';
  if (clearBtn) clearBtn.style.display = 'none';
  
  // Reset to first page when clearing search
  usersCurrentPage = 1;
  
  displayUsers();
}

// Update users count display
function updateUsersCount() {
  const usersCount = document.getElementById('usersCount');
  if (usersCount) {
    const total = users.length;
    usersCount.textContent = `Total: ${total} users`;
  }
}

// Open user details modal
function openUserModal(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  createUserModal(user);
  openModal('userModal');
}

// Create user details modal
function createUserModal(user) {
  const modalId = 'userModal';
  
  // Remove existing modal
  const existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal container
  const modalsContainer = document.getElementById('modals-container');
  if (!modalsContainer) {
    console.error('Modals container not found');
    return;
  }
  
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 64rem; width: 90vw;">
      <div class="modal-header">
        <h3 class="modal-title">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          User Details - ${user.name}
        </h3>
        <button type="button" class="modal-close" onclick="closeModal('${modalId}')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <div class="user-details-grid">
          <!-- Personal Details Card -->
          <div class="user-details-card">
            <div class="user-details-card-header" style="background: linear-gradient(to right, #dbeafe, #bfdbfe);">
              <h4 class="user-details-card-title" style="color: #1e40af;">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </h4>
            </div>
            <div class="user-details-card-body">
              <div class="user-info-grid">
                <div class="user-info-item">
                  <div class="user-info-label">Full Name</div>
                  <div class="user-info-value">${user.name || '-'}</div>
                </div>
                <div class="user-info-item">
                  <div class="user-info-label">Email Address</div>
                  <div class="user-info-value">${user.email || '-'}</div>
                </div>
                <div class="user-info-item">
                  <div class="user-info-label">Phone Number</div>
                  <div class="user-info-value">${user.phone || '-'}</div>
                </div>
                <div class="user-info-item">
                  <div class="user-info-label">Source</div>
                  <div class="user-info-value">${user.source || '-'}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Education Card -->
          <div class="user-details-card">
            <div class="user-details-card-header" style="background: linear-gradient(to right, #fef3c7, #fde68a);">
              <h4 class="user-details-card-title" style="color: #92400e;">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                </svg>
                Education
              </h4>
            </div>
            <div class="user-details-card-body">
              <div class="user-info-grid">
                <div class="user-info-item">
                  <div class="user-info-label">Degree</div>
                  <div class="user-info-value">${user.degree || '-'}</div>
                </div>
                <div class="user-info-item">
                  <div class="user-info-label">Institution</div>
                  <div class="user-info-value">${user.institution || '-'}</div>
                </div>
                <div class="user-info-item">
                  <div class="user-info-label">Graduation Year</div>
                  <div class="user-info-value">${user.year || '-'}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Skills Card -->
          <div class="user-details-card">
            <div class="user-details-card-header" style="background: linear-gradient(to right, #dcfce7, #bbf7d0);">
              <h4 class="user-details-card-title" style="color: #166534;">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Technical Skills
              </h4>
            </div>
            <div class="user-details-card-body">
              <div class="user-skills-grid">
                ${user.skills ? user.skills.map(skill => 
                  `<span class="user-skill-tag">${skill}</span>`
                ).join('') : '<span class="text-gray-500">No skills listed</span>'}
              </div>
            </div>
          </div>
          
          <!-- Work Experience Card -->
          <div class="user-details-card">
            <div class="user-details-card-header" style="background: linear-gradient(to right, #e0e7ff, #c7d2fe);">
              <h4 class="user-details-card-title" style="color: #3730a3;">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                </svg>
                Work Experience
              </h4>
            </div>
            <div class="user-details-card-body">
              <div class="user-info-grid">
                <div class="user-info-item">
                  <div class="user-info-label">Position</div>
                  <div class="user-info-value">${user.position || '-'}</div>
                </div>
                <div class="user-info-item">
                  <div class="user-info-label">Company</div>
                  <div class="user-info-value">${user.company || '-'}</div>
                </div>
                <div class="user-info-item">
                  <div class="user-info-label">Duration</div>
                  <div class="user-info-value">${user.duration || '-'}</div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Projects Card -->
          <div class="user-details-card">
            <div class="user-details-card-header" style="background: linear-gradient(to right, #fce7f3, #fbcfe8);">
              <h4 class="user-details-card-title" style="color: #be185d;">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Projects
              </h4>
            </div>
            <div class="user-details-card-body">
              <div class="user-projects-list">
                ${user.projects ? user.projects.map(project => `
                  <div class="user-project-item">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span class="user-project-text">${project}</span>
                  </div>
                `).join('') : '<div class="text-gray-500">No projects listed</div>'}
              </div>
            </div>
          </div>
          
          <!-- Additional sections can be added here for certifications, achievements, etc. -->
        </div>
      </div>
    </div>
  `;
  
  // Add click outside to close functionality
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });
  
  modalsContainer.appendChild(modal);
}

// Upload users Excel (.xlsx or .xls)
async function uploadUsersExcel(file, source) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('source', source); // Add source as a form parameter
  
  try {
    // Upload the file with source parameter
    const res = await fetch('http://localhost:8080/api/users/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!res.ok) throw new Error('Upload failed');
    
    showSuccess(`Users uploaded successfully with source: ${source}!`);
    await fetchUsersFromBackend();
    displayUsers();
  } catch (e) {
    console.error('Error:', e);
    showErrorNotification('Failed to upload users Excel');
  }
}

// Download users Excel
function downloadUsersExcel() {
  fetch('http://localhost:8080/api/users/download')
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'users.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    });
}

// Open file dialog for Excel upload (.xlsx or .xls)
function openUsersExcelUploadDialog() {
  // First, ask for the source
  createSourceSelectionModal();
}

// Create source selection modal
function createSourceSelectionModal() {
  const modalId = 'sourceSelectionModal';
  
  // Remove existing modal
  const existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }
  
  // Create modal container
  const modalsContainer = document.getElementById('modals-container');
  if (!modalsContainer) {
    console.error('Modals container not found');
    return;
  }
  
  const modal = document.createElement('div');
  modal.id = modalId;
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h3 class="modal-title">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          Select Source
        </h3>
        <button type="button" class="modal-close" onclick="closeModal('${modalId}')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div class="modal-body">
        <p class="text-gray-600 mb-4">Please select the source for the users you are about to upload:</p>
        
        <div class="source-selection-grid">
          <div class="source-option" onclick="selectSourceAndContinue('LinkedIn')">
            <div class="source-option-icon linkedin-icon">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </div>
            <div class="source-option-title">LinkedIn</div>
          </div>
          
          <div class="source-option" onclick="selectSourceAndContinue('Naukri')">
            <div class="source-option-icon naukri-icon">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2c5.514 0 10 4.486 10 10s-4.486 10-10 10-10-4.486-10-10 4.486-10 10-10zm0 18c4.411 0 8-3.589 8-8s-3.589-8-8-8-8 3.589-8 8 3.589 8 8 8zm-1-13h-2v6h2v-6zm0 8h-2v2h2v-2z"/>
              </svg>
            </div>
            <div class="source-option-title">Naukri</div>
          </div>
          
          <div class="source-option" onclick="selectSourceAndContinue('Personal')">
            <div class="source-option-icon personal-icon">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div class="source-option-title">Personal</div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add click outside to close functionality
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      closeModal(modalId);
    }
  });
  
  modalsContainer.appendChild(modal);
}

// Select source and continue with file upload
function selectSourceAndContinue(source) {
  closeModal('sourceSelectionModal');
  // Always create a new input for each upload to avoid browser caching issues
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  input.style.display = 'none';
  input.onchange = (event) => handleUsersExcelUpload(event, source);
  document.body.appendChild(input);
  input.value = '';
  input.click();
  // Remove input after use to avoid stale state
  input.addEventListener('change', () => setTimeout(() => input.remove(), 1000));
}

// Handle Excel file selection and upload
function handleUsersExcelUpload(event, source) {
  const file = event.target.files[0];
  if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
    uploadUsersExcelWithSource(file, source);
  } else {
    showErrorNotification('Please select a valid Excel (.xlsx or .xls) file.');
  }
}

// Upload users Excel with source
async function uploadUsersExcelWithSource(file, source) {
  // Always use the provided source for this upload
  const formData = new FormData();
  formData.append('file', file);
  formData.append('source', source);

  try {
    const res = await fetch('http://localhost:8080/api/users/upload', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Upload failed:', errorText);
      throw new Error('Upload failed');
    }

    showSuccess(`Users uploaded successfully with source: ${source}!`);
    await fetchUsersFromBackend();
    displayUsers();
  } catch (e) {
    console.error('Error:', e);
    showErrorNotification('Failed to upload users Excel');
  }
}

// Add user (call after collecting user data from a form)
async function addUser(userData) {
  try {
    const res = await fetch('http://localhost:8080/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!res.ok) throw new Error('Failed to add user');
    
    await fetchUsersFromBackend();
    displayUsers();
    showSuccess('User added successfully!');
    notifySuperAdmin(`User "${userData.name}" added`, 'success');
  } catch (error) {
    showErrorNotification('Failed to add user.');
  }
}

// Edit user (call after collecting updated user data from a form)
async function editUser(userId, userData) {
  try {
    const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    
    if (!res.ok) throw new Error('Failed to update user');
    
    await fetchUsersFromBackend();
    displayUsers();
    showSuccess('User updated successfully!');
    notifySuperAdmin(`User "${userData.name}" updated`, 'info');
  } catch (error) {
    showErrorNotification('Failed to update user.');
  }
}

// Delete user
async function deleteUser(userId) {
  try {
    await fetch(`http://localhost:8080/api/users/${userId}`, { method: 'DELETE' });
    
    await fetchUsersFromBackend();
    displayUsers();
    showSuccess('User deleted successfully!');
    notifySuperAdmin(`User with ID ${userId} deleted`, 'warning');
  } catch (error) {
    showErrorNotification('Failed to delete user.');
  }
}

// Initialize users section
function initializeUsers() {
  // Add debounced search
  const debouncedSearch = debounce(searchUsers, 300);
  window.searchUsers = debouncedSearch;
}

window.loadUsersSection = loadUsersSection;