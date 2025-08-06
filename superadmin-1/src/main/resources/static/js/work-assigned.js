// Work Assigned section functionality
let selectedUsers = [];
let workAssignedCurrentPage = 1;
const workAssignedPageSize = 10;
let idRangeFrom = null;
let idRangeTo = null;

// Load work assigned section
async function loadWorkAssignedSection() {
  const content = document.getElementById('content');
  if (!content) return;
  
  await fetchUsersFromBackend();
  
  content.innerHTML = `
    <div class="work-assigned-container">
      <div class="work-assigned-header">
        <div>
          <h3 class="work-assigned-title">
            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            Work Assignment
          </h3>
        </div>
        <div class="work-assigned-stats">
          <span class="work-assigned-count" id="workAssignedUserCount">Users: ${getNotAssignedUsers().length}</span>
        </div>
      </div>
      
      <div class="work-assigned-search-container">
        <div class="work-assigned-search-wrapper">
          <div class="work-assigned-search-icon">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input type="text" id="workAssignedSearchInput" placeholder="Search users by name, email or source..." 
                 class="work-assigned-search-input" onkeyup="searchWorkAssignedUsers()" oninput="searchWorkAssignedUsers()">
          <button onclick="clearWorkAssignedSearch()" id="clearWorkAssignedSearchBtn" class="work-assigned-search-clear" style="display: none;">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- ID Range Bar -->
        <div class="work-assigned-id-range-bar">
          <div class="work-assigned-range-group">
            <label for="workAssignedIdFrom">From ID:</label>
            <input type="number" id="workAssignedIdFrom" class="work-assigned-range-input" placeholder="From" min="1">
          </div>
          <div class="work-assigned-range-group">
            <label for="workAssignedIdTo">To ID:</label>
            <input type="number" id="workAssignedIdTo" class="work-assigned-range-input" placeholder="To" min="1">
          </div>
          <button onclick="applyIdRange()" class="work-assigned-range-btn">
            Apply Range
          </button>
        </div>
      </div>
      
      <div class="work-assigned-controls">
        <div class="work-assigned-bulk-actions">
          <label class="work-assigned-select-all">
            <input type="checkbox" id="selectAllUsers" onchange="toggleSelectAllUsers()">
            <span>Select All</span>
          </label>
          <button onclick="openBulkAssignmentModal()" id="bulkAssignBtn" class="work-assigned-assign-btn" disabled>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Assign Selected to Manager
          </button>
        </div>
      </div>
      
      <div class="work-assigned-table-container">
        <table class="work-assigned-table">
          <thead class="work-assigned-table-header">
            <tr>
              <th class="work-assigned-table-cell-checkbox">
                <input type="checkbox" id="selectAllHeader" onchange="toggleSelectAllUsers()">
              </th>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody id="notAssignedUsersTableBody" class="work-assigned-table-body">
            <!-- Not assigned users will be loaded here -->
          </tbody>
        </table>
      </div>
    </div>
  `;
  
  // Reset range variables when loading the section
  idRangeFrom = null;
  idRangeTo = null;
  
  displayNotAssignedUsers();
}

// Get users not assigned to any manager
function getNotAssignedUsers() {
  return users.filter(user => user.assignedTo === undefined || user.assignedTo === null);
}

