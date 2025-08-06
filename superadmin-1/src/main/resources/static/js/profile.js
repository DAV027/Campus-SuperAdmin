// Profile section functionality

// Profile data (mocked for initial load)
var profileData = {
  name: "John Doe",
  email: "john@example.com",
  contact: "+1234567890",
  role: "Super Admin"
};

// Profile management functions
function loadProfileSection() {
  const content = document.getElementById('content');
  if (!content) return;
  
  content.innerHTML = `
    <div class="profile-container">
      <!-- Profile Header with User Icon -->
      <div class="profile-header">
        <div class="profile-avatar">
          <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </div>

      <!-- Profile Form -->
      <div class="profile-form-container">
        <div class="profile-form-header">
          <h4 class="profile-form-title">
            <svg class="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Profile Information
          </h4>
        </div>
        
        <form id="profileForm" class="profile-form">
          <div class="profile-form-fields">
            <!-- Name Field -->
            <div class="profile-field">
              <label for="profileName" class="profile-field-label">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input type="text" id="profileName" name="name" value="${profileData.name}" readonly 
                     class="form-input">
            </div>

            <!-- Email Field -->
            <div class="profile-field">
              <label for="profileEmail" class="profile-field-label">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <input type="email" id="profileEmail" name="email" value="${profileData.email}" readonly 
                     class="form-input">
            </div>

            <!-- Contact Number Field -->
            <div class="profile-field">
              <label for="profileContact" class="profile-field-label">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Number
              </label>
              <input type="tel" id="profileContact" name="contact" value="${profileData.contact}" readonly 
                     class="form-input">
            </div>

            <!-- Role Field -->
            <div class="profile-field">
              <label for="profileRole" class="profile-field-label">
                <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Role
              </label>
              <input type="text" id="profileRole" name="role" value="${profileData.role}" readonly 
                     class="form-input">
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="profile-form-actions">
            <button type="button" id="editProfileBtn" onclick="toggleEditProfile()" 
                    class="profile-edit-btn">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit Profile</span>
            </button>
            <button type="button" id="saveProfileBtn" onclick="saveProfile()" 
                    class="profile-save-btn" style="display: none;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Save Changes</span>
            </button>
            <button type="button" id="cancelProfileBtn" onclick="cancelEditProfile()" 
                    class="profile-cancel-btn" style="display: none;">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Cancel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

// Toggle profile editing mode
function toggleEditProfile() {
  const form = document.getElementById('profileForm');
  const editBtn = document.getElementById('editProfileBtn');
  const saveBtn = document.getElementById('saveProfileBtn');
  const cancelBtn = document.getElementById('cancelProfileBtn');
  
  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const contactInput = document.getElementById('profileContact');
  
  if (!form || !editBtn || !saveBtn || !cancelBtn) return;
  
  // Store original values for cancel functionality
  if (!form.dataset.originalValues) {
    form.dataset.originalValues = JSON.stringify({
      name: nameInput.value,
      email: emailInput.value,
      contact: contactInput.value
    });
  }
  
  // Toggle editing mode
  const isEditing = form.classList.contains('editing');
  
  if (isEditing) {
    // Exit editing mode
    form.classList.remove('editing');
    nameInput.readOnly = true;
    emailInput.readOnly = true;
    contactInput.readOnly = true;
    
    editBtn.style.display = 'flex';
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
  } else {
    // Enter editing mode
    form.classList.add('editing');
    nameInput.readOnly = false;
    emailInput.readOnly = false;
    contactInput.readOnly = false;
    
    editBtn.style.display = 'none';
    saveBtn.style.display = 'flex';
    cancelBtn.style.display = 'flex';
    
    // Focus on first editable field
    nameInput.focus();
  }
}

// Save profile changes
function saveProfile() {
  const form = document.getElementById('profileForm');
  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const contactInput = document.getElementById('profileContact');
  
  if (!form || !nameInput || !emailInput || !contactInput) return;
  
  // Validate inputs
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const contact = contactInput.value.trim();
  
  if (!name) {
    showErrorNotification('Name is required');
    nameInput.focus();
    return;
  }
  
  if (!email) {
    showErrorNotification('Email is required');
    emailInput.focus();
    return;
  }
  
  if (!validateEmail(email)) {
    showErrorNotification('Please enter a valid email address');
    emailInput.focus();
    return;
  }
  
  if (!contact) {
    showErrorNotification('Contact number is required');
    contactInput.focus();
    return;
  }
  
  if (!validatePhone(contact)) {
    showErrorNotification('Please enter a valid phone number');
    contactInput.focus();
    return;
  }
  
  try {
    // Update profile data
    profileData.name = name;
    profileData.email = email;
    profileData.contact = contact;
    
    // Update header display
    const headerUserName = document.querySelector('.header-user-name');
    if (headerUserName) {
      headerUserName.textContent = `Hi, ${name}`;
    }
    
    // Exit editing mode
    toggleEditProfile();
    
    // Clear stored original values
    delete form.dataset.originalValues;
    
    showSuccess('Profile updated successfully!');
    notifySuperAdmin('Super Admin profile updated', 'info');
    
  } catch (error) {
    console.error('Error saving profile:', error);
    showErrorNotification('Failed to save profile. Please try again.');
  }
}

// Cancel profile editing
function cancelEditProfile() {
  const form = document.getElementById('profileForm');
  const nameInput = document.getElementById('profileName');
  const emailInput = document.getElementById('profileEmail');
  const contactInput = document.getElementById('profileContact');
  
  if (!form || !nameInput || !emailInput || !contactInput) return;
  
  // Restore original values
  if (form.dataset.originalValues) {
    const originalValues = JSON.parse(form.dataset.originalValues);
    nameInput.value = originalValues.name;
    emailInput.value = originalValues.email;
    contactInput.value = originalValues.contact;
    
    delete form.dataset.originalValues;
  }
  
  // Exit editing mode
  toggleEditProfile();
}

// Handle form submission
function handleProfileFormSubmit(event) {
  event.preventDefault();
  saveProfile();
}

// Initialize profile section
function initializeProfile() {
  // Add form submit handler
  const form = document.getElementById('profileForm');
  if (form) {
    form.addEventListener('submit', handleProfileFormSubmit);
  }
  
  // Add keyboard shortcuts
  document.addEventListener('keydown', function(e) {
    // Ctrl+S or Cmd+S to save (when editing)
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      const form = document.getElementById('profileForm');
      if (form && form.classList.contains('editing')) {
        e.preventDefault();
        saveProfile();
      }
    }
    
    // Escape to cancel editing
    if (e.key === 'Escape') {
      const form = document.getElementById('profileForm');
      if (form && form.classList.contains('editing')) {
        cancelEditProfile();
      }
    }
  });
}