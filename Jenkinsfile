pipeline{
    agent any
    environment{
        VERCEL_TOKEN=credentials('vercel_token')
    }
    stages{
        stage('Install Dependencies'){
            steps{
                echo 'Installing dependencies..'
                bat 'npm install'
            }
        }
         stage('Build Project'){
            steps{
                echo 'Building project..'
                bat 'npm run build'
            }
        }
        stage('Build'){
            steps{
                echo 'Building..'
            }
        }
        stage('Test'){
            steps{
                echo 'Testing..'
            }
        }
        stage('Deploy'){
            steps {
                echo 'Deploying....'
                bat 'npx vercel --prod --yes --token %VERCEL_TOKEN% --name pdfchatbotfrontend'
            }
        }
    }
}