const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const db = require('../src/api/models');
const server = require('../src/server');
const tknConfig = require('../src/config').security.jwt.accessToken;

const expect = chai.expect;

chai.use(chaiHttp);

describe('auth test', () => {
    const userData = {
        username: 'John-Doe_10',
        email: 'john.doe@mail-provider.com',
        password: 'secretPassword12345#'
    };

    let user;

    beforeEach(done => {
        db.User.create(userData).then(createdUser => {
            user = createdUser;
            done();
        });
    });

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
        const register = {
            user: {
                username: 'Random_Username_10',
                email: 'random_guy@mail-provider.gov',
                password: 'verySecretPassword12?'
            }
        };

        it('should register a new user', () => {
            return chai.request(server)
                .post('/api/v1/auth/register')
                .send(register)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.CREATED);
                    expect(res.body.data.username).to.equal(register.user.username);
                    expect(res.body.data.email).to.equal(register.user.email);
                    expect(res.body.data.id).to.be.at.least(0);
                });
        });
    });

    describe('POST /login', () => {
        const login = {
            user: {
                email: 'john.doe@mail-provider.com',
                password: 'secretPassword12345#'
            }
        };

        it('should log in a user with their credentials', () => {
            return chai.request(server)
                .post('/api/v1/auth/login')
                .send(login)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.CREATED);
                    expect(res.body.data).to.have.property('refreshToken');
                    expect(res.body.data).to.have.property('accessToken');
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
            incorrectLogin.user.password = 'incorrectPassword123#';

            return chai.request(server)
                .post('/api/v1/auth/login')
                .send(incorrectLogin)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.UNAUTHORIZED);
                    expect(res.body.error.message).to.equal('Invalid password');
                });
        });
    });

    describe('/GET logout', () => {
        let authTokens;

        beforeEach(done => {
            db.RefreshToken.createTokenPair(user)
                .then(tokens => {
                    authTokens = tokens;
                    done();
                })
        });

        it('should log out a user ', () => {
            return chai.request(server)
                .get('/api/v1/auth/logout')
                .set(tknConfig.extract.header, [tknConfig.extract.prefix, authTokens.accessToken].join(' '))
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.OK);
                    return db.RefreshToken.findAll().then(refreshTokens => {
                        refreshTokens.forEach(refreshToken => {
                            expect(refreshToken.valid).to.equal(false);
                        })
                    })
                })
        });

        it('should not log out a user with a faulty access token', () => {
            return chai.request(server)
                .get('/api/v1/auth/logout')
                .set(tknConfig.extract.header, [tknConfig.extract.prefix, 'an.incorrect.accessToken'].join(' '))
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.UNAUTHORIZED);
                })
        });
    });

    describe('/GET refresh', () => {
        let refreshToken;

        beforeEach(done => {
            db.RefreshToken.createTokenPair(user)
                .then(tokens => {
                    refreshToken = tokens.refreshToken;
                    done()
                })
        });

        it('should create a new access token from a valid refresh token', () => {
            return chai.request(server)
                .post('/api/v1/auth/refresh')
                .send({refreshToken: refreshToken})
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.CREATED);
                    expect(res.body.data).to.have.property('accessToken');
                    expect(res.body.data.accessToken).to.be.a.string;
                })
        });

        it('should not create a new access token if the refresh token wasn\'t found', () => {
            return chai.request(server)
                .post('/api/v1/auth/refresh')
                .send({refreshToken: 'afaultyrefreshtoken'})
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.UNAUTHORIZED);
                    expect(res.body.error.message).to.equal('Unknown refresh token');
                })
        });

        describe('invalid refresh token', () => {
            beforeEach(done => {
                db.RefreshToken.update({
                        valid: false
                    },
                    {
                        where: {
                            userId: user.id
                        }
                    })
                    .then(() => done());
            });

            it('should not create a new access token if the refreshToken is invalid', () => {
                chai.request(server)
                    .post('/api/v1/auth/refresh')
                    .send({refreshToken: refreshToken})
                    .then(res => {
                        expect(res).to.be.json;
                        expect(res).to.have.status(httpStatus.UNAUTHORIZED);
                        expect(res.body.error.message).to.equal('Invalid refresh token');
                    })
            });
        });
    });
});