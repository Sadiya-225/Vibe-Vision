// Hard-coded API Keys
const GEMINI_API_KEY = 'AIzaSyAogWgY9EP5izXADSuYAyLU2PfYFW811TY';
const VAPI_PUBLIC_KEY = '593edad9-181d-47dc-8ae4-835c4949c2f9';

// Initialize Vapi client
let vapiClient = null;
let currentAnalysis = null;
let isSpeaking = false;

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(tab + 'Tab').classList.add('active');
  });
});

// ANALYZE TAB
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const urlInput = document.getElementById('urlInput');
const analyzeUrlBtn = document.getElementById('analyzeUrlBtn');
const previewImage = document.getElementById('previewImage');
const removeImageBtn = document.getElementById('removeImageBtn');
const analyzeBtn = document.getElementById('analyzeBtn');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');
const retryBtn = document.getElementById('retryBtn');
const discussImageBtn = document.getElementById('discussImageBtn');

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

// Prevent default drag behaviors and handle drag enter/leave for whole document
let dragCounter = 0;

document.addEventListener('dragenter', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dragCounter++;
});

document.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dragCounter--;
});

document.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});

document.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  dragCounter = 0;
});

// Upload Area
uploadArea.addEventListener('click', (e) => {
  e.stopPropagation();
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) handleImageFile(file);
});

// Fixed drag and drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
  uploadArea.classList.add('drag-over');
});

uploadArea.addEventListener('dragleave', (e) => {
  e.preventDefault();
  e.stopPropagation();
  uploadArea.classList.remove('drag-over');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  e.stopPropagation();
  uploadArea.classList.remove('drag-over');
  
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleImageFile(file);
  }
});

analyzeUrlBtn.addEventListener('click', () => {
  const url = urlInput.value.trim();
  if (url) handleImageUrl(url);
});

function handleImageFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    selectedImageData = e.target.result;
    previewImage.src = selectedImageData;
    showSection(previewSection);
  };
  reader.onerror = () => {
    showError('Failed to read image file');
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
    showError('Failed to load image from URL');
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
    const analysis = await analyzeImage(selectedImageData);
    displayResults(analysis);
  } catch (error) {
    showError(error.message || 'Failed to analyze image');
  }
});

async function analyzeImage(imageData) {
  const base64Data = imageData.split(',')[1];
  const prompt = "You are VibeVision. Analyze this image and provide:\n\n1. LITERAL DESCRIPTION\nDescribe exactly what you see.\n\n2. VIBE EXPLANATION\nExplain the emotional tone, cultural context, humor.\n\n3. GEN-Z VIBE SUMMARY\nTranslate into modern Gen-Z slang.";

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
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

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid API response format');
    }

    return parseAnalysis(data.candidates[0].content.parts[0].text);
  } catch (error) {
    console.error('Analysis error:', error);
    throw error;
  }
}

function sanitizeText(text) {
  // Remove unusual control characters and normalize whitespace
  return text
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '') // Remove control characters
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // Remove zero-width spaces
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function parseAnalysis(text) {
  const sections = { literalDescription: '', vibeExplanation: '', genZSummary: '' };
  const literalMatch = text.match(/1\.\s*LITERAL DESCRIPTION[:\s]*([\s\S]*?)(?=2\.|$)/i);
  const vibeMatch = text.match(/2\.\s*VIBE EXPLANATION[:\s]*([\s\S]*?)(?=3\.|$)/i);
  const genZMatch = text.match(/3\.\s*GEN-?Z\s+VIBE\s+SUMMARY[:\s]*([\s\S]*?)$/i);
  if (literalMatch) sections.literalDescription = sanitizeText(literalMatch[1]);
  if (vibeMatch) sections.vibeExplanation = sanitizeText(vibeMatch[1]);
  if (genZMatch) sections.genZSummary = sanitizeText(genZMatch[1]);
  return sections;
}

function displayResults(analysis) {
  currentAnalysis = analysis;
  literalDescription.textContent = analysis.literalDescription;
  vibeExplanation.textContent = analysis.vibeExplanation;
  genZSummary.textContent = analysis.genZSummary;
  showSection(resultsSection);
}

// Text-to-Speech
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
  currentAnalysis = null;
  showSection(uploadSection);
});

discussImageBtn.addEventListener('click', () => {
  document.querySelector('[data-tab="discuss"]').click();
});

