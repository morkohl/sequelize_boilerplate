module.exports = {
    database: {
        username: 'root',
        password: 'Unterhose2',
        database: 'testsequelize',
        options: {
            dialect: 'mysql',
            host: 'localhost',
            port: '3306',
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        }

    },
};