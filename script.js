document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const gameContainer = document.getElementById('game-container');
    const player = document.getElementById('player');
    const scoreDisplay = document.getElementById('score-display');
    const finalScoreDisplay = document.getElementById('final-score');
    const startButton = document.getElementById('start-button');
    const restartButton = document.getElementById('restart-button');

    // --- Game State Variables ---
    let playerPosition = 50; // In percentage
    const playerSpeed = 2;
    let score = 0;
    let isGameOver = false;
    let hazardSpawnerInterval;
    let gameLoopInterval;

    const keys = {
        ArrowLeft: false,
        ArrowRight: false,
    };

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    document.addEventListener('keydown', e => {
        if (e.key in keys) keys[e.key] = true;
    });
    document.addEventListener('keyup', e => {
        if (e.key in keys) keys[e.key] = false;
    });

    // --- Game Logic Functions ---

    function startGame() {
        // 1. Reset game state
        isGameOver = false;
        score = 0;
        playerPosition = 50;
        player.style.left = '50%';
        scoreDisplay.textContent = 0;

        // 2. Clear any old game elements
        document.querySelectorAll('.hazard').forEach(h => h.remove());
        clearInterval(hazardSpawnerInterval);
        cancelAnimationFrame(gameLoopInterval);

        // 3. Switch visible screens
        startScreen.classList.add('hidden');
        gameOverScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');

        // 4. Start the game loops
        hazardSpawnerInterval = setInterval(spawnHazard, 800);
        gameLoop();
    }

    function gameLoop() {
        if (isGameOver) return;

        // Move player
        if (keys.ArrowLeft && playerPosition > 2) {
            playerPosition -= playerSpeed;
        }
        if (keys.ArrowRight && playerPosition < 98) {
            playerPosition += playerSpeed;
        }
        player.style.left = `${playerPosition}%`;

        // Move hazards and check for collisions
        moveHazards();
        
        // Update score
        score++;
        scoreDisplay.textContent = score;

        gameLoopInterval = requestAnimationFrame(gameLoop);
    }

    function spawnHazard() {
        const hazard = document.createElement('div');
        hazard.classList.add('hazard');
        hazard.style.left = `${Math.random() * 95}%`; // Random horizontal position
        gameContainer.appendChild(hazard);
    }

    function moveHazards() {
        const playerRect = player.getBoundingClientRect();

        document.querySelectorAll('.hazard').forEach(hazard => {
            const currentTop = parseFloat(hazard.style.top || -50);
            hazard.style.top = `${currentTop + 5}px`;

            // Remove hazard if it goes off-screen
            if (currentTop > window.innerHeight) {
                hazard.remove();
            }

            // Check for collision
            const hazardRect = hazard.getBoundingClientRect();
            if (
                playerRect.left < hazardRect.left + hazardRect.width &&
                playerRect.left + playerRect.width > hazardRect.left &&
                playerRect.top < hazardRect.top + hazardRect.height &&
                playerRect.top + playerRect.height > hazardRect.top
            ) {
                endGame();
            }
        });
    }

    function endGame() {
        isGameOver = true;
        clearInterval(hazardSpawnerInterval); // Stop new hazards
        cancelAnimationFrame(gameLoopInterval); // Stop the game loop

        finalScoreDisplay.textContent = score;
        gameContainer.classList.add('hidden');
        gameOverScreen.classList.remove('hidden');
    }
});