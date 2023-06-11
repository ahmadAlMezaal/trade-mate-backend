pipeline {
    agent any

    stages {
        stage('Clear Cache and Install Dependencies') {
            steps {
                sh 'yarn cache clean'
                sh 'yarn install'
            }
        }

        stage('Build') {
            steps {
                sh 'yarn run build'
            }
        }
        
        stage('Run') {
            steps {
                sh 'node dist/main.js'
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
                        ssh -i ${SSH_KEY} ubuntu@44.201.190.109 'cd book-trader-backend/ && git pull && yarn install && pm2 restart book-trader-backend'
                    """
                    }
                }
            }
        }
}
