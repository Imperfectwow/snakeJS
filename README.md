# Snake Game JS

This project is a simple implementation of the classic Snake game in JavaScript, HTML, and CSS.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You need to have Node.js installed to use `http-server`. You can download and install Node.js from [nodejs.org](https://nodejs.org/).

### Installing

First, clone the repository to your local machine:

```bash
git clone https://github.com/Imperfectwow/snakeJS.git
cd snake_game_js

Then, install the dependencies (if any):

npm install

Running the Game Locally
To run the game locally, you'll need to install http-server, a simple zero-configuration command-line static content server.

Install http-server globally via npm:

npm install -g http-server


Once installed, run the following command in the root directory of your project:

http-server

By default, http-server will start a local web server on port 8080. You can access the game by navigating to http://localhost:8080 in your web browser.

Enjoy playing the Snake game!


# SnakeJS Game - Docker Setup

## Steps to Run the Game
	1.	Pull the Docker Image:
    First, pull the latest snakejs image from Docker Hub:
    docker pull 3242executer/snakejs

##	2.	Run the Docker Container:
    After the image is pulled, run the Docker container with the following command:
    docker run -d -p 8080:80 3242executer/snakejs

    This command will:
	•	Run the 3242executer/snakejs container in detached mode (-d).
	•	Map port 8080 on your host machine to port 80 in the container.

## 3.Access the Game:
    Open your web browser and go to http://localhost:8080 to play the SnakeJS game.
    If you’re running this on a remote server, replace localhost with the server’s IP address or domain name.

##	4.Stopping the Game:
    To stop the running container, first find the container ID by running:
    docker ps
    Then, stop the container with:
    docker stop <container_id>
    Replace <container_id> with the actual ID of the container.
```