// Display not assigned users with pagination
function displayNotAssignedUsers() {
  const tableBody = document.getElementById('notAssignedUsersTableBody');
  if (!tableBody) return;
  
  let notAssignedUsers = getNotAssignedUsers();
  
  // Apply ID range filter
  if (idRangeFrom !== null || idRangeTo !== null) {
    const minId = idRangeFrom !== null ? idRangeFrom : 1;
    const maxId = idRangeTo !== null ? idRangeTo : Number.MAX_SAFE_INTEGER;
    
    notAssignedUsers = notAssignedUsers.filter(user => 
      user.id >= minId && user.id <= maxId
    );
  }
  
  // Apply search filter
  const searchTerm = document.getElementById('workAssignedSearchInput')?.value.toLowerCase();
  if (searchTerm) {
    notAssignedUsers = notAssignedUsers.filter(user => 
      (user.name && user.name.toLowerCase().includes(searchTerm)) || 
      (user.email && user.email.toLowerCase().includes(searchTerm)) ||
      (user.source && user.source.toLowerCase().includes(searchTerm))
    );
  }
  
  const total = notAssignedUsers.length;
  const totalPages = Math.ceil(total / workAssignedPageSize);
  if (workAssignedCurrentPage > totalPages) workAssignedCurrentPage = totalPages || 1;
  const startIdx = (workAssignedCurrentPage - 1) * workAssignedPageSize;
  const endIdx = startIdx + workAssignedPageSize;
  const pageUsers = notAssignedUsers.slice(startIdx, endIdx);
  
  if (pageUsers.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="6" class="px-6 py-12 text-center text-gray-500">
          <div class="work-assigned-empty">
            <div class="work-assigned-empty-icon">
              <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="work-assigned-empty-title">No Unassigned Users</h3>
            <p class="work-assigned-empty-text">All users have been assigned to managers.</p>
          </div>
        </td>
      </tr>
    `;
  } else {
    tableBody.innerHTML = pageUsers.map(user => `
      <tr class="work-assigned-table-row">
        <td class="work-assigned-table-cell work-assigned-table-cell-checkbox">
          <input type="checkbox" class="user-checkbox" data-user-id="${user.id}" onchange="updateBulkAssignButton()">
        </td>
        <td class="work-assigned-table-cell">
          <div class="work-assigned-table-cell-id">${user.id}</div>
        </td>
        <td class="work-assigned-table-cell">
          <div class="work-assigned-table-cell-name">${user.name || '-'}</div>
        </td>
        <td class="work-assigned-table-cell">
          <div class="work-assigned-table-cell-contact">${user.email || '-'}</div>
        </td>
        <td class="work-assigned-table-cell">
          <div class="work-assigned-table-cell-contact">${user.phone || '-'}</div>
        </td>
        <td class="work-assigned-table-cell">
          <div class="work-assigned-table-cell-source">${user.source || '-'}</div>
        </td>
      </tr>
    `).join('');
  }
  
  updateAssignedUsersCount();
  renderWorkAssignedPagination(totalPages);
}

function applyIdRange() {
  const idFromInput = document.getElementById('workAssignedIdFrom');
  const idToInput = document.getElementById('workAssignedIdTo');
  
  // Get the values from the input fields
  const fromValue = idFromInput.value;
  const toValue = idToInput.value;
  
  // Parse the values to integers
  idRangeFrom = fromValue ? parseInt(fromValue) : null;
  idRangeTo = toValue ? parseInt(toValue) : null;
  
  // Validate the range
  if (idRangeFrom !== null && isNaN(idRangeFrom)) {
    showErrorNotification('Please enter a valid "From ID"');
    return;
  }
  
  if (idRangeTo !== null && isNaN(idRangeTo)) {
    showErrorNotification('Please enter a valid "To ID"');
    return;
  }
  
  if (idRangeFrom !== null && idRangeTo !== null && idRangeFrom > idRangeTo) {
    showErrorNotification('"From ID" must be less than or equal to "To ID"');
    return;
  }
  
  // Reset to first page when applying a new filter
  workAssignedCurrentPage = 1;
  
  // Refresh the display with the new range
  displayNotAssignedUsers();
  
  // Show success message
  if (idRangeFrom !== null && idRangeTo !== null) {
    showSuccess(`Applied ID range: ${idRangeFrom} to ${idRangeTo}`);
  } else if (idRangeFrom !== null) {
    showSuccess(`Applied ID range: from ${idRangeFrom}`);
  } else if (idRangeTo !== null) {
    showSuccess(`Applied ID range: to ${idRangeTo}`);
  } else {
    showSuccess('ID range cleared');
  }
}

// Render pagination controls for work assigned users
function renderWorkAssignedPagination(totalPages) {
  let paginationHtml = '';
  if (totalPages > 1) {
    paginationHtml = `<div class="pagination">`;
    paginationHtml += `<button onclick="workAssignedGoToPage(${workAssignedCurrentPage-1})" ${workAssignedCurrentPage===1?'disabled':''}>&laquo; Prev</button>`;
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `<button onclick="workAssignedGoToPage(${i})" ${i===workAssignedCurrentPage?'class="active"':''}>${i}</button>`;
    }
    paginationHtml += `<button onclick="workAssignedGoToPage(${workAssignedCurrentPage+1})" ${workAssignedCurrentPage===totalPages?'disabled':''}>Next &raquo;</button>`;
    paginationHtml += `</div>`;
  }
  
  const table = document.querySelector('.work-assigned-table-container');
  if (table) {
    let pagDiv = table.querySelector('.pagination');
    if (pagDiv) pagDiv.remove();
    table.insertAdjacentHTML('beforeend', paginationHtml);
  }
}

// Go to page for work assigned users
function workAssignedGoToPage(page) {
  const total = getNotAssignedUsers().length;
  const totalPages = Math.ceil(total / workAssignedPageSize);
  if (page < 1 || page > totalPages) return;
  workAssignedCurrentPage = page;
  displayNotAssignedUsers();
}

// Toggle select all users
function toggleSelectAllUsers() {
  const selectAllCheckbox = document.getElementById('selectAllUsers');
  const userCheckboxes = document.querySelectorAll('.user-checkbox');
  
  if (!selectAllCheckbox) return;
  
  userCheckboxes.forEach(checkbox => {
    checkbox.checked = selectAllCheckbox.checked;
  });
  
  updateBulkAssignButton();
}

// Update bulk assign button state
function updateBulkAssignButton() {
  const userCheckboxes = document.querySelectorAll('.user-checkbox:checked');
  const bulkAssignBtn = document.getElementById('bulkAssignBtn');
  const selectAllCheckbox = document.getElementById('selectAllUsers');
  
  if (bulkAssignBtn) {
    bulkAssignBtn.disabled = userCheckboxes.length === 0;
  }
  
  // Update select all checkbox state
  if (selectAllCheckbox) {
    const allCheckboxes = document.querySelectorAll('.user-checkbox');
    const checkedCheckboxes = document.querySelectorAll('.user-checkbox:checked');
    
    if (checkedCheckboxes.length === 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedCheckboxes.length === allCheckboxes.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    }
  }
}

// Open bulk assignment modal
function openBulkAssignmentModal() {
  const checkedCheckboxes = document.querySelectorAll('.user-checkbox:checked');
  
  if (checkedCheckboxes.length === 0) {
    showErrorNotification('Please select users to assign');
    return;
  }
  
  if (managers.length === 0) {
    showErrorNotification('No managers available. Please add managers first.');
    return;
  }
  
  selectedUsers = Array.from(checkedCheckboxes).map(checkbox => {
    const userId = parseInt(checkbox.dataset.userId);
    return users.find(user => user.id === userId);
  }).filter(Boolean);
  
  createBulkAssignmentModal();
  openModal('bulkAssignmentModal');
}

// Create bulk assignment modal
function createBulkAssignmentModal() {
  const modalId = 'bulkAssignmentModal';
  
  // Remove existing modal
  const existingModal = document.getElementById(modalId);
  if (existingModal) {
    existingModal.remove();
  }
  
  const modal = createModalOverlay(modalId);
  modal.innerHTML = `
    <div class="assignment-modal-content">
      <div class="assignment-modal-header">
        <h3 class="assignment-modal-title">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Assign Users to Manager
        </h3>
      </div>
      
      <div class="assignment-modal-body">
        <p class="text-gray-600 mb-4">Assigning ${selectedUsers.length} user(s) to a manager:</p>
        <div class="mb-4 max-h-32 overflow-y-auto bg-gray-50 p-3 rounded-lg">
          ${selectedUsers.map(user => `
            <div class="text-sm text-gray-700 mb-1">• ${user.name}</div>
          `).join('')}
        </div>
        
        <form id="bulkAssignmentForm" class="assignment-form">
          <div class="assignment-form-field">
            <label for="selectedManager" class="assignment-form-label">
              <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Select Manager
            </label>
            <select id="selectedManager" name="manager" class="assignment-form-select" required>
              <option value="">Choose a manager...</option>
              ${managers.map(manager => `
                <option value="${manager.id}">${manager.name} (${manager.role})</option>
              `).join('')}
            </select>
          </div>
        </form>
      </div>
      
      <div class="assignment-modal-actions">
        <button type="button" onclick="closeModal('${modalId}')" class="assignment-modal-btn assignment-modal-btn-secondary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Cancel
        </button>
        <button type="button" onclick="processBulkAssignment()" class="assignment-modal-btn assignment-modal-btn-primary">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          Assign Users
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
}

// Process bulk assignment
async function processBulkAssignment() {
  const managerSelect = document.getElementById('selectedManager');
  if (!managerSelect || !managerSelect.value) {
    showErrorNotification('Please select a manager');
    return;
  }
  
  const managerId = parseInt(managerSelect.value);
  const manager = managers.find(m => m.id === managerId);
  if (!manager) {
    showErrorNotification('Invalid manager selection');
    return;
  }
  
  try {
    let assignedCount = 0;
    // Persist each assignment to backend
    for (const user of selectedUsers) {
      const updatedUser = { ...user, assignedTo: manager.id, assignedToName: manager.name };
      await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      assignedCount++;
    }
    
    showSuccess(`${assignedCount} user(s) assigned to ${manager.name} successfully!`);
    notifySuperAdmin(`${assignedCount} user(s) assigned to ${manager.name}`, 'success');
    selectedUsers = [];
    
    const selectAllCheckbox = document.getElementById('selectAllUsers');
    if (selectAllCheckbox) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    }
    
    await fetchUsersFromBackend();
    displayNotAssignedUsers();
    closeModal('bulkAssignmentModal');
  } catch (error) {
    console.error('Error processing bulk assignment:', error);
    showErrorNotification('Failed to assign users. Please try again.');
  }
}

