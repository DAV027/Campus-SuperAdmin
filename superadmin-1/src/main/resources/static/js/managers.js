// Managers section functionality

// Load managers section
async function loadManagersSection() {
  const content = document.getElementById('content');
  if (!content) return;

  // Always fetch latest managers before rendering
  await fetchManagersFromBackend();

  // Count admins
  const totalAdmins = managers.filter(m => m.role === 'Admin').length;

  content.innerHTML = `
    <div class="managers-container">
      <div class="managers-header">
        <div>
          <h3 class="managers-title">
            <svg class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Management
          </h3>
        </div>
        <div class="managers-stats">
          <span class="managers-count" id="managersCount">Total: ${managers.filter(m => m.role === 'Manager').length} managers</span>
          <span class="admins-count" id="adminsCount" style="margin-left:1rem;">Total: ${totalAdmins} admins</span>
        </div>
		<div class="managers-add-button">
		          <button onclick="openManagerModal()" class="btn btn-primary">Add Manager/Admin</button>
		</div>
      </div>
      ${renderManagerSearchBar()}
      <div id="managersGrid" class="managers-grid">
        <!-- Managers will be loaded here -->
      </div>
    </div>
  `;
  
  
  // Load managers
  displayManagers();
}

let managersCurrentPage = 1;
const managersPageSize = 6;
let managerSearchTerm = "";

