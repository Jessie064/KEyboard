// Setup
document.addEventListener('DOMContentLoaded', () => {
    const wordInput = document.getElementById('wordInput');
    const addWordButton = document.getElementById('addWordButton');
    const wordList = document.getElementById('wordList');
    const startButton = document.getElementById('startButton');
    const typingSection = document.querySelector('.typing-section');
    const currentWordDisplay = document.getElementById('currentWord');
    const typingInput = document.getElementById('typingInput');
    const feedbackMessage = document.getElementById('feedback');

    let words = [];
    let currentWordIndex = 0;

    // Debounce function
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Throttling function (Dili kaayo magamit nga logic ani)
    // const throttle = (func, delay) => {
    //     let inThrottle = false;
    //     return (...args) => {
    //         if (!inThrottle) {
    //             func.apply(this, args);
    //             inThrottle = true;
    //             setTimeout(() => inThrottle = false, delay);
    //         }
    //     };
    // };
   //array
    const updateWordList = () => {
        wordList.innerHTML = '';
        words.forEach((word, index) => {
            const li = document.createElement('li');
            li.textContent = word;
            const removeButton = document.createElement('button');
            removeButton.textContent = '×';
            removeButton.classList.add('remove-word');
            removeButton.onclick = () => removeWord(index);
            li.appendChild(removeButton);
            wordList.appendChild(li);
        });
        startButton.disabled = words.length === 0;
    };
    //get word
    const addWord = () => {
        const newWord = wordInput.value.trim();
        if (newWord) {
            words.push(newWord);
            wordInput.value = '';
            updateWordList();
        }
    };

    const removeWord = (index) => {
        words.splice(index, 1);
        updateWordList();
    };

    addWordButton.addEventListener('click', addWord);
    wordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addWord();
        }
    });

    startButton.addEventListener('click', () => {
        if (words.length > 0) {
            startButton.style.display = 'none';
            wordInput.parentElement.style.display = 'none';
            wordList.style.display = 'none';
            typingSection.style.display = 'block';
            typingInput.disabled = false;
            typingInput.focus();
            currentWordIndex = 0;
            displayCurrentWord();
        }
    });

    const displayCurrentWord = () => {
        if (currentWordIndex < words.length) {
            currentWordDisplay.textContent = words[currentWordIndex];
            typingInput.value = '';
            feedbackMessage.textContent = '';
        } else {
            endTypingActivity();
        }
    };

    const endTypingActivity = () => {
        currentWordDisplay.textContent = 'Mana baii!';
        typingInput.style.display = 'none';
        feedbackMessage.textContent = 'Nayss ka baii!';
        setTimeout(() => {
            resetApp();
        }, 3000);
    };
    
    const resetApp = () => {
        startButton.style.display = 'block';
        startButton.textContent = 'Start Typing Again';
        wordInput.parentElement.style.display = 'flex';
        wordList.style.display = 'block';
        typingSection.style.display = 'none';
        typingInput.style.display = 'block';
        feedbackMessage.textContent = '';
    }

    const checkWord = () => {
        const typedWord = typingInput.value.trim();
        const currentWord = words[currentWordIndex];

        if (typedWord === currentWord) {
            feedbackMessage.textContent = 'Sakto ka bai!';
            feedbackMessage.classList.add('feedback-correct');
            feedbackMessage.classList.remove('feedback-incorrect');
            currentWordIndex++;
            setTimeout(displayCurrentWord, 500); // Auto-move to next word after a short delay
        } else if (currentWord.startsWith(typedWord)) {
            feedbackMessage.textContent = '';
            feedbackMessage.className = 'feedback-message';
        }
        else {
            feedbackMessage.textContent = 'Sayop ka bai!';
            feedbackMessage.classList.add('feedback-incorrect');
            feedbackMessage.classList.remove('feedback-correct');
        }
    };

    // Use a debounced function for the typing input to avoid checking on every keystroke
    typingInput.addEventListener('input', debounce(checkWord, 300));
});