// Navigation
document.getElementById('dashboard-btn').addEventListener('click', () => toggleSection('dashboard'));
document.getElementById('create-btn').addEventListener('click', () => toggleSection('flashcard-creation'));
document.getElementById('review-btn').addEventListener('click', () => toggleSection('review-session'));

function toggleSection(sectionId) {
  document.querySelectorAll('section').forEach(section => section.classList.add('hidden'));
  document.getElementById(sectionId).classList.remove('hidden');
}

// Flashcard Storage
let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

document.getElementById('flashcard-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const question = document.getElementById('question').value;
  const answer = document.getElementById('answer').value;

  const newCard = {
    id: Date.now(),
    question,
    answer,
    nextReviewDate: new Date().toISOString().split('T')[0], // default to today
    easeFactor: 2.5,
    timesReviewed: 0
  };

  flashcards.push(newCard);
  localStorage.setItem('flashcards', JSON.stringify(flashcards));
  alert('Flashcard added!');
  e.target.reset();
});

// Review Logic
// Fetch the due flashcards
function fetchDueFlashcards() {
  const today = new Date().toISOString().split('T')[0];
  return flashcards.filter(card => card.nextReviewDate <= today);
}

// Display a flashcard
function displayFlashcard(card) {
  document.getElementById('question-display').textContent = card.question;
  document.getElementById('answer-display').textContent = card.answer;
  document.getElementById('answer-display').classList.add('hidden');
}

// Handle the flip action
document.getElementById('flip-btn').addEventListener('click', () => {
  document.getElementById('answer-display').classList.toggle('hidden');
});

// Handle feedback submission (Easy, Moderate, Hard)
document.querySelectorAll('.feedback-btn').forEach(button => {
  button.addEventListener('click', (e) => {
    const difficulty = e.target.dataset.difficulty;
    const card = currentCard;

    updateFlashcardAfterReview(card, difficulty);
  });
});

// Update flashcard based on feedback
function updateFlashcardAfterReview(card, difficulty) {
  // Update ease factor and next review date
  switch (difficulty) {
    case 'easy':
      card.easeFactor = Math.min(2.5, card.easeFactor + 0.2); // Increase ease factor, but not above 2.5
      break;
    case 'moderate':
      card.easeFactor = card.easeFactor; // No change to ease factor
      break;
    case 'hard':
      card.easeFactor = Math.max(1.3, card.easeFactor - 0.1); // Decrease ease factor, but not below 1.3
      break;
  }

  // Update the next review date (using the ease factor and review time)
  const nextReviewDate = calculateNextReviewDate(card.easeFactor);
  card.nextReviewDate = nextReviewDate;

  // Save back to localStorage
  localStorage.setItem('flashcards', JSON.stringify(flashcards));

  // Move to next flashcard or show completion
  showNextFlashcard();
}

// Calculate the next review date based on ease factor (this is a simple example)
function calculateNextReviewDate(easeFactor) {
  const nextReviewInDays = 5 * easeFactor;  // Example: ease factor multiplies the review time
  const nextReviewDate = new Date();
  nextReviewDate.setDate(nextReviewDate.getDate() + nextReviewInDays);
  return nextReviewDate.toISOString().split('T')[0]; // Returns date in YYYY-MM-DD format
}

// Show the next flashcard
function showNextFlashcard() {
  if (flashcards.length === 0) {
    alert("All flashcards reviewed for today!");
    return;
  }

  const dueCards = fetchDueFlashcards();
  if (dueCards.length > 0) {
    currentCard = dueCards[0]; // Pick the first card due for review
    displayFlashcard(currentCard);
  }
  else {
    alert("No flashcards to review right now.");
  }
}

// Initialize flashcards
let currentCard = null;

// Start reviewing when the review button is clicked
document.getElementById('review-btn').addEventListener('click', () => {
  toggleSection('review-session');
  showNextFlashcard();
});

// See all Flashcards*****
// Navigation
document.getElementById('view-all-btn').addEventListener('click', () => toggleSection('view-all-cards'));
document.getElementById('back-to-dashboard').addEventListener('click', () => toggleSection('dashboard'));

// Show all flashcards
function showAllFlashcards() {
    const flashcardList = document.getElementById('flashcard-list');
    flashcardList.innerHTML = ''; // Clear the current list
    
    flashcards.forEach(card => {
        const listItem = document.createElement('li');
        listItem.classList.add('flashcard-item');
        
        // Create the flashcard content
        listItem.innerHTML = `
            <p><strong>Question:</strong> ${card.question}</p>
            <p><strong>Answer:</strong> ${card.answer}</p>
            <p><strong>Next Review:</strong> ${card.nextReviewDate}</p>
            <button class="edit-btn" data-id="${card.id}">Edit</button>
            <button class="delete-btn" data-id="${card.id}">Delete</button>
        `;
        
        // Append the list item to the list
        flashcardList.appendChild(listItem);
    });
}

// Handle the edit and delete actions
document.getElementById('flashcard-list').addEventListener('click', (e) => {
    const cardId = e.target.dataset.id;
    if (e.target.classList.contains('delete-btn')) {
        deleteFlashcard(cardId);
    } else if (e.target.classList.contains('edit-btn')) {
        editFlashcard(cardId);
    }
});

// Delete a flashcard
function deleteFlashcard(cardId) {
    flashcards = flashcards.filter(card => card.id !== parseInt(cardId));
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    showAllFlashcards(); // Refresh the list
}

// Load and display the flashcards when the "View All" section is accessed
document.getElementById('view-all-btn').addEventListener('click', showAllFlashcards);

// POPUP****
// Show the edit popup when the "Edit" button is clicked
document.getElementById('flashcard-list').addEventListener('click', (e) => {
    const cardId = e.target.dataset.id;
    if (e.target.classList.contains('edit-btn')) {
        openEditPopup(cardId);
    }
});

// Open the edit popup and pre-fill the form
function openEditPopup(cardId) {
    const card = flashcards.find(card => card.id === parseInt(cardId));
    
    // Pre-fill the form fields with the current card details
    document.getElementById('edit-question').value = card.question;
    document.getElementById('edit-answer').value = card.answer;
    
    // Store the card's ID in the popup (to know which card to update)
    document.getElementById('save-edit-btn').dataset.id = cardId;

    // Show the popup
    document.getElementById('edit-popup').classList.remove('hidden');
}

// Save the changes made in the popup
document.getElementById('save-edit-btn').addEventListener('click', () => {
    const cardId = document.getElementById('save-edit-btn').dataset.id;
    const card = flashcards.find(card => card.id === parseInt(cardId));

    // Get the new values from the form
    const newQuestion = document.getElementById('edit-question').value;
    const newAnswer = document.getElementById('edit-answer').value;

    // Update the card with the new values
    card.question = newQuestion;
    card.answer = newAnswer;

    // Save the updated flashcards to localStorage
    localStorage.setItem('flashcards', JSON.stringify(flashcards));

    // Refresh the view of all flashcards
    showAllFlashcards();

    // Close the popup
    document.getElementById('edit-popup').classList.add('hidden');
});

// Cancel button closes the popup without saving
document.getElementById('cancel-edit-btn').addEventListener('click', () => {
    document.getElementById('edit-popup').classList.add('hidden');
});
