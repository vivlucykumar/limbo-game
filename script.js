document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');

    const startScreen = document.getElementById('startScreen');
    const gameOverScreen = document.getElementById('gameOverScreen');
    const startButton = document.getElementById('startButton');
    const restartButton = document.getElementById('restartButton');
    const finalScoreEl = document.getElementById('finalScore');

    // --- Game Configuration ---
    let canvasWidth = 800;
    let canvasHeight = 400;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let score = 0;
    let highscore = 0;
    let isGameOver = true;
    let gameSpeed = 5;
    let gravity = 0.5;
    let obstacleTimer = 0;
    let obstacleInterval = 100; // Time between obstacles

    // --- Player ---
    const player = {
        x: 50,
        y: canvasHeight - 60,
        width: 40,
        height: 60,
        dy: 0, // velocity
        jumpPower: -12,
        isJumping: false,

        draw() {
            ctx.fillStyle = '#000'; // Silhouette
            ctx.fillRect(this.x, this.y, this.width, this.height);
        },

        update() {
            // Apply gravity
            if (this.y + this.height < canvasHeight) {
                this.dy += gravity;
            } else {
                this.dy = 0;
                this.isJumping = false;
                this.y = canvasHeight - this.height;
            }
            
            this.y += this.dy;
        },

        jump() {
            if (!this.isJumping) {
                this.dy = this.jumpPower;
                this.isJumping = true;
            }
        }
    };

    // --- Obstacles ---
    let obstacles = [];

    class Obstacle {
        constructor() {
            this.width = Math.random() * (60 - 20) + 20; // Random width
            this.height = Math.random() * (80 - 20) + 20; // Random height
            this.x = canvasWidth;
            this.y = canvasHeight - this.height;
        }

        draw() {
            ctx.fillStyle = '#000'; // Silhouette
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }

        update() {
            this.x -= gameSpeed;
        }
    }

    function handleObstacles() {
        obstacleTimer++;
        if (obstacleTimer % obstacleInterval === 0) {
            obstacles.push(new Obstacle());
            // Make game harder over time
            if (obstacleInterval > 40) {
                 obstacleInterval -= 0.5;
            }
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            obstacles[i].update();
            obstacles[i].draw();

            // Collision detection
            if (
                player.x < obstacles[i].x + obstacles[i].width &&
                player.x + player.width > obstacles[i].x &&
                player.y < obstacles[i].y + obstacles[i].height &&
                player.y + player.height > obstacles[i].y
            ) {
                endGame();
            }

            // Remove obstacles that have gone off-screen
            if (obstacles[i].x + obstacles[i].width < 0) {
                obstacles.splice(i, 1);
                score++;
                gameSpeed += 0.05; // Increase speed slightly with each passed obstacle
            }
        }
    }

    // --- Game State ---
    function resetGame() {
        player.y = canvasHeight - player.height;
        player.dy = 0;
        obstacles = [];
        score = 0;
        gameSpeed = 5;
        obstacleInterval = 100;
        isGameOver = false;
        gameOverScreen.classList.add('hidden');
    }

    function startGame() {
        resetGame();
        startScreen.classList.add('hidden');
        gameLoop();
    }

    function endGame() {
        isGameOver = true;
        if (score > highscore) {
            highscore = score;
        }
        finalScoreEl.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    // --- Drawing Functions ---
    function drawScore() {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.font = '20px "Courier New"';
        ctx.fillText(`Score: ${score}`, 20, 30);
    }
    
    function drawGround() {
        ctx.fillStyle = '#000';
        ctx.fillRect(0, canvasHeight - 10, canvasWidth, 10);
    }

    // --- Game Loop ---
    let animationFrameId;
    function gameLoop() {
        if (isGameOver) return;
        
        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        player.update();
        player.draw();

        handleObstacles();
        drawGround();
        drawScore();

        animationFrameId = requestAnimationFrame(gameLoop);
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', startGame);

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !isGameOver) {
            player.jump();
        }
    });

    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent screen from scrolling
        if (!isGameOver) {
            player.jump();
        }
    });
});