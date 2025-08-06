// Common utility functions and shared functionality

// Utility function to format date
function formatDate(date) {
  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  return new Date(date).toLocaleString('en-US', options);
}

// Utility function to show/hide elements
function showElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'block';
    element.classList.remove('hidden');
  }
}

function hideElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    element.style.display = 'none';
    element.classList.add('hidden');
  }
}

// Utility function to toggle element visibility
function toggleElement(elementId) {
  const element = document.getElementById(elementId);
  if (element) {
    if (element.style.display === 'none' || element.classList.contains('hidden')) {
      showElement(elementId);
    } else {
      hideElement(elementId);
    }
  }
}

// Utility function to create modal overlay
function createModalOverlay(modalId) {
  const overlay = document.createElement('div');
  overlay.id = modalId;
  overlay.className = 'modal-overlay hidden';
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) {
      closeModal(modalId);
    }
  });
  return overlay;
}

// Utility function to open modal
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
      modal.classList.add('fade-in');
    }, 10);
  }
}

// Utility function to close modal
function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    modal.classList.remove('fade-in');
    document.body.style.overflow = 'auto';
    
    // Remove modal after animation
    setTimeout(() => {
      if (modal && modal.parentNode) {
        modal.remove();
      }
    }, 300);
  }
}

// Utility function to show loading spinner
function showLoading(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="flex justify-center items-center py-8">
        <div class="spinner"></div>
        <span class="ml-2 text-gray-600">Loading...</span>
      </div>
    `;
  }
}

// Utility function to show error message
function showError(containerId, message) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="text-center py-8">
        <div class="text-red-500 mb-2">
          <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p class="text-gray-600">${message}</p>
      </div>
    `;
  }
}

// Utility function to show success message
function showSuccess(message, duration = 3000) {
  const successDiv = document.createElement('div');
  successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in';
  successDiv.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      ${message}
    </div>
  `;
  
  document.body.appendChild(successDiv);
  
  setTimeout(() => {
    successDiv.remove();
  }, duration);
}

// Utility function to show error notification
function showErrorNotification(message, duration = 3000) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 fade-in';
  errorDiv.innerHTML = `
    <div class="flex items-center">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      ${message}
    </div>
  `;
  
  document.body.appendChild(errorDiv);
  
  setTimeout(() => {
    errorDiv.remove();
  }, duration);
}

// Utility function to debounce function calls
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Utility function to validate email
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Utility function to validate phone number
function validatePhone(phone) {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

// Utility function to sanitize HTML
function sanitizeHTML(str) {
  const temp = document.createElement('div');
  temp.textContent = str;
  return temp.innerHTML;
}

// Utility function to generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Utility function to copy text to clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showSuccess('Copied to clipboard!');
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    showSuccess('Copied to clipboard!');
  }
}

// Utility function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Utility function to capitalize first letter
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Utility function to truncate text
function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + '...';
}

// Utility function to search in array of objects
function searchInArray(array, searchTerm, searchFields) {
  if (!searchTerm) return array;
  
  const term = searchTerm.toLowerCase();
  return array.filter(item => {
    return searchFields.some(field => {
      const value = getNestedValue(item, field);
      return value && value.toString().toLowerCase().includes(term);
    });
  });
}

// Utility function to get nested object value
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

// Utility function to sort array of objects
function sortArray(array, field, direction = 'asc') {
  return array.sort((a, b) => {
    const aVal = getNestedValue(a, field);
    const bVal = getNestedValue(b, field);
    
    if (direction === 'asc') {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
}

// Utility function to export data to CSV
function exportToCSV(data, filename) {
  if (!data || !data.length) {
    showErrorNotification('No data to export');
    return;
  }
  
  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  showSuccess('Data exported successfully!');
}

// Initialize common functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Add click outside modal functionality
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-overlay')) {
      e.target.classList.add('hidden');
      document.body.style.overflow = 'auto';
    }
  });
  
  // Add escape key functionality for modals
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal-overlay:not(.hidden)');
      openModals.forEach(modal => {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
      });
    }
  });
});