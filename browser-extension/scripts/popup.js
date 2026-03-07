// DOM Elements
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const analyzeUrlBtn = document.getElementById('analyzeUrlBtn');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImageBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const retryBtn = document.getElementById('retryBtn');

const uploadSection = document.getElementById('uploadSection');
const previewSection = document.getElementById('previewSection');
const loadingSection = document.getElementById('loadingSection');
const resultsSection = document.getElementById('resultsSection');
const errorSection = document.getElementById('errorSection');

const literalDescription = document.getElementById('literalDescription');
const vibeExplanation = document.getElementById('vibeExplanation');
const genZSummary = document.getElementById('genZSummary');
const errorText = document.getElementById('errorText');

let selectedImageData = null;
let currentSpeech = null;

chrome.storage.sync.get(['geminiApiKey'], (result) => {
  if (!result.geminiApiKey) {
    showError('Please set your Gemini API key in settings.');
  }
});

uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleImageFile(file);
});

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) handleImageFile(file);
});

analyzeUrlBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (url) handleImageUrl(url);
});

function handleImageFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImageData = e.target.result;
    previewImage.src = selectedImageData;
    showSection(previewSection);
  };
  reader.readAsDataURL(file);
}

async function handleImageUrl(url) {
  try {
    showSection(loadingSection);
    const response = await fetch(url);
    const blob = await response.blob();
    handleImageFile(blob);
  } catch (error) {
    showError('Failed to load image from URL.');
  }
}

removeImageBtn.addEventListener('click', () => {
  selectedImageData = null;
  previewImage.src = '';
  urlInput.value = '';
  showSection(uploadSection);
});

analyzeBtn.addEventListener('click', async () => {
  if (!selectedImageData) return;
  showSection(loadingSection);

  try {
    const apiKey = await getApiKey();
    if (!apiKey) {
      showError('Please set your Gemini API key in settings.');
      return;
    }
    const analysis = await analyzeImage(selectedImageData, apiKey);
    displayResults(analysis);
  } catch (error) {
    showError(error.message || 'Failed to analyze image.');
  }
});

async function analyzeImage(imageData, apiKey) {
  const base64Data = imageData.split(',')[1];
  const prompt = "You are VibeVision. Analyze this image and provide:\n\n1. LITERAL DESCRIPTION\nDescribe exactly what you see.\n\n2. VIBE EXPLANATION\nExplain the emotional tone, cultural context, humor.\n\n3. GEN-Z VIBE SUMMARY\nTranslate into modern Gen-Z slang.";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Data } }
          ]
        }]
      })
    }
  );

  if (!response.ok) throw new Error('API request failed');
  const data = await response.json();
  return parseAnalysis(data.candidates[0].content.parts[0].text);
}

function parseAnalysis(text) {
  const sections = { literalDescription: '', vibeExplanation: '', genZSummary: '' };
  const literalMatch = text.match(/1\.\s*LITERAL DESCRIPTION[:\s]*([\s\S]*?)(?=2\.|$)/i);
  const vibeMatch = text.match(/2\.\s*VIBE EXPLANATION[:\s]*([\s\S]*?)(?=3\.|$)/i);
  const genZMatch = text.match(/3\.\s*GEN-?Z\s+VIBE\s+SUMMARY[:\s]*([\s\S]*?)$/i);
  if (literalMatch) sections.literalDescription = literalMatch[1].trim();
  if (vibeMatch) sections.vibeExplanation = vibeMatch[1].trim();
  if (genZMatch) sections.genZSummary = genZMatch[1].trim();
  return sections;
}

function displayResults(analysis) {
  literalDescription.textContent = analysis.literalDescription;
  vibeExplanation.textContent = analysis.vibeExplanation;
  genZSummary.textContent = analysis.genZSummary;
  showSection(resultsSection);
}

document.querySelectorAll('.btn-tts').forEach(button => {
  button.addEventListener('click', function() {
    const text = document.getElementById(this.getAttribute('data-text')).textContent;
    if (currentSpeech) speechSynthesis.cancel();
    currentSpeech = new SpeechSynthesisUtterance(text);
    currentSpeech.rate = 0.9;
    speechSynthesis.speak(currentSpeech);
  });
});

newAnalysisBtn.addEventListener('click', () => {
  selectedImageData = null;
  previewImage.src = '';
  urlInput.value = '';
  showSection(uploadSection);
});

retryBtn.addEventListener('click', () => showSection(uploadSection));

document.getElementById('settingsBtn').addEventListener('click', () => {
  const apiKey = prompt('Enter your Gemini API Key:', '');
  if (apiKey) {
    chrome.storage.sync.set({ geminiApiKey: apiKey }, () => alert('API Key saved!'));
  }
});

function showSection(section) {
  [uploadSection, previewSection, loadingSection, resultsSection, errorSection].forEach(s => s.classList.add('hidden'));
  section.classList.remove('hidden');
}

function showError(message) {
  errorText.textContent = message;
  showSection(errorSection);
}

function getApiKey() {
  return new Promise(resolve => {
    chrome.storage.sync.get(['geminiApiKey'], result => resolve(result.geminiApiKey));
  });
}

chrome.storage.local.get(['pendingImage'], (result) => {
  if (result.pendingImage) {
    selectedImageData = result.pendingImage;
    previewImage.src = selectedImageData;
    showSection(previewSection);
    chrome.storage.local.remove(['pendingImage']);
  }
});