retryBtn.addEventListener('click', () => showSection(uploadSection));

// DISCUSS TAB - Voice Assistant
const startCallBtn = document.getElementById('startCallBtn');
const endCallBtn = document.getElementById('endCallBtn');
const muteBtn = document.getElementById('muteBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');
const transcript = document.getElementById('transcript');
const soundwaveContainer = document.getElementById('soundwaveContainer');
const callControls = document.getElementById('callControls');

startCallBtn.addEventListener('click', startVoiceCall);
endCallBtn.addEventListener('click', endVoiceCall);
muteBtn.addEventListener('click', toggleMute);

async function startVoiceCall() {
  if (!vapiClient) {
    vapiClient = new window.Vapi(VAPI_PUBLIC_KEY);
    
    vapiClient.on('call-start', () => {
      statusIndicator.classList.add('connected');
      statusText.textContent = 'Connected';
      startCallBtn.classList.add('hidden');
      callControls.classList.remove('hidden');
      soundwaveContainer.classList.remove('hidden');
    });

    vapiClient.on('call-end', () => {
      statusIndicator.classList.remove('connected', 'speaking');
      statusText.textContent = 'Not Connected';
      startCallBtn.classList.remove('hidden');
      callControls.classList.add('hidden');
      soundwaveContainer.classList.add('hidden');
      isSpeaking = false;
    });

    vapiClient.on('speech-start', () => {
      isSpeaking = true;
      statusIndicator.classList.add('speaking');
      statusText.textContent = 'Speaking...';
    });

    vapiClient.on('speech-end', () => {
      isSpeaking = false;
      statusIndicator.classList.remove('speaking');
      statusText.textContent = 'Connected';
    });

    vapiClient.on('message', (message) => {
      if (message.type === 'transcript' && message.role === 'user') {
        addTranscriptMessage('user', message.transcript);
      } else if (message.type === 'transcript' && message.role === 'assistant') {
        addTranscriptMessage('assistant', message.transcript);
      }
    });
  }

  let systemPrompt = "You are VibeVision's voice assistant helping users understand images and memes.";
  
  if (currentAnalysis) {
    systemPrompt += `\n\nIMAGE ANALYSIS CONTEXT:\nLITERAL: ${currentAnalysis.literalDescription}\nVIBE: ${currentAnalysis.vibeExplanation}\nGEN-Z: ${currentAnalysis.genZSummary}`;
  }

  const config = {
    name: "VibeVision Assistant",
    firstMessage: currentAnalysis 
      ? "Hey! I've analyzed this image. What would you like to know about it?"
      : "Hi! I'm your VibeVision assistant. How can I help you understand images today?",
    transcriber: { provider: "deepgram", model: "nova-2", language: "en" },
    voice: { provider: "11labs", voiceId: "sarah" },
    model: { provider: "openai", model: "gpt-4", messages: [{ role: "system", content: systemPrompt }] }
  };

  await vapiClient.start(config);
}

function endVoiceCall() {
  if (vapiClient) {
    vapiClient.stop();
  }
}

function toggleMute() {
  if (vapiClient) {
    const isMuted = vapiClient.isMuted();
    vapiClient.setMuted(!isMuted);
    muteBtn.textContent = isMuted ? 'Mute' : 'Unmute';
  }
}

function addTranscriptMessage(role, content) {
  const isEmpty = transcript.querySelector('.transcript-empty');
  if (isEmpty) isEmpty.remove();

  const msgDiv = document.createElement('div');
  msgDiv.className = `transcript-message ${role}`;
  msgDiv.innerHTML = `
    <div class="transcript-role">${role === 'user' ? 'You' : 'Assistant'}</div>
    <div>${content}</div>
  `;
  transcript.appendChild(msgDiv);
  transcript.scrollTop = transcript.scrollHeight;
}

// Helper Functions
function showSection(section) {
  [uploadSection, previewSection, loadingSection, resultsSection, errorSection].forEach(s => s.classList.add('hidden'));
  section.classList.remove('hidden');
}

function showError(message) {
  errorText.textContent = message;
  showSection(errorSection);
}

// Check for image from context menu
chrome.storage.local.get(['pendingImage'], (result) => {
  if (result.pendingImage) {
    selectedImageData = result.pendingImage;
    previewImage.src = selectedImageData;
    showSection(previewSection);
    chrome.storage.local.remove(['pendingImage']);
  }
});
