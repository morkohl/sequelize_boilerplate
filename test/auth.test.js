const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const db = require('../src/api/models');
const server = require('../src/server');
const config = require('../src/config');

const expect = chai.expect;

chai.use(chaiHttp);

describe('auth test', () => {
    const userBody = {
        user: {
            username: 'John-Doe_10',
            email: 'john.doe@mail-provider.com',
            password: 'secretPassword12345#'
        }
    };

    afterEach(done => {
        const models = Object.values(db.sequelize.models);
        models.forEach(model => {
            model.destroy({truncate: true}).then(() => {
                if (models.indexOf(model) === models.length - 1) {
                    done();
                }
            })
        });
    });

    describe('POST /register', () => {
        const user = userBody.user;

        it('should register a new user', () => {
            return chai.request(server)
                .post('/api/v1/auth/register')
                .send(userBody)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.CREATED);
                    expect(res.body.data.username).to.equal(user.username);
                    expect(res.body.data.email).to.equal(user.email);
                    expect(res.body.data.id).to.equal(1);
                });
        });
    });

    describe('POST /login', () => {
        const login = userBody;
        delete login.user.username;

        beforeEach(() => {
            return db.User.create(userBody.user);
        });


        it('should log in a user with their credentials', () => {
            return chai.request(server)
                .post('/api/v1/auth/login')
                .send(login)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.CREATED);
                    expect(res.body.data).to.have.property('refreshToken');
                    expect(res.headers[config.security.jwt.accessToken.extract.header.toLowerCase()]).to.satisfy(val => val !== null && val !== undefined);
                });
        });

        it('should not log in a not existing user', () => {
            const incorrectLogin = {
                user: {
                    email: 'not-john.doe@mail-provider.com',
                    password: 'secretPassword12345#'
                }
            };

            return chai.request(server)
                .post('/api/v1/auth/login')
                .send(incorrectLogin)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.UNAUTHORIZED);
                    expect(res.body.error.message).to.equal('User doesn\'t exist');
                });
        });

        it('should not log in a user with a wrong password', () => {
            const incorrectLogin = login;
            incorrectLogin.user.password = 'incorrectPasswrod123#';

            return chai.request(server)
                .post('/api/v1/auth/login')
                .send(incorrectLogin)
                .then(res => {
                    console.log(res.body);
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.UNAUTHORIZED);
                    expect(res.body.error.message).to.equal('Invalid password');
                });
        });
    });
});