// Snake Game Easter Egg - triggered by typing "snake"
let typed = '';
document.addEventListener('keydown', function(e) {
    typed += e.key.toLowerCase();
    if (typed.endsWith('snake')) {
        startSnakeGame();
        typed = '';
    }
    if (typed.length > 20) typed = typed.slice(-20);
});

let snakeGameRunning = false;

function startSnakeGame() {
    if (snakeGameRunning) return;
    snakeGameRunning = true;

    const overlay = document.getElementById('snake-overlay');
    overlay.style.display = 'flex';

    const canvas = document.getElementById('snake-canvas');
    const ctx = canvas.getContext('2d');
    const grid = 20;
    let count = 0;
    let score = 0;

    let snake = {
        x: 160,
        y: 160,
        dx: grid,
        dy: 0,
        cells: [],
        maxCells: 4
    };

    let apple = {
        x: 320,
        y: 320
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function loop() {
        if (!snakeGameRunning) return;

        requestAnimationFrame(loop);

        if (++count < 8) return; // game speed
        count = 0;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Move snake
        snake.x += snake.dx;
        snake.y += snake.dy;

        // Wrap around edges (optional - comment out for wall collision)
        if (snake.x >= canvas.width) snake.x = 0;
        if (snake.x < 0) snake.x = canvas.width - grid;
        if (snake.y >= canvas.height) snake.y = 0;
        if (snake.y < 0) snake.y = canvas.height - grid;

        // Keep track of snake body
        snake.cells.unshift({x: snake.x, y: snake.y});
        if (snake.cells.length > snake.maxCells) {
            snake.cells.pop();
        }

        // Eat apple
        if (snake.x === apple.x && snake.y === apple.y) {
            snake.maxCells++;
            score++;
            document.getElementById('snake-score').textContent = 'Score: ' + score;

            apple.x = getRandomInt(0, 20) * grid;
            apple.y = getRandomInt(0, 20) * grid;
        }

        // Draw apple
        ctx.fillStyle = 'red';
        ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

        // Draw snake
        ctx.fillStyle = 'lime';
        snake.cells.forEach((cell, index) => {
            ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
            // Head glow
            if (index === 0) {
                ctx.fillStyle = '#0f0';
                ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
                ctx.fillStyle = 'lime';
            }
        });

        // Game over - hit self
        for (let i = 1; i < snake.cells.length; i++) {
            if (snake.x === snake.cells[i].x && snake.y === snake.cells[i].y) {
                resetSnake();
                return;
            }
        }
    }

    function resetSnake() {
        snakeGameRunning = false;
        alert('Game Over! Score: ' + score + '\nRefresh or close to try again.');
        closeSnake();
    }

    // Keyboard controls (prevent default to avoid page scroll)
    document.addEventListener('keydown', function(e) {
        if (!snakeGameRunning) return;
        if (e.which === 37 && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; e.preventDefault(); } // left
        else if (e.which === 38 && snake.dy === 0) { snake.dx = 0; snake.dy = -grid; e.preventDefault(); } // up
        else if (e.which === 39 && snake.dx === 0) { snake.dx = grid; snake.dy = 0; e.preventDefault(); } // right
        else if (e.which === 40 && snake.dy === 0) { snake.dx = 0; snake.dy = grid; e.preventDefault(); } // down
    });

    // Start loop
    requestAnimationFrame(loop);

    // Reset position/score on start
    score = 0;
    document.getElementById('snake-score').textContent = 'Score: 0';
}

function closeSnake() {
    snakeGameRunning = false;
    document.getElementById('snake-overlay').style.display = 'none';
}
