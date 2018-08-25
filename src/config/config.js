const environment = require('dotenv').config({path: `${require('app-root-path').path}/.env`}).parsed;


module.exports = {
    database: {
        username: environment.DB_USER || 'root',
        password: environment.DB_PASS || 'root',
        database: environment.DB_NAME || 'local_db',
        dialect: environment.SEQUELIZE_DIALECT || 'sqlite',
        options: {
            host: environment.DB_HOST || 'localhost',
            port: environment.DB_PORT || '3306',
            pool: {
                max: environment.DB_POOL_MAX_CONNECTIONS || 5,
                min: environment.DB_POOL_MIN_CONNECTIONS || 0,
                acquire: environment.DB_POOL_ACQUIRE_TIME || 30000,
                idle: environment.DB_POOL_IDLE_TIME || 10000
            }
        }
    },
    security: {
        jwt: {
            jwtSecret: environment.SECURITY_JWT_SECRET || "localdevsecret",
            algorithms: environment.SECURITY_JWT_ALGORITHM ? [environment.SECURITY_JWT_ALGORITHM] : ['HS256'],
            accessTokenDuration: environment.SECURITY_JWT_ACCESS_TOKEN || '15m',
            refreshTokenDuration: environment.SECURITY_JWT_REFRESH_TOKEN || '7d'
        },
    },
    port: environment.PORT | 8080
};