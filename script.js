const quotes = [
    "The quick brown fox jumps over the lazy dog.",
    "Programming is the art of telling another human what one wants the computer to do.",
    "The best way to predict the future is to invent it.",
    "Simplicity is the ultimate sophistication.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand."
];

let timer;
let timeLeft = 60;
let isTyping = false;
let startTime;
let quoteText = '';

document.getElementById('start').addEventListener('click', startTest);
document.getElementById('input').addEventListener('input', checkTyping);

function startTest() {
    if (isTyping) return;
    
    isTyping = true;
    timeLeft = 60;
    document.getElementById('start').disabled = true;
    document.getElementById('input').disabled = false;
    document.getElementById('input').value = '';
    document.getElementById('input').focus();
    
    // Select random quote
    quoteText = quotes[Math.floor(Math.random() * quotes.length)];
    document.getElementById('quote').innerHTML = '';
    quoteText.split('').forEach(char => {
        const charSpan = document.createElement('span');
        charSpan.innerText = char;
        document.getElementById('quote').appendChild(charSpan);
    });
    
    startTime = new Date().getTime();
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function checkTyping() {
    const inputText = document.getElementById('input').value;
    const quoteArray = document.getElementById('quote').querySelectorAll('span');
    
    let correctChars = 0;
    
    inputText.split('').forEach((char, index) => {
        if (quoteArray[index]) {
            if (char === quoteArray[index].innerText) {
                quoteArray[index].className = 'correct';
                correctChars++;
            } else {
                quoteArray[index].className = 'incorrect';
            }
        }
    });
    
    // Calculate WPM (5 characters = 1 word)
    const timeElapsed = (new Date().getTime() - startTime) / 60000; // in minutes
    const wpm = Math.round((correctChars / 5) / timeElapsed);
    document.getElementById('wpm').textContent = wpm;
    
    // Calculate accuracy
    const accuracy = inputText.length > 0 ? Math.round((correctChars / inputText.length) * 100) : 0;
    document.getElementById('accuracy').textContent = accuracy;
}

function endTest() {
    clearInterval(timer);
    isTyping = false;
    document.getElementById('input').disabled = true;
    document.getElementById('start').disabled = false;
}
