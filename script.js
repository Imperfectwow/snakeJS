document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  console.log('Script loaded');

  const ctx = canvas.getContext('2d');
  const scoreElement = document.getElementById('score').querySelector('span');
  const snakeSize = 15;
  const appleSize = snakeSize;
  let snakeSpeed = 100; // time in milliseconds between each frame
  let score = 0;
  let gameRunning = false;
  let dx = snakeSize; // horizontal delta
  let dy = 0; // vertical delta

  const gameOverScreen = document.getElementById('gameOverScreen');
  const finalScore = document.getElementById('finalScore');
  const restartButton = document.getElementById('restartButton');
  const quitButton = document.getElementById('quitButton');
  // Define snake, apple
  let snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
  let apple = { x: 0, y: 0 };

  // Place the apple randomly on the canvas in the beginning
  moveApple();

  // Listen to keyboard events to move the snake
  document.addEventListener('keydown', changeDirection);

  function showGameOverScreen() {
    finalScore.textContent = `Game Over! Your Score: ${score}`;
    gameOverScreen.style.display = 'flex'; // Show the game over screen
  }

  restartButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none'; // Hide the game over screen
    initGame();
  });

  quitButton.addEventListener('click', () => {
    gameOverScreen.style.display = 'none'; // Hide the game over screen
    window.close(); // This will not work for tabs not opened by window.open()
  });

  // Game initialization
  function initGame() {
    gameOverScreen.style.display = 'none';
    gameRunning = true;
    score = 0;
    scoreElement.textContent = score;
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
    dx = snakeSize;
    dy = 0;
    moveApple();
    gameLoop();
  }

  // Game loop
  function gameLoop() {
    if (gameRunning) {
      setTimeout(() => {
        clearCanvas();
        drawApple();
        drawSnake();
        updateSnake();
        checkCollision();
        gameLoop();
      }, snakeSpeed);
    }
  }

  const appleImage = new Image();
  appleImage.src = 'images/apple.png';
  // Draw the apple

  function drawApple() {
    const scaledAppleWidth = appleSize * 1.6;
    const scaledAppleHeight = appleSize * 1.6;
    ctx.drawImage(appleImage, apple.x, apple.y, scaledAppleWidth, scaledAppleHeight);
  }

  // Clear the canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Draw the snake
  function drawSnake() {
    ctx.fillStyle = 'black'; // snake color
    snake.forEach((segment) => {
      ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
    });
  }

  // Update the snake's position
  function updateSnake() {
    // Create the new Snake's head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    // Check if snake has eaten the apple
    if (snake[0].x === apple.x && snake[0].y === apple.y) {
      score += 1;
      scoreElement.textContent = score;
      moveApple();
    } else {
      // Remove the snake's tail
      snake.pop();
    }
  }

  // Check for collisions
  function checkCollision() {
    const head = snake[0];
    // Check collision with game boundaries
    if (head.x < 0 || head.y < 0 || head.x >= canvas.width || head.y >= canvas.height) {
      gameRunning = false;
      showGameOverScreen(); // Show the game over screen
    }
    // Check collision with self
    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        gameRunning = false;
        showGameOverScreen(); // Show the game over screen
      }
    }
  }

  // Move the apple to a random position
  function moveApple() {
    apple.x = Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize;
    apple.y = Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize;
  }

  // Change the direction of the snake based on key presses
  function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const goingUp = dy === -snakeSize;
    const goingDown = dy === snakeSize;
    const goingRight = dx === snakeSize;
    const goingLeft = dx === -snakeSize;

    if (keyPressed === LEFT_KEY && !goingRight) {
      dx = -snakeSize;
      dy = 0;
    }

    if (keyPressed === UP_KEY && !goingDown) {
      dx = 0;
      dy = -snakeSize;
    }

    if (keyPressed === RIGHT_KEY && !goingLeft) {
      dx = snakeSize;
      dy = 0;
    }

    if (keyPressed === DOWN_KEY && !goingUp) {
      dx = 0;
      dy = snakeSize;
    }
  }

  // Start the game
  initGame();
});
