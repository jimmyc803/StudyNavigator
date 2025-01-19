let time = 25 * 60; // Initial time is 25 minutes (in seconds)
let timerInterval = null;

// Get elements
const countdownEL = document.getElementById('time-display');
const startButton = document.getElementById('start-btn');
const pomodoroButton = document.querySelector('.pomodoro-btn');
const shortBreakButton = document.querySelector('.short-break-btn');
const longBreakButton = document.querySelector('.long-break-btn');
const timerEndSound = document.getElementById('timer-end-sound');

// Initial timer durations and first clicked delay
let pomodoroTime = 25;
let shortBreakTime = 5;
let longBreakTime = 15;
let firstStartClicked = false;

// Function to update the countdown
function updateCountdown() {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  seconds = seconds < 10 ? '0' + seconds : seconds;

  countdownEL.textContent = `${minutes}:${seconds}`;

  if (time > 0) {
    time--;
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    startButton.textContent = "Start";

    // Play the sound when the timer ends
    timerEndSound.play();
  }
}

// Function to set the timer duration
function setTimer(durationInMinutes) {
  clearInterval(timerInterval);
  timerInterval = null;
  time = durationInMinutes * 60;
  updateCountdown(); // Immediately update the display
  startButton.textContent = "Start"; // Reset Start button text
}

// Update the mode buttons to use the latest durations
function updateModeButtons() {
  pomodoroButton.addEventListener('click', () => setTimer(pomodoroTime));
  shortBreakButton.addEventListener('click', () => setTimer(shortBreakTime));
  longBreakButton.addEventListener('click', () => setTimer(longBreakTime));
}


// Add event listener to the Start button
startButton.addEventListener('click', () => {
  if (!timerInterval) {
    startButton.textContent = "Pause";
    if (firstStartClicked) {
      // Delay the start of the timer after the first press
      setTimeout(() => {
        timerInterval = setInterval(updateCountdown, 1000); // Start the countdown
        startButton.textContent = "Pause";
      }, 25); // Delay of 300 milliseconds before the timer starts
    } else {
      // For the first click, start the timer immediately
      updateCountdown();
      timerInterval = setInterval(updateCountdown, 1000);
      firstStartClicked = true; // Mark that the first start has been clicked
    }
  } else {
    clearInterval(timerInterval);
    timerInterval = null;
    startButton.textContent = "Start";
  }
});

// Popup Logic for Settings
document.addEventListener("DOMContentLoaded", () => {
  const gearIcon = document.querySelector("label[for='gear-icon']");
  const popup = document.getElementById("settings-popup");
  const closePopup = document.getElementById("close-popup");
  const saveSettings = document.getElementById("save-settings");

  const pomodoroInput = document.getElementById("pomodoro-time");
  const shortBreakInput = document.getElementById("short-break-time");
  const longBreakInput = document.getElementById("long-break-time");

  // Show popup when gear icon is clicked
  gearIcon.addEventListener("click", () => {
    popup.classList.remove("hidden");
  });

  // Hide popup when "Cancel" button is clicked
  closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
  });

  // Save settings and update timer
  saveSettings.addEventListener("click", () => {
    // Get new values from inputs
    pomodoroTime = parseInt(pomodoroInput.value, 10) || 25;
    shortBreakTime = parseInt(shortBreakInput.value, 10) || 5;
    longBreakTime = parseInt(longBreakInput.value, 10) || 15;

    // Update the timer display with the new Pomodoro time
    time = pomodoroTime * 60;
    updateCountdown();

    // Update mode buttons to use the new durations
    updateModeButtons();

    // Hide popup
    popup.classList.add("hidden");
  });

  // Initialize input values with defaults
  pomodoroInput.value = pomodoroTime;
  shortBreakInput.value = shortBreakTime;
  longBreakInput.value = longBreakTime;

  // Initialize mode buttons with default durations
  updateModeButtons();
});