// Display managers and admins in grid with pagination and search filter
function displayManagers() {
  const managersGrid = document.getElementById('managersGrid');
  if (!managersGrid) return;

  // Filter managers by search term
  let filteredManagers = managers;
  if (managerSearchTerm && managerSearchTerm.trim() !== "") {
    const term = managerSearchTerm.trim().toLowerCase();
    filteredManagers = managers.filter(m =>
      m.name.toLowerCase().includes(term) ||
      m.email.toLowerCase().includes(term) ||
      m.phone.toLowerCase().includes(term) ||
      (m.role && m.role.toLowerCase().includes(term))
    );
  }

  const total = filteredManagers.length;
  const totalPages = Math.ceil(total / managersPageSize);
  if (managersCurrentPage > totalPages) managersCurrentPage = totalPages || 1;
  const startIdx = (managersCurrentPage - 1) * managersPageSize;
  const endIdx = startIdx + managersPageSize;
  const pageManagers = filteredManagers.slice(startIdx, endIdx);

  if (filteredManagers.length === 0) {
    managersGrid.innerHTML = `
      <div class="managers-empty">
        <div class="managers-empty-icon">
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h3 class="managers-empty-title">No Managers Found</h3>
        <p class="managers-empty-text">No managers match your search criteria.</p>
      </div>
    `;
    // Render pagination at the bottom (empty state)
    renderManagersPagination(totalPages);
    return;
  }

  // Render cards
  managersGrid.innerHTML = pageManagers.map((manager, idx) => {
    // For admins, show assigned manager info
    let assignedManager = null;
    if (manager.role === 'Admin' && manager.assignedTo) {
      assignedManager = managers.find(m => m.id === manager.assignedTo);
    }
    return `
      <div class="manager-card${manager.role === 'Admin' ? ' admin-card' : ''}" style="${manager.role === 'Admin' ? 'border:2px solid #f59e42;background:#fff7ed;' : ''}">
        <div class="manager-card-header">
          <div class="manager-avatar">
            <svg class="w-8 h-8 ${manager.role === 'Admin' ? 'text-orange-500' : 'text-white'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h4 class="manager-name">${manager.name}</h4>
          <p class="manager-role" style="${manager.role === 'Admin' ? 'color:#f59e42;font-weight:bold;' : ''}">${manager.role}</p>
        </div>
        <div class="manager-card-body">
          <div class="manager-info">
            <div class="manager-info-item">
              <span class="manager-info-text">${manager.email}</span>
            </div>
            <div class="manager-info-item">
              <span class="manager-info-text">${manager.phone}</span>
            </div>
            ${manager.role === 'Admin' ? `
              <div class="manager-info-item">
                <span class="manager-info-text">Assigned to: ${assignedManager ? assignedManager.name : 'None'}</span>
              </div>
            ` : ''}
          </div>
        </div>
        <div class="manager-card-actions">
          <div>
            <div class="manager-stats">
              <span class="manager-assigned-count">
                ${getAssignedUsersCount(manager.id)} users
              </span>
              ${manager.role === 'Manager' ? `
                <span class="manager-assigned-count" style="background-color: #fef3c7; color: #92400e;">
                  ${getAssignedAdminsCount(manager.id)} admins
                </span>
              ` : ''}
            </div>
            ${manager.role === 'Admin' && manager.assignedTo !== null && manager.assignedTo !== undefined ? `
              <div class="manager-assigned-to">
                <span class="manager-assigned-to-label">Reports to:</span>
                <span class="manager-assigned-to-name">${assignedManager ? assignedManager.name : 'Unknown'}</span>
              </div>
            ` : ''}
          </div>
          <div style="display: flex; gap: 0.5rem;">
            <button onclick="editManagerById(${manager.id})" class="manager-edit-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </button>
            <button onclick="deleteManagerById(${manager.id})" class="manager-delete-btn">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  updateManagersCount();

  // Render pagination at the bottom of the container (outside the grid)
  const container = document.querySelector('.managers-container');
  if (container) {
    let oldPagination = container.querySelector('.pagination');
    if (oldPagination) oldPagination.remove();
    if (totalPages > 1) {
      let paginationHtml = `<div class="pagination">`;
      paginationHtml += `<button onclick="managersGoToPage(${managersCurrentPage-1})" ${managersCurrentPage===1?'disabled':''}>&laquo; Prev</button>`;
      for (let i = 1; i <= totalPages; i++) {
        paginationHtml += `<button onclick="managersGoToPage(${i})" ${i===managersCurrentPage?'class="active"':''}>${i}</button>`;
      }
      paginationHtml += `<button onclick="managersGoToPage(${managersCurrentPage+1})" ${managersCurrentPage===totalPages?'disabled':''}>Next &raquo;</button>`;
      paginationHtml += `</div>`;
      container.insertAdjacentHTML('beforeend', paginationHtml);
    }
  }
}

// Go to page for managers
function managersGoToPage(page) {
  const total = managers.length;
  const totalPages = Math.ceil(total / managersPageSize);
  if (page < 1 || page > totalPages) return;
  managersCurrentPage = page;
  displayManagers();
}

// Get assigned users count for a manager
function getAssignedUsersCount(managerId) {
  return users.filter(user => user.assignedTo === managerId).length;
}

// Get assigned admins count for a manager
function getAssignedAdminsCount(managerId) {
  return managers.filter(manager => manager.assignedTo === managerId).length;
}

// Update managers count display
function updateManagersCount() {
  const managersCount = document.getElementById('managersCount');
  const adminsCount = document.getElementById('adminsCount');
  if (managersCount) {
    managersCount.textContent = `Total: ${managers.filter(m => m.role === 'Manager').length} managers`;
  }
  if (adminsCount) {
    adminsCount.textContent = `Total: ${managers.filter(m => m.role === 'Admin').length} admins`;
  }
}

// Open manager modal for adding new manager
function openManagerModal() {
  createManagerModal();
  openModal('managerModal');
}

// Open manager modal for editing
function editManager(index) {
  createManagerModal(managers[index], index);
  openModal('managerModal');
}

let emailVerified = false;
let currentOtp = null;

// Create manager modal
function createManagerModal(manager = null, index = null) {
  emailVerified = !!(manager && manager.id); // If editing, assume already verified
  currentOtp = null;
  const isEdit = manager !== null;
  const modalId = 'managerModal';
  
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          ${isEdit ? 'Edit Manager/Admin' : 'Add Manager/Admin'}
        </h3>
        <button type="button" class="modal-close" onclick="closeModal('${modalId}')">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="modal-body">
        <form id="managerForm" class="space-y-4">
          <div>
            <label for="managerName" class="form-label">Full Name *</label>
            <input type="text" id="managerName" name="name" value="${manager ? manager.name : ''}" class="form-input" required placeholder="Enter full name">
          </div>
          <div>
            <label for="managerEmail" class="form-label">Email Address *</label>
            <div style="display:flex;gap:0.5rem;">
              <input type="email" id="managerEmail" name="email" value="${manager ? manager.email : ''}" class="form-input" required placeholder="Enter email address" ${isEdit ? 'readonly' : ''}>
              ${!isEdit ? `<button type="button" id="sendOtpBtn" class="btn btn-secondary" onclick="sendManagerOtp()" style="min-width:90px;">Send OTP</button>` : ''}
            </div>
            <div id="otpSection" style="margin-top:0.5rem;display:none;">
              <input type="text" id="managerOtpInput" class="form-input" placeholder="Enter OTP" style="width:120px;">
              <button type="button" class="btn btn-primary" onclick="verifyManagerOtp()">Verify OTP</button>
              <span id="otpStatus" style="margin-left:1rem;color:#16a34a;display:none;">Verified</span>
            </div>
          </div>
          <div>
            <label for="managerPhone" class="form-label">Phone Number *</label>
            <input type="tel" id="managerPhone" name="phone" value="${manager ? manager.phone : ''}" class="form-input" required placeholder="Enter phone number">
          </div>
          <div>
            <label for="managerRole" class="form-label">Role *</label>
            <select id="managerRole" name="role" class="form-select" required onchange="toggleAssignedToField()">
              <option value="">Select Role</option>
              <option value="Manager" ${manager && manager.role === 'Manager' ? 'selected' : ''}>Manager</option>
              <option value="Admin" ${manager && manager.role === 'Admin' ? 'selected' : ''}>Admin</option>
            </select>
          </div>
          <div id="assignedToField" style="display: none;">
            <label for="managerAssignedTo" class="form-label">Assigned To *</label>
            <select id="managerAssignedTo" name="assignedTo" class="form-select">
              <option value="">Select Manager</option>
              ${managers.filter(m => m.role === 'Manager').map(m => `
                <option value="${m.id}" ${manager && manager.assignedTo && manager.assignedTo === m.id ? 'selected' : ''}>
                  ${m.name} (${m.email})
                </option>
              `).join('')}
            </select>
          </div>
          <div>
            <label for="managerPassword" class="form-label">Password *</label>
            <input type="password" id="managerPassword" name="password" class="form-input" required placeholder="Enter password" autocomplete="new-password" value="">
          </div>
          <div>
            <label for="managerConfirmPassword" class="form-label">Confirm Password *</label>
            <input type="password" id="managerConfirmPassword" name="confirmPassword" class="form-input" required placeholder="Confirm password" autocomplete="new-password" value="">
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button type="button" onclick="closeModal('${modalId}')" class="btn btn-secondary">Cancel</button>
        <button type="button" id="addManagerBtn" onclick="saveManager(${index})" class="btn btn-primary" ${(!isEdit && !emailVerified) ? 'disabled' : ''}>${isEdit ? 'Update' : 'Add'}</button>
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
  
  // Show/hide assigned to field based on initial role
  setTimeout(() => {
    toggleAssignedToField();
    const nameInput = document.getElementById('managerName');
    if (nameInput) {
      nameInput.focus();
      nameInput.select();
    }
    updateAddManagerBtnState();
  }, 100);
}

// Send OTP to manager email (real backend API)
async function sendManagerOtp() {
  const emailInput = document.getElementById('managerEmail');
  if (!emailInput || !validateEmail(emailInput.value)) {
    showErrorNotification('Please enter a valid email address');
    emailInput.focus();
    return;
  }
  try {
    // Call backend API to send OTP
    const res = await fetch('http://localhost:8080/api/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value })
    });
    if (!res.ok) throw new Error('Failed to send OTP');
    showSuccess(`OTP sent to ${emailInput.value}. Please check your email.`);
    document.getElementById('otpSection').style.display = 'block';
    document.getElementById('otpStatus').style.display = 'none';
    emailVerified = false;
    updateAddManagerBtnState();
  } catch (err) {
    showErrorNotification('Failed to send OTP. Please try again.');
  }
}

// Verify OTP (real backend API)
async function verifyManagerOtp() {
  const otpInput = document.getElementById('managerOtpInput');
  const emailInput = document.getElementById('managerEmail');
  if (!otpInput || !emailInput) return;
  try {
    // Call backend API to verify OTP
    const res = await fetch('http://localhost:8080/api/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: emailInput.value, otp: otpInput.value })
    });
    const result = await res.json();
    if (res.ok && result.verified) {
      emailVerified = true;
      document.getElementById('otpStatus').textContent = 'Verified';
      document.getElementById('otpStatus').style.display = 'inline';
      showSuccess('Email verified successfully!');
      updateAddManagerBtnState();
    } else {
      showErrorNotification('Invalid OTP. Please try again.');
      otpInput.focus();
    }
  } catch (err) {
    showErrorNotification('Failed to verify OTP. Please try again.');
    otpInput.focus();
  }
}

// Enable/disable Add button based on email verification
function updateAddManagerBtnState() {
  const addBtn = document.getElementById('addManagerBtn');
  if (addBtn) {
    addBtn.disabled = !emailVerified;
  }
}

// Save manager (add or update)
async function saveManager(index = null) {
  const form = document.getElementById('managerForm');
  if (!form) return;

  const formData = new FormData(form);
  const managerData = {
    name: formData.get('name').trim(),
    email: formData.get('email').trim(),
    phone: formData.get('phone').trim(),
    role: formData.get('role'),
    assignedTo: formData.get('assignedTo') ? parseInt(formData.get('assignedTo')) : null,
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword')
  };
  
  // Validate data
  if (!managerData.name) {
    showErrorNotification('Name is required');
    document.getElementById('managerName').focus();
    return;
  }
  
  if (!managerData.email) {
    showErrorNotification('Email is required');
    document.getElementById('managerEmail').focus();
    return;
  }
  
  if (!validateEmail(managerData.email)) {
    showErrorNotification('Please enter a valid email address');
    document.getElementById('managerEmail').focus();
    return;
  }
  
  if (!managerData.phone) {
    showErrorNotification('Phone number is required');
    document.getElementById('managerPhone').focus();
    return;
  }
  
  if (!validatePhone(managerData.phone)) {
    showErrorNotification('Please enter a valid phone number');
    document.getElementById('managerPhone').focus();
    return;
  }
  
  if (!managerData.role) {
    showErrorNotification('Role is required');
    document.getElementById('managerRole').focus();
    return;
  }
  
  if (!managerData.password) {
    showErrorNotification('Password is required');
    document.getElementById('managerPassword').focus();
    return;
  }
  if (!managerData.confirmPassword) {
    showErrorNotification('Confirm password is required');
    document.getElementById('managerConfirmPassword').focus();
    return;
  }
  if (managerData.password !== managerData.confirmPassword) {
    showErrorNotification('Passwords do not match');
    document.getElementById('managerConfirmPassword').focus();
    return;
  }
  
  // Validate assigned to field for Admin role
  if (managerData.role === 'Admin' && !managerData.assignedTo && managerData.assignedTo !== 0) {
    showErrorNotification('Please select a manager to assign this admin to');
    document.getElementById('managerAssignedTo').focus();
    return;
  }
  
  // Check for duplicate email (excluding current manager if editing)
  const existingManager = managers.find((manager, i) => 
    manager.email === managerData.email && i !== index
  );
  
  if (existingManager) {
    showErrorNotification('A manager with this email already exists');
    document.getElementById('managerEmail').focus();
    return;
  }
  
  try {
    if (index !== null) {
      // Update existing manager in backend
      const managerId = managers[index].id;
      await fetch(`http://localhost:8080/api/managers/${managerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(managerData)
      });
      showSuccess('Manager updated successfully!');
      notifySuperAdmin(`Manager "${managerData.name}" updated`, 'info');
    } else {
      // Add new manager in backend
      await fetch('http://localhost:8080/api/managers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(managerData)
      });
      showSuccess('Manager added successfully!');
      notifySuperAdmin(`Manager "${managerData.name}" added`, 'success');
    }
    // Refresh display from backend
    await fetchManagersFromBackend();
    displayManagers();
    closeModal('managerModal');
  } catch (error) {
    console.error('Error saving manager:', error);
    showErrorNotification('Failed to save manager. Please try again.');
  }
}

