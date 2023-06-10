pipeline {
    agent any

    stages {
        stage('Clear Cache and Install Dependencies') {
            steps {
                sh 'yarn cache clean'
                sh 'yarn install'
            }
        }
        stage('Run') {
            steps {
                script {
                    def processExists = sh(script: 'pm2 id book-trader-backend', returnStdout: true).trim().isNumber()
                    if (processExists) {
                        sh 'pm2 restart book-trader-backend'
                    } else {
                        sh 'pm2 start "yarn start:dev" --name "book-trader-backend" --interpreter bash'
                    }
                }
            }
        }
        
        stage('Testing the App') {
            steps {
                sh 'curl http://localhost:3000/health'
            }
        }

       stage('Deploy') {
        steps {
            withCredentials([sshUserPrivateKey(credentialsId: 'AWS_INSTANCE_SSH', keyFileVariable: 'SSH_KEY')]) {
                sh """
                    ssh -i ${SSH_KEY} ubuntu@35.170.191.71 'cd book-trader-backend/ && git pull && yarn install && pm2 restart book-trader-backend'
                """
                }
            }
        }
    }
}
