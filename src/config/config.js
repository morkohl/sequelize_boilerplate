const config = process.env;

module.exports = {
    database: {
        username: config.DB_USER | 'root',
        password: config.DB_PASS | 'root',
        database: config.DB_NAME | 'local_db',
        options: {
            dialect: config.SEQUELIZE_DIALECT | 'sqlite',
            host: config.DB_HOST | 'localhost',
            port: config.DB_PORT | '3306',
            pool: {
                max: config.DB_POOL_MAX_CONNECTIONS | 5,
                min: config.DB_POOL_MIN_CONNECTIONS | 0,
                acquire: config.DB_POOL_ACQUIRE_TIME | 30000,
                idle: config.DB_POOL_IDLE_TIME | 10000
            }
        }
    },
    security: {
        jwt: {
            jwtSecret: config.SECURITY_JWT_SECRET | "localdevsecret",
            algorithms: config.SECURITY_JWT_ALGORITHM ? [config.SECURITY_JWT_ALGORITHM] : ['HS256'],
            accessTokenDuration: config.SECURITY_JWT_ACCESS_TOKEN | '15m',
            refreshTokenDuration: config.SECURITY_JWT_REFRESH_TOKEN | '7d'
        },

    }
};