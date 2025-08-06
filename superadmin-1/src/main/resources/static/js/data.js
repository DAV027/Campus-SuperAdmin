// Data storage for the application
// Manager data storage
let managers = []; // Will be loaded from backend
// User data storage
let users = []; // Will be loaded from backend
// Fetch users from backend
async function fetchUsersFromBackend() {
  try {
    const res = await fetch('http://localhost:8080/api/users');
    if (!res.ok) throw new Error('Failed to fetch users');
    users = await res.json();
    console.log('Fetched users:', users); // Add logging for debugging
  } catch (e) {
    console.error('Could not load users from backend:', e);
    showErrorNotification('Could not load users from backend');
    users = [];
  }
}
// Fetch managers and admins from backend (combined)
async function fetchManagersFromBackend() {
  try {
    const res = await fetch('http://localhost:8080/api/managers');
    if (!res.ok) throw new Error('Failed to fetch managers');
    managers = await res.json();
    // managers now includes both managers and admins (with role field)
  } catch (e) {
    console.error('Could not load managers from backend:', e);
    showErrorNotification('Could not load managers from backend');
    managers = [];
  }
}
// Optionally, fetch only admins if you need them separately
async function fetchAdminsFromBackend() {
  try {
    const res = await fetch('http://localhost:8080/api/managers/admins');
    if (!res.ok) throw new Error('Failed to fetch admins');
    const admins = await res.json();
    // Use admins as needed
    return admins;
  } catch (e) {
    console.error('Could not load admins from backend:', e);
    showErrorNotification('Could not load admins from backend');
    return [];
  }
}
// Export data for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    managers,
    users
  };
}