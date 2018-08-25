const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);
const Sequelize = require('sequelize');
const config = require('../../config/config');
const db = {};

const sequelize = new Sequelize(
    config.database.database,
    config.database.username,
    config.database.password,
    config.database.options
);

function modelNameToUppercase(model) {
    return model.name.charAt(0).toUpperCase() + model.name.slice(1)
}

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js')
    })
    .forEach(file => {
        const model = sequelize.import(path.join(__dirname, file));
        db[modelNameToUppercase(model)] = model;
    });

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;