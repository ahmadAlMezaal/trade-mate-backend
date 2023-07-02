import * as dotenv from 'dotenv';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";


const fetchSecrets = async () => {
    const secretsManager = new SecretsManagerClient(
        {
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
            }
        }
    );
    const command = new GetSecretValueCommand({ SecretId: process.env.AWS_SECRETS_ARN });
    const response = await secretsManager.send(command);
    return { ...JSON.parse(response.SecretString) }
};

export const loadSecrets = async () => {
    dotenv.config();
    try {
        // const secrets = await fetchSecrets();
        const secrets = {
            MONO_DB_CONNECTION_STRING: 'mongodb+srv://ahmadhmazaal:pCuiz9E88gGhPaY@books-db.ymmjdn3.mongodb.net/?retryWrites=true&w=majority',
            DATABASE: 'Books-db',
            JWT_SECRET: 'asdfksfgksdfdkmgewrkmkwlewasdfsdgjdffjpofd423423423kprfsdg4395234ef:ashfdehrghe2343ry34rersa_123hsdf$£!@&$£!@$%!£SADASHDIADHFDFadmkfksfdg',
            JWT_EXPIRATION: '1d',
            BOOK_TRADER_IDENTIFIER: 'c2d9eae0-187f-4d94-8d65-45ee36adceca',
            PORT: '3000',
            GOOGLE_API_KEY: 'AIzaSyBRX1_dCToBhGuKEFVfs3_Ap26kZIrZD4s'
        };
        for (const [key, value] of Object.entries(secrets)) {
            (process.env[key] as any) = value;
        }
    } catch (error) {
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
        },
        aws: {
            region: process.env.AWS_REGION,
            keyId: process.env.AWS_ACCESS_KEY_ID,
            secret: process.env.AWS_SECRET_ACCESS_KEY,
            bucketName: process.env.AWS_BUCKET_NAME,
        }
    }
}

