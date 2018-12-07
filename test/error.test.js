const {convertError} = require('../src/api/middleware/error.middleware');
const db = require('../src/api/models');
const chai = require('chai');

const expect = chai.expect;

describe('Error test', () => {
    describe('Throw a SequelizeValidationError occurs', () => {
        it('should throw a Sequelize ValidationError and convert it to http status 422', () => {
            return db.sequelize.sync().then(() => {
                return db.User.create({
                    username: 'testUser',
                    email: 'usermail@mail.com',
                    password: 'secretPassword123!#'
                }).then(user => {
                    return db.Task.create({
                        userId: user.id,
                        taskName: 'get milk',
                        currentTaskPoints: '5',
                        maximumTaskPoints: '0'
                    });
                })
            }).catch(err => {
                const convertedError = convertError(err);
                expect(convertedError.stack).to.include('ValidationError');
                expect(convertedError.status).to.equal(422); //unprocessable entity
                expect(convertedError.message).to.be.empty
            })
        });
    })
});