// Edit manager/admin by id
function editManagerById(id) {
  const idx = managers.findIndex(m => m.id === id);
  if (idx === -1) return;
  createManagerModal(managers[idx], idx);
  openModal('managerModal');
}

// Delete manager/admin by id
async function deleteManagerById(id) {
  const idx = managers.findIndex(m => m.id === id);
  if (idx === -1) return;
  const manager = managers[idx];

  // Check if manager has assigned users and admins
  const assignedUsersCount = getAssignedUsersCount(manager.id);
  const assignedAdminsCount = getAssignedAdminsCount(manager.id);

  let confirmMessage = `Are you sure you want to delete "${manager.name}"?`;
  if (assignedUsersCount > 0 || assignedAdminsCount > 0) {
    const assignments = [];
    if (assignedUsersCount > 0) assignments.push(`${assignedUsersCount} user(s)`);
    if (assignedAdminsCount > 0) assignments.push(`${assignedAdminsCount} admin(s)`);
    confirmMessage += `\n\nThis manager has ${assignments.join(' and ')} assigned. They will become unassigned.`;
  }

  if (confirm(confirmMessage)) {
    try {
      await fetch(`http://localhost:8080/api/managers/${manager.id}`, { method: 'DELETE' });
      await fetchManagersFromBackend();
      displayManagers();
      showSuccess('Manager deleted successfully!');
      notifySuperAdmin(`Manager "${manager.name}" deleted`, 'warning');
    } catch (error) {
      console.error('Error deleting manager:', error);
      showErrorNotification('Failed to delete manager. Please try again.');
    }
  }
}

