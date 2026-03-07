# VibeVision Browser Extension

A Chrome/Edge browser extension that brings AI-powered image analysis to any webpage. Right-click any image to understand its context, humor, and cultural significance.

## Features

- **Right-Click Analysis**: Analyze any image on any webpage with a simple right-click
- **Quick Keyboard Shortcut**: Hover over an image and press `Alt+V` for instant analysis
- **Drag & Drop**: Upload images directly in the extension popup
- **URL Support**: Paste image URLs for analysis
- **Three-Tier Analysis**:
  - Literal Description: What's visually in the image
  - Vibe Explanation: Emotional context and cultural meaning
  - Gen-Z Summary: Internet culture translation
- **Text-to-Speech**: Listen to analysis results with built-in TTS
- **Offline Storage**: API key stored securely in browser storage

## Installation

### Chrome/Edge (Developer Mode)

1. **Download the Extension**
   - Clone or download this repository
   - Navigate to the `browser-extension` folder

2. **Open Extension Management**
   - **Chrome**: Navigate to `chrome://extensions/`
   - **Edge**: Navigate to `edge://extensions/`

3. **Enable Developer Mode**
   - Toggle the "Developer mode" switch in the top-right corner

4. **Load the Extension**
   - Click "Load unpacked"
   - Select the `browser-extension` folder
   - The VibeVision extension should now appear in your extensions list

5. **Pin the Extension** (Optional)
   - Click the puzzle piece icon in your browser toolbar
   - Find VibeVision and click the pin icon

## Setup

### 1. Get a Gemini API Key

The extension requires a Google Gemini API key to analyze images.

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### 2. Configure the Extension

1. Click the VibeVision icon in your browser toolbar
2. Click the ⚙️ Settings button at the bottom
3. Paste your Gemini API key when prompted
4. Click OK to save

Your API key is stored locally in your browser and never sent anywhere except to Google's Gemini API.

## Usage

### Method 1: Right-Click on Images

1. Browse any webpage with images
2. Right-click on any image
3. Select "Analyze with VibeVision"
4. The extension popup opens with analysis results

### Method 2: Keyboard Shortcut

1. Hover your mouse over any image on a webpage
2. Press `Alt+V`
3. The image is automatically captured and analyzed

### Method 3: Manual Upload

1. Click the VibeVision icon to open the popup
2. Choose one of these options:
   - **Click to upload**: Select an image from your computer
   - **Drag & drop**: Drag an image into the upload area
   - **Paste URL**: Enter an image URL and click "Analyze URL"
3. Click "Analyze Image" to get results

### Features in the Popup

- **Text-to-Speech**: Click "Read Aloud" button on any analysis section
- **New Analysis**: Click "New Analysis" to start over
- **Settings**: Update your API key anytime

## File Structure

```
browser-extension/
├── manifest.json           # Extension configuration
├── popup.html             # Extension popup UI
├── icons/                 # Extension icons
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── scripts/
│   ├── popup.js          # Popup logic and API integration
│   ├── background.js     # Background service worker
│   └── content.js        # Content script for web pages
└── styles/
    ├── popup.css         # Popup styling
    └── content.css       # Content script styles
```

## Permissions

The extension requests the following permissions:

- **activeTab**: To access images on the current webpage
- **contextMenus**: To add right-click menu option
- **storage**: To save your API key securely
- **host_permissions**: To access images from any website

## Privacy & Security

- Your Gemini API key is stored locally in your browser's secure storage
- Images are sent directly to Google's Gemini API for analysis
- No data is collected or stored by the extension
- The extension works entirely client-side

## Keyboard Shortcuts

- `Alt+V` - Analyze image under cursor (when hovering)

## Troubleshooting

### "Please set your Gemini API key"
- Click Settings (⚙️) and enter your API key
- Make sure you copied the entire key without extra spaces

### "Failed to analyze image"
- Check your internet connection
- Verify your API key is correct
- Some images may be blocked by CORS policies

### Context menu not appearing
- Make sure the extension is enabled
- Try refreshing the webpage
- Check if the image is actually an `<img>` tag

### Image highlight not showing
- Refresh the webpage after installing the extension
- Check if the page has conflicting CSS

## Development

To modify the extension:

1. Make changes to the source files
2. Go to `chrome://extensions/` (or `edge://extensions/`)
3. Click the refresh icon on the VibeVision extension card
4. Test your changes

## Browser Support

- ✅ Google Chrome (v88+)
- ✅ Microsoft Edge (v88+)
- ✅ Brave Browser
- ✅ Other Chromium-based browsers

**Note**: This extension uses Manifest V3 and is compatible with modern Chromium browsers.

## License

This extension is part of the VibeVision project. See the main project repository for license information.

## Support

For issues, questions, or feature requests, please visit:
https://github.com/Hack-for-Infinity/TeamChampions

## Credits

Built with:
- Google Gemini AI (Vision API)
- Chrome Extension Manifest V3
- Browser Speech Synthesis API
