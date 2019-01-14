process.env.NODE_ENV = 'test';

const chai = require('chai');
const chaiHtpp = require('chai-http');
const app = require('../app');
const CONFIG = require('../config');
const StudentModel = require('../models/student');

chai.should();
chai.use(chaiHtpp);

describe('Students', () => {

    beforeEach(done => {
        StudentModel.remove({}, err=>{
            done();
        });
    });

    describe('/GET with unauthorized access', () => {
        it('it should return unauthorized', done => {
            chai.request(app)
                .get('/students')
                .end((error, response)=> {
                    response.should.have.status(401);
                    done();
                });
        });
    });

    describe('/GET students', () => {
        it('it should return students', done => {
            chai.request(app)
                .get('/students')
                .set('token', CONFIG.TOKEN_TEST)
                .end((error, response)=> {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                    response.body.length.should.be.eql(0);
                    done();
                });
        });
    });
});
