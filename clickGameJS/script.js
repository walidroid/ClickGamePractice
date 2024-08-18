let score = 0;
let highScore = getStoredHighScore();
let remainingButtons = 30;
let clickTimeout;
const buttonWidth = 100;  // Adjust based on actual button width
const buttonHeight = 50;  // Adjust based on actual button height

const startButton = document.getElementById('start-button');
const gameArea = document.getElementById('game-area');
const instructionElement = document.getElementById('instruction');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('high-score');

startButton.addEventListener('click', startGame);

function getStoredHighScore() {
    return localStorage.getItem('highScore') || 0;
}

function startGame() {
    resetGameVariables();
    updateScoreDisplay();
    hideElement(startButton);
    setInstructionText("Cliquez sur les boutons : clic gauche, clic droit, double-clic !");
    clearGameArea();
    createGameButtons();
}

function resetGameVariables() {
    score = 0;
    remainingButtons = 30;
}

function hideElement(element) {
    element.style.display = 'none';
}

function setInstructionText(text) {
    instructionElement.textContent = text;
}

function clearGameArea() {
    gameArea.innerHTML = '';
}

function createGameButtons() {
    const actions = generateButtonActions();
    const colors = getButtonColors();
    
    actions.forEach(action => {
        const button = createButton(action, colors);
        positionButtonRandomly(button);
        addClickEventListeners(button);
        gameArea.appendChild(button);
    });
}

function generateButtonActions() {
    const actions = Array(10).fill(['Clic gauche', 'Clic droit', 'Double clic']).flat();
    return shuffleArray(actions);
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function getButtonColors() {
    return ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'cyan', 'magenta', 'white'];
}

function createButton(action, colors) {
    const button = document.createElement('button');
    button.textContent = action;
    button.className = 'game-button';
    button.style.backgroundColor = getRandomColor(colors);
    return button;
}

function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

function positionButtonRandomly(button) {
    const maxLeft = gameArea.clientWidth - buttonWidth;
    const maxTop = gameArea.clientHeight - buttonHeight;
    button.style.left = `${Math.random() * maxLeft}px`;
    button.style.top = `${Math.random() * maxTop}px`;
}

function addClickEventListeners(button) {
    button.addEventListener('click', (e) => handleClick(e, button, 'left'));
    button.addEventListener('contextmenu', (e) => handleClick(e, button, 'right'));
    button.addEventListener('dblclick', (e) => handleClick(e, button, 'double'));
}

function handleClick(event, button, clickType) {
    event.preventDefault();
    clearExistingTimeout();
    
    clickTimeout = setTimeout(() => {
        processClick(button, clickType);
        updateScoreDisplay();
    }, 250);
}

function clearExistingTimeout() {
    if (clickTimeout) {
        clearTimeout(clickTimeout);
        clickTimeout = null;
    }
}

function processClick(button, clickType) {
    if (isCorrectClick(button, clickType)) {
        updateScore(button.textContent);
        handleCorrectClick(button);
    } else {
        score--;
    }
}

function isCorrectClick(button, clickType) {
    return (button.textContent === 'Clic gauche' && clickType === 'left') ||
           (button.textContent === 'Clic droit' && clickType === 'right') ||
           (button.textContent === 'Double clic' && clickType === 'double');
}

function updateScore(action) {
    if (action === 'Double clic') {
        score += 2;
    } else {
        score++;
    }
}

function handleCorrectClick(button) {
    hideElement(button);
    remainingButtons--;
    if (remainingButtons === 0) {
        endGame();
    }
}

function endGame() {
    setInstructionText(`Bravo ! Vous avez terminé le jeu ! Score final : ${score}`);
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        updateHighScoreDisplay();
    }
    setTimeout(resetGame, 2000);
}

function resetGame() {
    setInstructionText("Cliquez sur 'Start Game' pour commencer!");
    showElement(startButton);
    clearGameArea();
    resetGameVariables();
    updateScoreDisplay();
}

function showElement(element) {
    element.style.display = 'inline-block';
}

function updateScoreDisplay() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateHighScoreDisplay() {
    highScoreElement.textContent = `High Score: ${highScore}`;
}

updateHighScoreDisplay();
