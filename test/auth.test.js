const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../src/app');

const expect = chai.expect;

chai.use(chaiHttp);

describe('auth test', () => {
   it('should test', () => {
       expect(true).to.equal(true);
   })
});