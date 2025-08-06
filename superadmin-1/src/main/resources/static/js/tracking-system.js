// Tracking System section functionality
let currentTrackingTab = 'summary';

// Load tracking system section
async function loadTrackingSystemSection() {
  const content = document.getElementById('content');
  if (!content) return;
  
  // Always fetch latest users before rendering
  await fetchUsersFromBackend();
  
  content.innerHTML = `
    <div class="tracking-system-container">
      <div class="tracking-system-header">
      </div>
      
      <div class="tracking-summary-grid">
        <!-- Total Users Card -->
        <div class="tracking-summary-card tracking-summary-card-blue">
          <div class="tracking-summary-card-content">
            <div class="tracking-summary-card-info">
              <h3>Total Users</h3>
              <p id="totalUsers">${users.length}</p>
            </div>
            <div class="tracking-summary-card-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Assigned Users Card -->
        <div class="tracking-summary-card tracking-summary-card-green">
          <div class="tracking-summary-card-content">
            <div class="tracking-summary-card-info">
              <h3>Assigned Users</h3>
              <p id="assignedUsers">${users.filter(u => u.assignedTo !== null).length}</p>
            </div>
            <div class="tracking-summary-card-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Not Assigned Users Card -->
        <div class="tracking-summary-card tracking-summary-card-yellow">
          <div class="tracking-summary-card-content">
            <div class="tracking-summary-card-info">
              <h3>Not Assigned</h3>
              <p id="notAssignedUsers">${users.filter(u => u.assignedTo === null).length}</p>
            </div>
            <div class="tracking-summary-card-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Total Managers Card -->
        <div class="tracking-summary-card tracking-summary-card-red">
          <div class="tracking-summary-card-content">
            <div class="tracking-summary-card-info">
              <h3>Total Managers</h3>
              <p id="totalManagers">${managers.length}</p>
            </div>
            <div class="tracking-summary-card-icon">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Manager Assignment Overview -->
      <div class="mt-8">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Manager Assignment Overview</h3>
          <div class="space-y-4">
            ${managers.map(manager => {
              const assignedToManager = users.filter(user => user.assignedTo === manager.id).length;
              return `
                <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-3">
                    <div class="bg-blue-100 p-2 rounded-full">
                      <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <div class="font-medium text-gray-900">${manager.name}</div>
                      <div class="text-sm text-gray-500">${manager.role}</div>
                    </div>
                  </div>
                  <div class="text-right">
                    <div class="font-semibold text-gray-900">${assignedToManager} users</div>
                    <div class="text-sm text-gray-500">assigned</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Example: After any tracking update, call:
// notifySuperAdmin('Tracking system updated', 'info');

// Initialize tracking system
function initializeTrackingSystem() {
  // No additional initialization needed
}