// Initialize managers section
function initializeManagers() {
  // Add form submit handlers
  document.addEventListener('submit', function(e) {
    if (e.target.id === 'managerForm') {
      e.preventDefault();
      const index = e.target.dataset.index ? parseInt(e.target.dataset.index) : null;
      saveManager(index);
    }
  });
}

// Show/hide assigned to field based on role selection
function toggleAssignedToField() {
  const roleSelect = document.getElementById('managerRole');
  const assignedToField = document.getElementById('assignedToField');
  if (!roleSelect || !assignedToField) return;
  if (roleSelect.value === 'Admin') {
    assignedToField.style.display = '';
  } else {
    assignedToField.style.display = 'none';
  }
}

// Manager search/filter input and handler
function renderManagerSearchBar() {
  return `
    <div class="mb-4" style="max-width:350px;">
      <input
        type="text"
        id="managerSearchInput"
        class="form-input"
        placeholder="Search managers by name, email, phone, or role..."
        value="${managerSearchTerm || ""}"
        oninput="onManagerSearchInput()"
        style="width:100%;"
      />
    </div>
  `;
}

function onManagerSearchInput() {
  const input = document.getElementById('managerSearchInput');
  managerSearchTerm = input ? input.value : "";
  managersCurrentPage = 1;
  displayManagers();
}
