pipeline {
    agent { label 'macbookair' } // Use your worker node label
    environment {
        PATH = "/opt/homebrew/bin:${env.PATH}" // Add Homebrew bin to PATH
    }
    triggers {
        githubPush() // Trigger pipeline on push events
    }
    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out the repository...'
                sh '''
                    if [ -d "snakeJS" ]; then
                        echo "Directory snakeJS exists. Pulling the latest changes..."
                        cd snakeJS
                        git reset --hard
                        git pull origin master
                    else
                        echo "Directory snakeJS does not exist. Cloning repository..."
                        git clone git@github.com:Imperfectwow/snakeJS.git
                    fi
                '''
                script {
                    def branch = sh(
                        script: "cd snakeJS && git rev-parse --abbrev-ref HEAD",
                        returnStdout: true
                    ).trim()
                    echo "Working on branch: ${branch}"
                }
            }
        }
        stage('Build Stage') {
            steps {
                echo 'Building the project...'
                // Add any necessary build commands here
            }
        }
        stage('Test Stage') {
            steps {
                echo 'Running tests...'
                sh '''
                    cd snakeJS
                    echo "Installing dependencies..."
                    npm install
                    echo "Running JavaScript files in branches folder..."
                    for file in branches/*.js; do
                        echo "Running $file"
                        node "$file"
                    done
                '''
            }
        }
        stage('Docker Build & Push') {
            steps {
                echo 'Building Docker image...'
                withCredentials([usernamePassword(credentialsId: 'DOCKER', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh '''
                        cd snakeJS
                        docker build -t $DOCKER_USERNAME/snakejs:latest .
                        echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
                        docker push $DOCKER_USERNAME/snakejs:latest
                    '''
                }
            }
        }
        stage('Deploy Stage') {
            steps {
                echo 'Deploying the application...'
                // Add deployment commands here
            }
        }
    }
    post {
        always {
            echo 'Pipeline execution completed.'
        }
        success {
            echo 'Pipeline executed successfully.'
        }
        failure {
            echo 'Pipeline failed. Please check the logs.'
        }
    }
}
