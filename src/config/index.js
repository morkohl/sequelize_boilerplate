let environment = {};

if(process.env.NODE_ENV === 'PROD') {
    environment = require('dotenv').config({path: `${require('app-root-path').path}/.env`}).parsed
}

module.exports = {
    database: {
        username: environment.DB_USER || 'root',
        password: environment.DB_PASS || 'root',
        database: environment.DB_NAME || 'local_db',
        options: {
            dialect: environment.SEQUELIZE_DIALECT || 'sqlite',
            host: environment.DB_HOST || 'localhost',
            port: environment.DB_PORT || '3306',
            pool: {
                max: environment.DB_POOL_MAX_CONNECTIONS || 5,
                min: environment.DB_POOL_MIN_CONNECTIONS || 0,
                acquire: environment.DB_POOL_ACQUIRE_TIME || 30000,
                idle: environment.DB_POOL_IDLE_TIME || 10000
            },
            logging: environment.DB_LOGGING || true,
        }
    },
    security: {
        jwt: {
            accessToken: {
                sign: {
                    expiresIn: environment.SECURITY_JWT_ACCESS_TOKEN || '15m'
                },
                verify: {
                    algorithms: environment.SECURITY_JWT_ALGORITHM ? [environment.SECURITY_JWT_ALGORITHM] : ['HS256'],
                },
                extract: {
                    header: environment.SECURITY_JWT_HEADER || 'X-Access-Token',
                    prefix: environment.SECURITY_JWT_PREFIX || 'Bearer'
                },
                secret: environment.SECURITY_JWT_SECRET || "localdevsecret",
            },
        },
        refreshToken: {
            tokenLength: environment.SECURITY_REFRESH_TOKEN_LENGTH || 256
        }

    },
    port: environment.PORT || 8080
};