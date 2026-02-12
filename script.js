// Sample texts for typing practice
const sampleTexts = [
  "The quick brown fox jumps over the lazy dog near the riverbank where children play.",
  "Programming is the art of telling another human what one wants the computer to do in a precise manner.",
  "In the digital age, typing skills have become as fundamental as reading and writing were in previous centuries.",
  "Practice makes perfect, but perfect practice makes champions who excel in their chosen fields of expertise.",
  "Technology evolves rapidly, but the human capacity for learning and adaptation remains our greatest strength.",
  "Every expert was once a beginner who refused to give up despite facing numerous challenges along the way.",
  "The journey of a thousand miles begins with a single step taken with courage and determination.",
  "Success is not final, failure is not fatal, it is the courage to continue that truly counts in life.",
];

// State variables
let currentText = "";
let currentIndex = 0;
let correctChars = 0;
let totalChars = 0;
let startTime = null;
let timerInterval = null;
let isTestActive = false;

// DOM elements
const sampleTextEl = document.getElementById("sample-text");
const typingInput = document.getElementById("typing-input");
const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timerEl = document.getElementById("timer");
const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const statusEl = document.getElementById("status");

// Initialize
function init() {
  currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  renderText();
  typingInput.disabled = true;
  resetStats();
}

// Render text with individual character spans
function renderText() {
  sampleTextEl.innerHTML = currentText
    .split("")
    .map((char, index) => {
      if (index === 0) {
        return `<span class="char current">${char}</span>`;
      }
      return `<span class="char">${char}</span>`;
    })
    .join("");
}

// Reset all statistics
function resetStats() {
  currentIndex = 0;
  correctChars = 0;
  totalChars = 0;
  startTime = null;
  isTestActive = false;

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }

  wpmEl.textContent = "0";
  accuracyEl.innerHTML = '100<span style="font-size: 1.5rem;">%</span>';
  timerEl.textContent = "0s";
  statusEl.textContent = "";
}

// Start the typing test
function startTest() {
  resetStats();
  currentText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  renderText();
  typingInput.value = "";
  typingInput.disabled = false;
  typingInput.focus();
  isTestActive = true;
  statusEl.textContent = "Test started! Type the text above...";
  startBtn.disabled = true;
}

// Update timer display
function updateTimer() {
  if (!startTime) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerEl.textContent = `${elapsed}s`;
}

// Calculate WPM
function calculateWPM() {
  if (!startTime) return 0;
  const elapsed = (Date.now() - startTime) / 1000 / 60; // minutes
  const words = correctChars / 5; // standard: 5 chars = 1 word
  return Math.round(words / elapsed) || 0;
}

// Calculate accuracy
function calculateAccuracy() {
  if (totalChars === 0) return 100;
  return Math.round((correctChars / totalChars) * 100);
}

// Update statistics display
function updateStats() {
  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();

  wpmEl.textContent = wpm;
  accuracyEl.innerHTML = `${accuracy}<span style="font-size: 1.5rem;">%</span>`;

  // Add visual feedback for high accuracy
  if (accuracy === 100 && totalChars > 10) {
    accuracyEl.parentElement.classList.add("perfect-combo");
    setTimeout(() => {
      accuracyEl.parentElement.classList.remove("perfect-combo");
    }, 500);
  }
}

// Handle typing input
function handleTyping(e) {
  if (!isTestActive) return;

  // Start timer on first keystroke
  if (!startTime) {
    startTime = Date.now();
    timerInterval = setInterval(updateTimer, 100);
  }

  const inputValue = typingInput.value;
  const chars = sampleTextEl.querySelectorAll(".char");

  // Handle backspace or shorter input
  if (inputValue.length < currentIndex) {
    currentIndex = inputValue.length;

    // Reset characters after current position
    for (let i = currentIndex; i < chars.length; i++) {
      chars[i].classList.remove("correct", "incorrect", "current");
    }

    if (currentIndex < chars.length) {
      chars[currentIndex].classList.add("current");
    }

    updateStats();
    return;
  }

  // Process new character
  const typedChar = inputValue[currentIndex];
  const expectedChar = currentText[currentIndex];

  if (typedChar !== undefined) {
    totalChars++;

    chars[currentIndex].classList.remove("current");

    if (typedChar === expectedChar) {
      chars[currentIndex].classList.add("correct");
      chars[currentIndex].classList.remove("incorrect");
      correctChars++;
    } else {
      chars[currentIndex].classList.add("incorrect");
      chars[currentIndex].classList.remove("correct");
    }

    currentIndex++;

    // Check if test is complete
    if (currentIndex >= currentText.length) {
      completeTest();
    } else {
      chars[currentIndex].classList.add("current");
    }

    updateStats();
  }
}

// Complete the typing test
function completeTest() {
  isTestActive = false;
  clearInterval(timerInterval);
  typingInput.disabled = true;
  startBtn.disabled = false;

  const wpm = calculateWPM();
  const accuracy = calculateAccuracy();

  let message = `Test complete! WPM: ${wpm} | Accuracy: ${accuracy}%`;

  if (accuracy === 100) {
    message += " | PERFECT! 🎯";
  } else if (accuracy >= 95) {
    message += " | Excellent! ⭐";
  } else if (accuracy >= 85) {
    message += " | Good job! 👍";
  }

  statusEl.textContent = message;
}

// Reset the test
function resetTest() {
  resetStats();
  init();
  typingInput.value = "";
  startBtn.disabled = false;
  statusEl.textContent = 'Click "Start Test" to begin';
}

// Event listeners
startBtn.addEventListener("click", startTest);
resetBtn.addEventListener("click", resetTest);
typingInput.addEventListener("input", handleTyping);

// Prevent space from scrolling page
typingInput.addEventListener("keydown", (e) => {
  if (e.code === "Space" && e.target === typingInput) {
    e.preventDefault();
    typingInput.value += " ";
    handleTyping(e);
  }
});

// Initialize on load
init();
statusEl.textContent = 'Click "Start Test" to begin';
