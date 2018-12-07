const db = require('../src/api/models');
const chai = require('chai');
const chaiHttp = require('chai-http');
const httpStatus = require('http-status');
const server = require('../src/server');
const {
    authHeader,
    authHeaderValue,
    testUserData,
    faultyTestUserData
} = require('./util');

const expect = chai.expect;

chai.use(chaiHttp);

const testData = testUserData();

describe('task test', () => {
    let user;
    let authTokens;

    beforeEach(done => {
        db.User.create(testData.user).then(createdUser => {
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

    describe('POST /user/:id/task', () => {
        it('should create a new task', () => {
            return chai.request(server)
                .post(`/api/v1/user/${user.id}/task`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .send({task: testData.task})
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.CREATED);
                    expect(res.body.data.id).to.be.at.least(0);
                    expect(res.body.data.taskName).to.equal(testData.task.taskName);
                    expect(res.body.data.userId).to.equal(`${user.id}`);
                    expect(res.body.data.taskStatus).to.equal('active');
                    expect(res.body.data.currentTaskPoints).to.equal(testData.task.currentTaskPoints);
                    expect(res.body.data.maximumTaskPoints).to.equal(testData.task.maximumTaskPoints)
                })
        });

        it('should not create a task for a user that does not exist', () => {
            return chai.request(server)
                .post('/api/v1/user/01203012301023/task')
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .send({task: testData.task})
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.UNPROCESSABLE_ENTITY);
                })
        });
    });

    describe('GET /user/:id/task/', () => {
        it('should get all tasks', () => {
            const tasks = [
                {...testUserData().task},
                {...testUserData().task},
                {...testUserData().task}
            ].map(task => {
                task.userId = user.id;
                return task
            });

            return db.Task.bulkCreate(tasks).then(() => {
                return db.Task.findAll().then(() => {
                    return chai.request(server)
                        .get(`/api/v1/user/${user.id}/task`)
                        .set(authHeader, authHeaderValue(authTokens.accessToken))
                        .then(res => {
                            expect(res).to.be.json;
                            expect(res).to.have.status(httpStatus.OK);
                            expect(res.body.data).to.be.an('array');
                            expect(res.body.data.length).to.equal(tasks.length);
                        })
                })
            })
        });

        it('should return no content if no tasks exist', () => {
            return chai.request(server)
                .get(`/api/v1/user/${user.id}/task/`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .then(res => {
                    expect(res).to.have.status(httpStatus.NO_CONTENT)
                })
        });
    });

    describe('GET /user/:id/task/:id', () => {
        let task;

        beforeEach(done => {
            db.Task.create({
                ...testData.task,
                userId: user.id
            }).then(createdTask => {
                task = createdTask;
                done();
            });
        });

        it('should get a task', () => {
            return chai.request(server)
                .get(`/api/v1/user/${user.id}/task/${task.id}`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.OK);
                    expect(res.body.data.userId).to.equal(task.userId);
                    expect(res.body.data.id).to.not.be.undefined;
                    expect(res.body.data.id).to.be.at.least(0);
                    expect(res.body.data.taskName).to.equal(task.taskName);
                    expect(res.body.data.currentTaskPoints).to.equal(task.currentTaskPoints);
                    expect(res.body.data.maximumTaskPoints).to.equal(task.maximumTaskPoints);
                    expect(res.body.data.taskStatus).to.equal('active');
                });
        });

        it('should not get a task for a non existant user', () => {
            return chai.request(server)
                .get(`/api/v1/user/1231723712737123/task/${task.id}`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .then(res => {
                    expect(res).to.have.status(httpStatus.NO_CONTENT);
                })
        });

        it('should throw an error if no params supplied', () => {
            return chai.request(server)
                .get(`/api/v1/user//task/`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.BAD_REQUEST)
                })
        });
    });

    describe('PUT /user/:id/task/:id', () => {
        let task;

        let update = { task: testUserData().task };
        let invalidUpdate = { task: faultyTestUserData().task };

        beforeEach(done => {
            db.Task.create({
                ...testData.task,
                userId: user.id
            }).then(createdTask => {
                task = createdTask;
                done();
            });
        });

        it('should update a task', () => {
            return chai.request(server)
                .put(`/api/v1/user/${user.id}/task/${task.id}`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .send(update)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.OK);
                    expect(res.body.data).to.include(update.task);
                })
        });

        it('should not update a task on a validation error', () => {
            return chai.request(server)
                .put(`/api/v1/user/${user.id}/task/${task.id}`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .send(invalidUpdate)
                .then(res => {
                    expect(res).to.be.json;
                    expect(res).to.have.status(httpStatus.UNPROCESSABLE_ENTITY);
                })

        });

        it('should if user does not exist', () => {
            return chai.request(server)
                .put(`/api/v1/user/${user.id}/task/123912931923`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .send(update)
                .then(res => {
                    expect(res).to.have.status(httpStatus.NO_CONTENT);
                })
        });

        it('should not update a task for a user that does not exist', () => {
            return chai.request(server)
                .put(`/api/v1/user/10238182381823/task/${task.id}`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .send(update)
                .then(res => {
                    expect(res).to.have.status(httpStatus.NO_CONTENT);
                })
        });

    });

    describe('DELETE /user/:id/task/:id', () => {
        let task;

        beforeEach(done => {
            db.Task.create({
                ...testData.task,
                userId: user.id
            }).then(createdTask => {
                task = createdTask;
                done();
            });
        });

        it('should delete a task', () => {
            return chai.request(server)
                .delete(`/api/v1/user/${user.id}/task/${task.id}`)
                .set(authHeader, authHeaderValue(authTokens.accessToken))
                .then(res => {
                    expect(res).to.have.status(httpStatus.NO_CONTENT);
                })
        })
    })
});