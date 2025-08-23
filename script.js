document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const quoteDisplay = document.getElementById('quote-display');
    const typingInput = document.getElementById('typing-input');
    const startBtn = document.getElementById('start-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultResetBtn = document.getElementById('result-reset-btn');
    const wpmElement = document.getElementById('wpm');
    const accuracyElement = document.getElementById('accuracy');
    const timerElement = document.getElementById('timer');
    const timeSelect = document.getElementById('time-select');
    const difficultySelect = document.getElementById('difficulty-select');
    const resultElement = document.getElementById('result');
    const resultWpm = document.getElementById('result-wpm');
    const resultAccuracy = document.getElementById('result-accuracy');
    const historyList = document.getElementById('history-list');
    
    // Test variables
    let timer;
    let timeLeft;
    let isTyping = false;
    let startTime;
    let currentQuote = '';
    let quotes = [];
    let history = [];
    
    // Quote banks by difficulty
    const easyQuotes = [
        "The quick brown fox jumps over the lazy dog.",
        "Programming is the art of telling another human what one wants the computer to do.",
        "The best way to predict the future is to invent it.",
        "Simplicity is the ultimate sophistication.",
        "Hello world! This is a simple typing test."
    ];
    
    const mediumQuotes = [
        "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
        "The only way to learn a new programming language is by writing programs in it.",
        "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.",
        "Ruby is rubbish! PHP is phpantastic!",
        "There are two ways to write error-free programs; only the third one works."
    ];
    
    const hardQuotes = [
        "The computer was born to solve problems that did not exist before. Now, let's talk about quantum computing!",
        "Algorithm: word used by programmers when they don't want to explain what they did.",
        "If debugging is the process of removing software bugs, then programming must be the process of putting them in.",
        "Copy-and-Paste was programmed by programmers for programmers actually.",
        "There are only 10 kinds of people in this world: those who know binary and those who don't."
    ];
    
    // Initialize the test
    function init() {
        // Load history from localStorage if available
        const savedHistory = localStorage.getItem('typingTestHistory');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
            updateHistoryDisplay();
        }
        
        // Set quotes based on difficulty
        updateQuotes();
        
        // Event listeners
        startBtn.addEventListener('click', startTest);
        resetBtn.addEventListener('click', resetTest);
        resultResetBtn.addEventListener('click', resetTest);
        typingInput.addEventListener('input', checkInput);
        timeSelect.addEventListener('change', updateTime);
        difficultySelect.addEventListener('change', updateQuotes);
    }
    
    // Start the test
    function startTest() {
        if (isTyping) return;
        
        isTyping = true;
        startBtn.disabled = true;
        typingInput.disabled = false;
        typingInput.value = '';
        typingInput.focus();
        
        // Get a random quote
        currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
        renderQuote();
        
        // Set up timer
        timeLeft = parseInt(timeSelect.value);
        timerElement.textContent = timeLeft;
        
        // Start timer
        startTime = new Date();
        timer = setInterval(updateTimer, 1000);
        
        // Hide result if shown
        resultElement.style.display = 'none';
    }
    
    // Update timer
    function updateTimer() {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        // Calculate WPM
        const elapsedTime = (new Date() - startTime) / 1000 / 60; // in minutes
        const typedWords = typingInput.value.split(' ').length;
        const wpm = Math.round(typedWords / elapsedTime);
        wpmElement.textContent = wpm || 0;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }
    
    // Check user input
    function checkInput() {
        const inputText = typingInput.value;
        const quoteArray = currentQuote.split('');
        
        // Reset quote display
        quoteDisplay.innerHTML = '';
        
        // Create spans for each character
        quoteArray.forEach((char, index) => {
            const charSpan = document.createElement('span');
            charSpan.classList.add('character');
            charSpan.textContent = char;
            
            if (index < inputText.length) {
                if (char === inputText[index]) {
                    charSpan.classList.add('correct');
                } else {
                    charSpan.classList.add('incorrect');
                }
            }
            
            if (index === inputText.length) {
                charSpan.classList.add('current');
            }
            
            quoteDisplay.appendChild(charSpan);
        });
        
        // Calculate accuracy
        let correctChars = 0;
        for (let i = 0; i < inputText.length; i++) {
            if (inputText[i] === currentQuote[i]) {
                correctChars++;
            }
        }
        
        const accuracy = inputText.length > 0 ? Math.round((correctChars / inputText.length) * 100) : 0;
        accuracyElement.textContent = `${accuracy}%`;
        
        // If user completed the quote, get a new one
        if (inputText === currentQuote) {
            typingInput.value = '';
            currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
            renderQuote();
        }
    }
    
    // Render the current quote
    function renderQuote() {
        quoteDisplay.innerHTML = '';
        currentQuote.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.classList.add('character');
            charSpan.textContent = char;
            quoteDisplay.appendChild(charSpan);
        });
    }
    
    // End the test
    function endTest() {
        clearInterval(timer);
        isTyping = false;
        startBtn.disabled = false;
        typingInput.disabled = true;
        
        // Calculate final stats
        const elapsedTime = parseInt(timeSelect.value) / 60; // in minutes
        const typedWords = typingInput.value.split(' ').length;
        const wpm = Math.round(typedWords / elapsedTime);
        
        let correctChars = 0;
        for (let i = 0; i < typingInput.value.length; i++) {
            if (typingInput.value[i] === currentQuote[i]) {
                correctChars++;
            }
        }
        
        const accuracy = typingInput.value.length > 0 ? Math.round((correctChars / typingInput.value.length) * 100) : 0;
        
        // Update result display
        resultWpm.textContent = wpm;
        resultAccuracy.textContent = `${accuracy}%`;
        resultElement.style.display = 'block';
        
        // Save to history
        history.unshift({
            wpm: wpm,
            accuracy: accuracy,
            date: new Date().toLocaleDateString()
        });
        
        // Keep only last 5 results
        if (history.length > 5) {
            history.pop();
        }
        
        // Save to localStorage
        localStorage.setItem('typingTestHistory', JSON.stringify(history));
        
        // Update history display
        updateHistoryDisplay();
    }
    
    // Reset the test
    function resetTest() {
        clearInterval(timer);
        isTyping = false;
        startBtn.disabled = false;
        typingInput.disabled = true;
        typingInput.value = '';
        wpmElement.textContent = '0';
        accuracyElement.textContent = '0%';
        timerElement.textContent = timeSelect.value;
        resultElement.style.display = 'none';
        
        // Get a new quote
        currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
        renderQuote();
    }
    
    // Update time setting
    function updateTime() {
        if (!isTyping) {
            timerElement.textContent = timeSelect.value;
        }
    }
    
    // Update quotes based on difficulty
    function updateQuotes() {
        const difficulty = difficultySelect.value;
        
        switch(difficulty) {
            case 'easy':
                quotes = easyQuotes;
                break;
            case 'medium':
                quotes = mediumQuotes;
                break;
            case 'hard':
                quotes = hardQuotes;
                break;
        }
        
        // Get a new quote
        if (!isTyping) {
            currentQuote = quotes[Math.floor(Math.random() * quotes.length)];
            renderQuote();
        }
    }
    
    // Update history display
    function updateHistoryDisplay() {
        if (history.length === 0) {
            historyList.innerHTML = '<div class="history-item">No tests completed yet</div>';
            return;
        }
        
        historyList.innerHTML = '';
        history.forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            historyItem.innerHTML = `
                <div>${item.date}</div>
                <div>${item.wpm} WPM (${item.accuracy}%)</div>
            `;
            historyList.appendChild(historyItem);
        });
    }
    
    // Initialize the application
    init();
});
