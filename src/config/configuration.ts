import * as dotenv from 'dotenv';
dotenv.config();

console.log('process.env.MONGODB_CONNECTION_STRING: ', process.env.MONGODB_CONNECTION_STRING);

export const configuration = () => (
    {
        port: process.env.PORT,
        database: {
            mongodbUri: process.env.MONGODB_CONNECTION_STRING
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
);
