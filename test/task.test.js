const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../src/server');
const {
    authHeader,
    authHeaderValue
} = require('./util');


const expect = chai.expect;

chai.use(chaiHttp);

describe('task test', () => {
    describe('POST /user/:id', () => {
        it('should', () => {
            return chai.request(server)
                .post()
        });
        it('should', () => {
            return chai.request(server)
                .post()
        });
        it('should', () => {
            return chai.request(server)
                .post()
        });

    });


    describe('GET /user', () => {
        it('should', () => {
            return chai.request(server)
                .get()
        });
        it('should', () => {
            return chai.request(server)
                .get()
        });
        it('should', () => {
            return chai.request(server)
                .get()
        });
    });

    describe('GET /user/:id', () => {
        it('should', () => {
            return chai.request(server)
                .get()
        });
        it('should', () => {
            return chai.request(server)
                .get()
        });
        it('should', () => {
            return chai.request(server)
                .get()
        });
    });

    describe('PUT /user/:id', () => {
        it('should', () => {
            return chai.request(server)
                .put()
        });
        it('should', () => {
            return chai.request(server)
                .put()
        });
        it('should', () => {
            return chai.request(server)
                .put()
        });

    });
});