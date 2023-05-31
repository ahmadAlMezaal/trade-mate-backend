module.exports = {
    apps: [
        {
            name: 'book-trader-backend',
            script: './start.sh',
            interpreter: 'bash',
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'development',
            },
            autorestart: true,
            watch: true,
            ignore_watch: ['node_modules', 'dist', 'src/schema.gql']
        }
    ],
};