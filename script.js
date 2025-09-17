document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const startScreen = document.getElementById('start-screen');
    const gameOverScreen = document.getElementById('game-over-screen');
    const gameContainer = document.getElementById('game-container');
    const carPlayer = document.getElementById('car-player'); // Changed to carPlayer
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
        carPlayer.style.left = '50%'; // Use carPlayer
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
        hazardSpawnerInterval = setInterval(spawnHazard, 800); // Hazards spawn every 0.8 seconds
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
        carPlayer.style.left = `${playerPosition}%`; // Use carPlayer

        // Move hazards and check for collisions
        moveHazards();

        // Update score - every frame means fast scoring, adjust if needed
        score++;
        scoreDisplay.textContent = score;

        gameLoopInterval = requestAnimationFrame(gameLoop);
    }

    // Function to get a random vibrant color
    function getRandomColor() {
        const colors = [
            '#FF6347', // Tomato
            '#FFD700', // Gold
            '#6A5ACD', // SlateBlue
            '#3CB371', // MediumSeaGreen
            '#FF69B4', // HotPink
            '#1E90FF', // DodgerBlue
            '#BA55D3'  // MediumPurple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function spawnHazard() {
        const hazard = document.createElement('div');
        hazard.classList.add('hazard');
        hazard.style.left = `${Math.random() * 95}%`; // Random horizontal position
        hazard.style.backgroundColor = getRandomColor(); // Set random color

        // Optional: Add random shapes
        // const shapes = ['square', 'circle'];
        // hazard.classList.add(shapes[Math.floor(Math.random() * shapes.length)]);

        gameContainer.appendChild(hazard);
    }

    function moveHazards() {
        const playerRect = carPlayer.getBoundingClientRect(); // Use carPlayer

        document.querySelectorAll('.hazard').forEach(hazard => {
            const currentTop = parseFloat(hazard.style.top || -50);
            hazard.style.top = `${currentTop + 5}px`; // Hazards fall faster

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