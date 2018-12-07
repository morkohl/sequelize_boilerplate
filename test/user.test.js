const db = require('../src/api/models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const server = require('../src/server');
const {
    authHeader,
    authHeaderValue
} = require('./util');


const expect = chai.expect;

chai.use(chaiHttp);

describe('user test', () => {
    const userData = {
        username: 'John-Doe_10',
        email: 'john.doe10@mail-provider.com',
        password: 'secretPassword12345#'
    };

    let user;
    let authTokens;

    beforeEach(done => {
        db.User.create(userData).then(createdUser => {
            user = createdUser;
            return db.RefreshToken.createTokenPair(user)
                .then(tokens => {
                    authTokens = tokens;
                    done();
                })
        }).catch(done);
    });

    afterEach(done => {
        const models = Object.values(db.sequelize.models);
        models.forEach(model => {
            model.destroy({truncate: true}).then(() => {
                if (models.indexOf(model) === models.length - 1) {
                    done();
                }
            }).catch(done)
        });
    });

    describe('GET /user', () => {
        const anotherUsersData = {
            username: 'John-Doe_11',
            email: 'john.doe11@mail-provider.com',
            password: 'secretPassword12345#'
        };

        let anotherUser;

        beforeEach(done => {
            db.User.create(anotherUsersData).then(createdUser => {
                anotherUser = createdUser;
                done();
            }).catch(done);
        });

        it('should get all users', () => {
            return chai.request(server)
                .get('/api/v1/user')
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.OK);
                    expect(res.body.data).to.be.an('array').that.is.not.empty;
                    expect(res.body.data.length).to.equal(2);
                    expect(res.body.data[0].username).to.equal(user.username);
                    expect(res.body.data[0].email).to.equal(user.email);
                    expect(res.body.data[1].username).to.equal(anotherUser.username);
                    expect(res.body.data[1].email).to.equal(anotherUser.email);
                })
        });
    });

    describe('GET /user/:id', () => {
        it('should get a user for their id', () => {
            return chai.request(server)
                .get(`/api/v1/user/${user.id}`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.OK);
                    expect(res.body.data.email).to.equal(user.email);
                    expect(res.body.data.username).to.equal(user.username);
                })
        });
        it('should send 204 if no user was found', () => {
            return chai.request(server)
                .get('/api/v1/user/9191919191919199191919199191')
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .then(res => {
                    expect(res).to.have.status(httpStatus.NO_CONTENT);
                })
        });
        it('should send 400 if the id is invalid', () => {
            return chai.request(server)
                .get('/api/v1/user/-1')
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.BAD_REQUEST);
                })
        });
    });

    describe('PUT /user/:id', () => {
        const update = {
            user: {
                username: 'John-Doe1337',
                email: 'john-doe1337@mail-provider.com'
            }
        };

        it('should update a user', () => {
            return chai.request(server)
                .put(`/api/v1/user/${user.id}`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .send(update)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.OK);
                    expect(res.body.data.username).to.equal(update.user.username);
                    expect(res.body.data.email).to.equal(update.user.email);
                })
        });
        it('should return 204 if no user was updated', () => {
            return chai.request(server)
                .put('/api/v1/user/919119919111')
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .send(update)
                .then(res => {
                    expect(res).to.have.status(httpStatus.NO_CONTENT);
                })
        });
        it('should send 400 if the id is invalid', () => {
            return chai.request(server)
                .put('/api/v1/user/-1')
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .send(update)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.BAD_REQUEST);
                })
        });

    });
});