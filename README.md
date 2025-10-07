# Snake Game JS

This project is a modern take on the classic Snake game built with plain JavaScript, HTML, and CSS.

## Run the game locally

The game is a static site, so you only need a simple HTTP server to play it in your browser.

1. **Clone the repository**

   ```bash
   git clone https://github.com/Imperfectwow/snakeJS.git
   cd snakeJS
   ```

2. **Install dependencies (optional but recommended for running tests)**

   ```bash
   npm install
   ```

3. **Start a static server**

   You can use [`http-server`](https://www.npmjs.com/package/http-server) via `npx` so you do not need to install it globally:

   ```bash
   npx http-server . -p 8080
   ```

   This launches the site at <http://localhost:8080>. Open that URL in your browser to play the game.

> **Tip:** If you prefer a global install, run `npm install --global http-server` once, then start the game with `http-server -p 8080`.

## Run with Docker

If you have Docker installed, you can use the prebuilt image instead of running Node.js locally.

1. Pull the image:

   ```bash
   docker pull 3242executer/snakejs
   ```

2. Run the container:

   ```bash
   docker run -d -p 8080:80 3242executer/snakejs
   ```

   Visit <http://localhost:8080> to play.

3. Stop the container when you are done:

   ```bash
   docker ps
   docker stop <container_id>
   ```

## Running tests

Jest is configured for the project. After installing dependencies, run:

```bash
npm test
```

Enjoy playing Snake!
