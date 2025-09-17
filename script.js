document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const background = document.getElementById('background');
    const storyText = document.getElementById('story-text');
    const triggers = document.querySelectorAll('.trigger');

    let worldPosition = 0;
    const playerSpeed = 15;
    const worldBoundary = -7000; // background width (8000px) - screen width (~1000px)

    let keys = {
        ArrowLeft: false,
        ArrowRight: false,
    };

    // Show the initial instruction text
    storyText.textContent = "Use Left & Right Arrow Keys to move.";
    storyText.style.opacity = '1';
    setTimeout(() => {
        storyText.style.opacity = '0';
    }, 4000);

    // Key press event listeners
    document.addEventListener('keydown', (e) => {
        if (e.key in keys) {
            keys[e.key] = true;
        }
    });

    document.addEventListener('keyup', (e) => {
        if (e.key in keys) {
            keys[e.key] = false;
        }
    });

    // Main game loop function
    function gameLoop() {
        if (keys.ArrowLeft) {
            // Move the world right (player moves left)
            if (worldPosition < 0) {
                worldPosition += playerSpeed;
            }
        }
        if (keys.ArrowRight) {
            // Move the world left (player moves right)
            if (worldPosition > worldBoundary) {
                worldPosition -= playerSpeed;
            }
        }

        // Apply the transformation to the background
        background.style.transform = `translateX(${worldPosition}px)`;

        // Check for story triggers
        checkTriggers();

        // Request the next frame
        requestAnimationFrame(gameLoop);
    }

    function checkTriggers() {
        const playerScreenX = player.getBoundingClientRect().x;

        triggers.forEach(trigger => {
            // If a trigger hasn't been shown yet
            if (!trigger.dataset.triggered) {
                const triggerWorldX = parseInt(trigger.style.left, 10) + worldPosition;
                
                // Check if the player is at the trigger's position on screen
                if (Math.abs(playerScreenX - triggerWorldX) < 50) {
                    showStoryText(trigger.dataset.text);
                    trigger.dataset.triggered = 'true'; // Mark as triggered
                }
            }
        });
    }

    let textTimeout;
    function showStoryText(text) {
        clearTimeout(textTimeout); // Clear previous timeout if any
        storyText.textContent = text;
        storyText.style.opacity = '1';
        
        // Hide the text after 5 seconds
        textTimeout = setTimeout(() => {
            storyText.style.opacity = '0';
        }, 5000);
    }

    // Start the game loop
    gameLoop();
});