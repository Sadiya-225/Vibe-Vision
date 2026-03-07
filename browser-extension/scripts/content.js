// Content script for VibeVision extension
// Runs on all web pages to enhance image interaction

// Add visual indicator when hovering over images
let currentHighlightedImage = null;

// Add hover effect to images
document.addEventListener('mouseover', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.classList.add('vibe-vision-highlight');
    currentHighlightedImage = e.target;
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.classList.remove('vibe-vision-highlight');
    if (currentHighlightedImage === e.target) {
      currentHighlightedImage = null;
    }
  }
});

// Add click handler for quick analysis
document.addEventListener('keydown', (e) => {
  // Press Alt+V to analyze the image under the cursor
  if (e.altKey && e.key.toLowerCase() === 'v' && currentHighlightedImage) {
    e.preventDefault();
    analyzeCurrentImage();
  }
});

function analyzeCurrentImage() {
  if (!currentHighlightedImage) return;

  const img = currentHighlightedImage;

  // Instead of using canvas (which causes CORS issues), send the image URL
  // Let the background script handle fetching it
  try {
    chrome.runtime.sendMessage({
      action: 'analyzeImageUrl',
      imageUrl: img.src
    });
    // Show notification
    showNotification('Opening VibeVision Analysis...');
  } catch (error) {
    // Extension context invalidated (extension was reloaded)
    if (error.message.includes('Extension context invalidated')) {
      showNotification('Please refresh the page after extension update');
    } else {
      console.error('Error sending message:', error);
    }
  }
}

function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'vibe-vision-notification';
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 2000);
}

// Listen for messages from popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'ping') {
    sendResponse({ status: 'ready' });
  }
  return true;
});
