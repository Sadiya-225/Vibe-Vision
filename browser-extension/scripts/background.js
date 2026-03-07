// Background service worker for VibeVision extension

// Create context menu when extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'analyzeImage',
    title: 'Analyze with VibeVision',
    contexts: ['image']
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'analyzeImage') {
    // Convert image URL to base64 and store it
    fetch(info.srcUrl)
      .then(response => response.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result;
          // Store the image data temporarily
          chrome.storage.local.set({ pendingImage: base64data });
          // Open the popup
          chrome.action.openPopup();
        };
        reader.readAsDataURL(blob);
      })
      .catch(error => {
        console.error('Failed to fetch image:', error);
      });
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'analyzeImage') {
    // Store image and open popup
    chrome.storage.local.set({ pendingImage: request.imageData });
    chrome.action.openPopup();
    sendResponse({ success: true });
  }
  return true;
});

// Initialize extension state
chrome.storage.sync.get(['geminiApiKey'], (result) => {
  if (!result.geminiApiKey) {
    console.log('VibeVision: No API key configured. Please set it in the extension popup.');
  }
});
