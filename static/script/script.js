const cube = document.querySelector('.cube');
const gameContainer = document.querySelector('.game-container');
const scoreCounter = document.getElementById('scoreCounter');

let isGameOver = false;
let isJumping = false;
let gravityInterval;
let obstacleInterval;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameSpeed = 5;

const startText = document.querySelector('.start-text');

startText.style.display = 'block';  // Show the start text initially

document.addEventListener('click', () => {
    if (!isJumping && startText.style.display === 'block') {
        startText.style.display = 'none';  // Hide the start text
        initializeGame();  // Start the game
    } else if (!isJumping) {
        jump();
    }
});



function initializeGame() {
    obstacleInterval = setInterval(() => {
        createObstacle();
        score++;
        scoreCounter.innerText = score;
        increaseSpeed();
    }, 2000);
}


function jump() {
    let jumpHeight = 0;
    const jumpLimit = 150;  // Adjust the jump height

    const jumpIncrement = 5;  // Adjust the ascent speed
    const jumpUp = setInterval(() => {
        cube.style.bottom = `${jumpHeight}px`;
        jumpHeight += jumpIncrement;

        if (jumpHeight > jumpLimit) {
            clearInterval(jumpUp);
            isJumping = true;
            gravity();
        }
    }, 20);  // Adjust this for slower/faster jumps
}




function gravity() {
    let jumpHeight = 150;  // Match this with the jumpLimit

    const gravityIncrement = 5;  // Adjust the descent speed
    gravityInterval = setInterval(() => {
        if (cube.style.bottom.replace('px', '') > 0 && isJumping) {
            cube.style.bottom = `${jumpHeight}px`;
            jumpHeight -= gravityIncrement;

            if (jumpHeight <= 0) {
                clearInterval(gravityInterval);
                isJumping = false;
            }
        }
    }, 20);  // Adjust this for slower/faster falls
}




function checkCollision(obstacle) {
    const cubeRect = cube.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    return (
        cubeRect.left < obstacleRect.right &&
        cubeRect.right > obstacleRect.left &&
        cubeRect.top < obstacleRect.bottom &&
        cubeRect.bottom > obstacleRect.top
    );
}



function increaseSpeed() {
    gameSpeed += 0.01;
}





let obstacleIntervals = [];

function gameOver(obstacleMover) {
    if (!isGameOver) {
        isGameOver = true; // Set game over to true to prevent this function from running multiple times
        obstacleIntervals.forEach(interval => clearInterval(interval));

        clearInterval(obstacleMover);
        clearInterval(gravityInterval);
        clearInterval(obstacleInterval);
        
    
        const centeredContent = document.createElement('div');
        centeredContent.className = "centered-content";
    
        const highScoreDisplay = document.createElement('div');
        highScoreDisplay.className = "high-score";
        highScoreDisplay.innerText = `High Score: ${highScore}`;
        centeredContent.appendChild(highScoreDisplay);
    
        const restartButton = document.createElement('button');
        restartButton.className = "restart-button";
        restartButton.innerText = "Restart";
        restartButton.onclick = () => location.reload();
        centeredContent.appendChild(restartButton);
    
        gameContainer.appendChild(centeredContent);
    
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
        }
    }
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');

    const colors = ['--color-danger', '--color-success', '--color-warning'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    obstacle.style.backgroundColor = `var(${randomColor})`;

    const obstacleWidth = Math.floor(Math.random() * 30) + 20;
    obstacle.style.width = `${obstacleWidth}px`;

    gameContainer.appendChild(obstacle);

    // Set the starting position to the width of the game container
    let obstaclePosition = gameContainer.offsetWidth;

    const moveObstacle = setInterval(() => {
        if (obstaclePosition < -obstacleWidth) {
            clearInterval(moveObstacle);
            gameContainer.removeChild(obstacle);
        } else if (checkCollision(obstacle)) {
            gameOver(moveObstacle);
        } else {
            obstaclePosition -= gameSpeed;
            obstacle.style.left = `${obstaclePosition}px`;  // Adjusting the left positioning
        }
    }, 20);

    obstacleIntervals.push(moveObstacle);
}


