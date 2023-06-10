pipeline {
    agent any

    stages {
        stage('Fetch from GitHub') {
            steps {
                git 'https://github.com/AhmadMazaal/book-trader-backend.git'
            }
        }
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
        
        stage('Test') {
            steps {
                sh 'curl http://localhost:3000/health'
            }
        }

        // stage('Deploy') {
        //     steps {
        //         withCredentials([sshUserPrivateKey(credentialsId: 'aws', keyFileVariable: 'AWS_SSH_KEY')]) {
        //             sh """
        //                 ssh -i ${AWS_SSH_KEY} ubuntu@your_aws_ip 'bash -s' < deploy.sh
        //             """
        //         }
        //     }
        // }
    }
}
