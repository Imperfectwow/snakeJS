import { buildFruitSelector } from './fruit.js';

// Game initialization

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  const scoreElement = document.getElementById('currentScore');
  const highScoreElement = document.getElementById('bestScore');
  const levelElement = document.getElementById('currentLevel');
  const instructions = document.getElementById('instructions');
  const lastFruitElement = document.getElementById('lastFruit');
  const gameOverScreen = document.getElementById('gameOverScreen');
  const pauseOverlay = document.getElementById('pauseOverlay');
  const finalScore = document.getElementById('finalScore');
  const restartButton = document.getElementById('restartButton');
  const quitButton = document.getElementById('quitButton');

  const snakeSize = 15;
  const fruitSize = snakeSize;
  const BASE_SNAKE_SPEED = 140;
  const SPEED_STEP = 10;
  const MIN_SNAKE_SPEED = 60;
  const POINTS_PER_LEVEL = 5;

  let snakeSpeed = BASE_SNAKE_SPEED;
  let score = 0;
  let level = 1;
  let highScore = loadHighScore();
  let gameRunning = false;
  let isPaused = false;
  let dx = snakeSize;
  let dy = 0;
  let pendingDirection = null;
  let gameLoopId = null;

  const { definitions: fruitDefinitions, pickNext: pickNextFruit } = buildFruitSelector();

  let snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
  let fruit = { position: { x: 0, y: 0 }, type: fruitDefinitions[0] };
  let fruitsEaten = 0;

  document.addEventListener('keydown', handleKeyDown);

  scheduleInstructionsDismissal();

  restartButton.addEventListener('click', () => {
    gameOverScreen.classList.add('hidden');
    initGame();
  });

  quitButton.addEventListener('click', () => {
    window.location.reload();
  });

  function initGame() {
    stopGame();
    score = 0;
    fruitsEaten = 0;
    level = 1;
    snakeSpeed = BASE_SNAKE_SPEED;
    dx = snakeSize;
    dy = 0;
    pendingDirection = null;
    snake = [{ x: canvas.width / 2, y: canvas.height / 2 }];
    placeFruit();
    updateScoreboard();
    resetLastFruitDisplay();
    gameOverScreen.classList.add('hidden');
    pauseOverlay.classList.add('hidden');
    gameRunning = true;
    isPaused = false;
    gameLoop();
  }

  function scheduleInstructionsDismissal() {
    if (!instructions) {
      return;
    }

    let instructionsRemoved = false;

    const finalizeRemoval = () => {
      if (instructionsRemoved) {
        return;
      }

      instructionsRemoved = true;

      if (instructions.parentNode) {
        instructions.parentNode.removeChild(instructions);
      } else {
        instructions.style.display = 'none';
      }
    };

    const hideInstructions = () => {
      if (!instructions || instructionsRemoved || instructions.classList.contains('instructions-hidden')) {
        return;
      }

      instructions.classList.add('instructions-hidden');

      instructions.addEventListener('transitionend', finalizeRemoval, { once: true });

      setTimeout(finalizeRemoval, 600);
    };

    setTimeout(hideInstructions, 3000);

    const interactionHandler = () => {
      hideInstructions();
    };

    document.addEventListener('keydown', interactionHandler, { once: true });
    canvas.addEventListener('pointerdown', interactionHandler, { once: true });
  }

  function gameLoop() {
    if (!gameRunning || isPaused) {
      return;
    }

    gameLoopId = setTimeout(() => {
      clearCanvas();
      drawGrid();
      drawFruit();
      drawSnake();
      updateSnake();
      checkCollision();
      gameLoop();
    }, snakeSpeed);
  }

  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function drawGrid() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 1;

    for (let x = snakeSize; x < canvas.width; x += snakeSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    for (let y = snakeSize; y < canvas.height; y += snakeSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }

  function drawFruit() {
    const scaledFruitWidth = fruitSize * 1.6;
    const scaledFruitHeight = fruitSize * 1.6;
    ctx.drawImage(
      fruit.type.image,
      fruit.position.x,
      fruit.position.y,
      scaledFruitWidth,
      scaledFruitHeight
    );
  }

  function drawSnake() {
    snake.forEach((segment, index) => {
      const gradient = ctx.createLinearGradient(
        segment.x,
        segment.y,
        segment.x + snakeSize,
        segment.y + snakeSize
      );

      if (index === 0) {
        gradient.addColorStop(0, '#00d084');
        gradient.addColorStop(1, '#007b43');
      } else {
        gradient.addColorStop(0, '#22c55e');
        gradient.addColorStop(1, '#15803d');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(segment.x, segment.y, snakeSize, snakeSize);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.strokeRect(segment.x, segment.y, snakeSize, snakeSize);
    });
  }

  function updateSnake() {
    if (pendingDirection) {
      dx = pendingDirection.dx;
      dy = pendingDirection.dy;
      pendingDirection = null;
    }

    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);

    if (head.x === fruit.position.x && head.y === fruit.position.y) {
      handleFruitEaten();
    } else {
      snake.pop();
    }
  }

  function handleFruitEaten() {
    score += fruit.type.points;
    fruitsEaten += 1;
    updateHighScore();
    updateLevel();
    placeFruit();
    updateScoreboard();
    announceFruitPoints(fruit.type);
  }

  function updateLevel() {
    if (fruitsEaten > 0 && fruitsEaten % POINTS_PER_LEVEL === 0) {
      level += 1;
      snakeSpeed = Math.max(MIN_SNAKE_SPEED, snakeSpeed - SPEED_STEP);
    }
  }

  function checkCollision() {
    const head = snake[0];

    const hitWall =
      head.x < 0 ||
      head.y < 0 ||
      head.x >= canvas.width ||
      head.y >= canvas.height;

    if (hitWall) {
      triggerGameOver();
      return;
    }

    for (let i = 4; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        triggerGameOver();
        return;
      }
    }
  }

  function triggerGameOver() {
    stopGame();
    updateHighScore();
    finalScore.innerHTML = `Game Over! Your Score: ${score}<br>Best Score: ${highScore}`;
    gameOverScreen.classList.remove('hidden');
  }

  function stopGame() {
    gameRunning = false;
    isPaused = false;
    if (gameLoopId) {
      clearTimeout(gameLoopId);
      gameLoopId = null;
    }
    pauseOverlay.classList.add('hidden');
  }

  function placeFruit() {
    let newFruitPosition;

    do {
      newFruitPosition = {
        x: Math.floor(Math.random() * (canvas.width / snakeSize)) * snakeSize,
        y: Math.floor(Math.random() * (canvas.height / snakeSize)) * snakeSize,
      };
    } while (isOnSnake(newFruitPosition));

    const randomFruit = pickNextFruit();

    fruit = { position: newFruitPosition, type: randomFruit };
  }

  function isOnSnake(position) {
    return snake.some((segment) => segment.x === position.x && segment.y === position.y);
  }

  function handleKeyDown(event) {
    const key = event.key;

    if (key === ' ' || key.toLowerCase() === 'p') {
      event.preventDefault();
      togglePause();
      return;
    }

    if (!gameRunning || isPaused) {
      return;
    }

    const currentDx = pendingDirection ? pendingDirection.dx : dx;
    const currentDy = pendingDirection ? pendingDirection.dy : dy;

    let newDx = currentDx;
    let newDy = currentDy;

    switch (key) {
      case 'ArrowLeft':
        if (currentDx !== snakeSize) {
          newDx = -snakeSize;
          newDy = 0;
        }
        break;
      case 'ArrowUp':
        if (currentDy !== snakeSize) {
          newDx = 0;
          newDy = -snakeSize;
        }
        break;
      case 'ArrowRight':
        if (currentDx !== -snakeSize) {
          newDx = snakeSize;
          newDy = 0;
        }
        break;
      case 'ArrowDown':
        if (currentDy !== -snakeSize) {
          newDx = 0;
          newDy = snakeSize;
        }
        break;
      default:
        return;
    }

    if (newDx !== currentDx || newDy !== currentDy) {
      pendingDirection = { dx: newDx, dy: newDy };
    }
  }

  function togglePause() {
    if (!gameRunning) {
      return;
    }

    if (isPaused) {
      isPaused = false;
      pauseOverlay.classList.add('hidden');
      gameLoop();
    } else {
      isPaused = true;
      if (gameLoopId) {
        clearTimeout(gameLoopId);
        gameLoopId = null;
      }
      pauseOverlay.classList.remove('hidden');
    }
  }

  function updateScoreboard() {
    scoreElement.textContent = String(score);
    highScoreElement.textContent = String(highScore);
    levelElement.textContent = String(level);
  }

  function resetLastFruitDisplay() {
    if (!lastFruitElement) {
      return;
    }

    lastFruitElement.textContent = '—';
  }

  function announceFruitPoints(fruitType) {
    if (!lastFruitElement) {
      return;
    }

    const prettyName = fruitType.name.charAt(0).toUpperCase() + fruitType.name.slice(1);
    lastFruitElement.textContent = `${prettyName} (+${fruitType.points})`;
  }

  function updateHighScore() {
    if (score > highScore) {
      highScore = score;
      saveHighScore(highScore);
    }
  }

  function loadHighScore() {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return 0;
      }
      const stored = window.localStorage.getItem('snakeHighScore');
      return stored ? Number(stored) || 0 : 0;
    } catch (error) {
      console.warn('Unable to load high score from storage.', error);
      return 0;
    }
  }

  function saveHighScore(value) {
    try {
      if (typeof window === 'undefined' || !window.localStorage) {
        return;
      }
      window.localStorage.setItem('snakeHighScore', String(value));
    } catch (error) {
      console.warn('Unable to save high score to storage.', error);
    }
  }

  updateScoreboard();
  initGame();
});
