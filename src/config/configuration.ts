const configuration = () => {
    return {
        port: process.env.PORT || 3000,
        database: {
            MONGODB_URI: process.env.MONO_DB_CONNECTION_STRING || 'mongodb://localhost/nest'
        },
        jwt: {
            secret: process.env.JWT_SECRET,
            expiration: process.env.JWT_EXPIRATION
        }
    }
}

export default configuration;
