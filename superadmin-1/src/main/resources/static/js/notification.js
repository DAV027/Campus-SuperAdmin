// Notification logic: fetch, display, and store notifications in backend

// --- Notification UI Logic (moved from main.js) ---
window.lastSeenNotificationTimestamp = 0;

// Update notification badge (header and sidebar)
function updateNotificationBadge() {
  const badge = document.getElementById('notification-badge');
  const badgeSidebar = document.getElementById('notification-badge-sidebar');
  if (!window.notificationQueue) return;
  const unseenCount = getUnseenNotificationCount();
  if (badge) {
    if (unseenCount > 0) {
      badge.textContent = unseenCount > 99 ? '99+' : unseenCount;
      badge.style.display = 'inline-block';
    } else {
      badge.style.display = 'none';
    }
  }
  if (badgeSidebar) {
    if (unseenCount > 0) {
      badgeSidebar.textContent = unseenCount > 99 ? '99+' : unseenCount;
      badgeSidebar.style.display = 'inline-block';
    } else {
      badgeSidebar.style.display = 'none';
    }
  }
}

// Get unseen notification count
function getUnseenNotificationCount() {
  if (!window.notificationQueue) return 0;
  return window.notificationQueue.filter(n => {
    // Use timestamp as string or object
    const ts = typeof n.timestamp === 'string' ? new Date(n.timestamp) : n.timestamp;
    return new Date(ts).getTime() > window.lastSeenNotificationTimestamp && !n.read;
  }).length;
}

// Render notification panel
async function renderNotificationPanel() {
  // Do NOT call fetchNotificationsFromBackend() here to avoid infinite loop
  const list = document.getElementById('notification-panel-list');
  if (!list) return;
  const notifications = window.notificationQueue || [];
  if (notifications.length === 0) {
    list.innerHTML = `<div class="text-gray-400 text-center py-4">No notifications yet.</div>`;
    return;
  }
  list.innerHTML = notifications.slice(0, 20).map(n => `
    <div class="notification-panel-item ${n.type} ${n.read ? 'opacity-60' : ''}">
      <span class="notification-panel-msg">${n.message}</span>
      <span class="notification-panel-time">${formatDate(n.timestamp)}</span>
    </div>
  `).join('');
}

// Toggle notification panel
async function toggleNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  if (!panel) return;
  if (panel.style.display === 'block') {
    closeNotificationPanel();
  } else {
    panel.style.display = 'block';
    await fetchNotificationsFromBackend();
    renderNotificationPanel();
    // Mark all as seen (for badge count)
    if (window.notificationQueue && window.notificationQueue.length > 0) {
      const last = window.notificationQueue[window.notificationQueue.length - 1];
      const ts = typeof last.timestamp === 'string' ? new Date(last.timestamp) : last.timestamp;
      window.lastSeenNotificationTimestamp = new Date(ts).getTime();
    }
    updateNotificationBadge();
    // Close on outside click
    setTimeout(() => {
      document.addEventListener('mousedown', notificationPanelOutsideClick, { once: true });
    }, 0);
  }
}

// Close notification panel
function closeNotificationPanel() {
  const panel = document.getElementById('notification-panel');
  if (panel) panel.style.display = 'none';
}

// Handle outside click to close panel
function notificationPanelOutsideClick(e) {
  const panel = document.getElementById('notification-panel');
  const bell = document.getElementById('notification-bell-btn');
  const sidebarLink = document.getElementById('sidebar-notification-link');
  if (
    panel &&
    !panel.contains(e.target) &&
    (!bell || !bell.contains(e.target)) &&
    (!sidebarLink || !sidebarLink.contains(e.target))
  ) {
    closeNotificationPanel();
  }
}
// --- End Notification UI Logic ---

// Fetch notifications from backend and update UI
async function fetchNotificationsFromBackend() {
  try {
    // Use full URL if backend is on a different port
    const res = await fetch('/api/notifications');
    if (!res.ok) throw new Error('Failed to fetch notifications');
    window.notificationQueue = await res.json();
    updateNotificationBadge();
    // Only update panel if open, do not call fetch again inside render
    const panel = document.getElementById('notification-panel');
    if (panel && panel.style.display === 'block') {
      renderNotificationPanel();
    }
  } catch (e) {
    console.error('Could not load notifications from backend:', e);
    window.notificationQueue = [];
    updateNotificationBadge();
  }
}

// DEBUG: Add a test button to trigger a notification (for troubleshooting)

// Store notification in backend and update UI
async function notifySuperAdmin(message, type = 'info') {
  try {
    const res = await fetch('/api/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, type })
    });
    if (!res.ok) {
      const errText = await res.text();
      console.error('Notification POST failed:', errText);
      throw new Error('Failed to store notification');
    }
    await fetchNotificationsFromBackend();
  } catch (e) {
    showErrorNotification('Notification error: ' + (e.message || e));
    // Fallback to local notification if backend fails
    if (!window.notificationQueue) window.notificationQueue = [];
    window.notificationQueue.push({ message, type, timestamp: new Date(), read: false });
    updateNotificationBadge();
    const panel = document.getElementById('notification-panel');
    if (panel && panel.style.display === 'block') {
      renderNotificationPanel();
    }
  }
}

// Render notification page (like tracking system)
async function loadNotificationPage() {
  const content = document.getElementById('content');
  const contentTitle = document.getElementById('content-title');
  if (!content || !contentTitle) return;

  // Always fetch latest notifications before rendering
  await fetchNotificationsFromBackend();

  contentTitle.textContent = 'Notifications';

  // Mark all as read button
  const hasUnread = window.notificationQueue.some(n => !n.read);
  content.innerHTML = `
    <div class="notification-page-container">
      <div class="notification-page-header flex items-center justify-between mb-4">
        <h3 class="text-xl font-semibold">All Notifications</h3>
        <button class="btn btn-primary" onclick="markAllNotificationsAsRead()" ${hasUnread ? '' : 'disabled'}>
          Mark All as Read
        </button>
      </div>
      <div class="notification-page-list">
        ${window.notificationQueue.length === 0
          ? `<div class="text-gray-400 text-center py-8">No notifications yet.</div>`
          : window.notificationQueue.map(n => `
            <div class="notification-panel-item ${n.type} ${n.read ? 'opacity-60' : ''}" style="border-radius:0.5rem; margin-bottom:0.5rem; background:#f9fafb;">
              <span class="notification-panel-msg">${n.message}</span>
              <span class="notification-panel-time">${formatDate(n.timestamp)}</span>
              <button class="btn btn-sm btn-secondary ml-2" onclick="markNotificationAsRead(${n.id})" ${n.read ? 'disabled' : ''}>
                Mark as Read
              </button>
            </div>
          `).join('')}
      </div>
    </div>
  `;
}

// Mark a single notification as read (backend)
async function markNotificationAsRead(id) {
  try {
    await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
    await fetchNotificationsFromBackend();
    loadNotificationPage();
  } catch (e) {
    showErrorNotification('Failed to mark notification as read');
  }
}

// Mark all notifications as read (backend)
async function markAllNotificationsAsRead() {
  try {
    await fetch(`/api/notifications/markAllRead`, { method: 'POST' });
    await fetchNotificationsFromBackend();
    loadNotificationPage();
  } catch (e) {
    showErrorNotification('Failed to mark all as read');
  }
}

// On page load, fetch notifications and update badge/panel
document.addEventListener('DOMContentLoaded', fetchNotificationsFromBackend);

// Optionally, refresh notifications every 30 seconds in the background
setInterval(fetchNotificationsFromBackend, 30000);
