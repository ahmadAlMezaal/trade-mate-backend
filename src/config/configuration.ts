import * as dotenv from 'dotenv';
const AWS = require('aws-sdk');

export const loadSecrets = async () => {
    const secretName = "book-trader-backend";
    dotenv.config();
    const input = {
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_SECRET,
    }
    const client = new AWS.SecretsManager(input);
    try {
        let secrets: any;
        const data = await client.getSecretValue({ SecretId: secretName }).promise();
        if ('SecretString' in data) {
            secrets = JSON.parse(data.SecretString);
        } else {
            const decodedBinarySecret = Buffer.from(data.SecretBinary, 'base64');
            secrets = decodedBinarySecret;
        }
        for (const [key, value] of Object.entries(secrets)) {
            (process.env[key] as any) = value;
        }
    } catch (error) {
        //? For a list of exceptions thrown, see:  https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }
}

export const configuration = () => {
    return {
        port: process.env.PORT,
        database: {
            MONGODB_URI: process.env.MONO_DB_CONNECTION_STRING
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            expiration: process.env.JWT_EXPIRATION
        }
    }
}