// Assign individual user to manager
async function assignUserToManager(userId) {
  if (managers.length === 0) {
    showErrorNotification('No managers available. Please add managers first.');
    return;
  }
  
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  const managerOptions = managers.map((manager) => 
    `${manager.id}: ${manager.name} (${manager.role})`
  ).join('\n');
  
  const selectedManagerId = prompt(`Select a manager to assign "${user.name}" to:\n${managerOptions}\n\nEnter the manager ID:`);
  if (selectedManagerId === null) return;
  
  const managerId = parseInt(selectedManagerId);
  const manager = managers.find(m => m.id === managerId);
  if (!manager) {
    showErrorNotification('Invalid manager selection.');
    return;
  }
  
  try {
    const updatedUser = { ...user, assignedTo: manager.id, assignedToName: manager.name };
    await fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedUser)
    });
    
    showSuccess(`User assigned to ${manager.name} successfully!`);
    notifySuperAdmin(`User "${user.name}" assigned to ${manager.name}`, 'info');
    await fetchUsersFromBackend();
    displayNotAssignedUsers();
  } catch (error) {
    console.error('Error assigning user:', error);
    showErrorNotification('Failed to assign user. Please try again.');
  }
}

// Open work assigned user modal
function openWorkAssignedUserModal(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  
  // Reuse the user modal from users.js
  openUserModal(userId);
}

