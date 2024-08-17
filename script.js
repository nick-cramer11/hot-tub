document.addEventListener('DOMContentLoaded', function () {
    const categorySelect = document.getElementById('category-select');
    const questionBox = document.getElementById('question-display');
    const questionText = document.getElementById('question-text');
    const generateButton = document.getElementById('generate-button');
    const loadingIndicator = document.getElementById('loading-indicator');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    let questions = {};

    // Fetch questions from JSON file
    function loadQuestions() {
        loadingIndicator.style.display = 'block'; // Show loading indicator
        fetch('questions.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                questions = data;
                loadingIndicator.style.display = 'none'; // Hide loading indicator
            })
            .catch(error => {
                console.error('Error loading questions:', error);
                questionText.textContent = 'Error loading questions.';
                loadingIndicator.style.display = 'none'; // Hide loading indicator
            });
    }

    loadQuestions(); // Load questions on page load

    categorySelect.addEventListener('change', function () {
        const category = this.value;
        questionBox.className = `question-box category-${category}`;
        if (category === 'all') {
            questionText.textContent = 'Select a category to start.';
        } else {
            generateQuestion();
        }
    });

    generateButton.addEventListener('click', function () {
        loadingIndicator.style.display = 'block'; // Show loading indicator
        if (categorySelect.value !== 'all') {
            generateQuestion();
        } else {
            generateAllQuestions();
        }
        loadingIndicator.style.display = 'none'; // Hide loading indicator
    });

    darkModeToggle.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        questionBox.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('dark-mode', isDarkMode);
    });

    // Apply dark mode if previously set in localStorage
    const savedDarkMode = localStorage.getItem('dark-mode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        questionBox.classList.add('dark-mode');
    }

    function generateQuestion() {
        const category = categorySelect.value;
        const questionsList = questions[category];
        if (questionsList && questionsList.length > 0) {
            const randomIndex = Math.floor(Math.random() * questionsList.length);
            questionText.textContent = questionsList[randomIndex];
        } else {
            questionText.textContent = 'No questions available.';
        }
    }

    function generateAllQuestions() {
        // Collect all questions from all categories
        const allQuestions = Object.values(questions).flat();
        if (allQuestions.length > 0) {
            const randomIndex = Math.floor(Math.random() * allQuestions.length);
            questionText.textContent = allQuestions[randomIndex];
        } else {
            questionText.textContent = 'No questions available.';
        }
    }
});