// Search work assigned users
function searchWorkAssignedUsers() {
  const searchInput = document.getElementById('workAssignedSearchInput');
  const clearBtn = document.getElementById('clearWorkAssignedSearchBtn');
  
  if (!searchInput) return;
  
  const searchTerm = searchInput.value.trim();
  
  // Show/hide clear button
  if (clearBtn) {
    clearBtn.style.display = searchTerm ? 'block' : 'none';
  }
  
  // Apply filters
  displayNotAssignedUsers();
}

// Clear work assigned search
function clearWorkAssignedSearch() {
  const searchInput = document.getElementById('workAssignedSearchInput');
  const clearBtn = document.getElementById('clearWorkAssignedSearchBtn');
  const idFromInput = document.getElementById('workAssignedIdFrom');
  const idToInput = document.getElementById('workAssignedIdTo');
  
  if (searchInput) {
    searchInput.value = '';
  }
  
  if (clearBtn) {
    clearBtn.style.display = 'none';
  }
  
  if (idFromInput) {
    idFromInput.value = '';
  }
  
  if (idToInput) {
    idToInput.value = '';
  }
  
  // Reset range variables
  idRangeFrom = null;
  idRangeTo = null;
  
  displayNotAssignedUsers();
}

// Update assigned users count
function updateAssignedUsersCount() {
  const countElement = document.getElementById('workAssignedUserCount');
  if (countElement) {
    const notAssignedCount = getNotAssignedUsers().length;
    countElement.textContent = `Users: ${notAssignedCount}`;
  }
}

// Initialize work assigned section
function initializeWorkAssigned() {
  // Add event listeners for dynamic content
  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('user-checkbox')) {
      updateBulkAssignButton();
    }
  });
}