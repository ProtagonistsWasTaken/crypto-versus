// run "npm test" to run this file

// import the server
const app = require("./index")

// import various dependencies
const assert = require('assert');
let chaiHttp = require('chai-http');
const chai = require("chai")
let should = chai.should();
chai.use(chaiHttp)

// test routes
describe ("Routes", function() {
    describe('GET /index', function() {
        it('should return 200 status code', function(done) {
            chai.request(app)
                .get('/index')
                .end(function(err, res) {
                    res.should.have.status(200)
                    done()
            })
        });
    });

    describe('POST /login (with no data)', function() {
        it('should return 400 status code', function(done) {
            chai.request(app)
                .post('/login')
                .end(function(err, res) {
                    res.should.have.status(400)
                    done()
                })
        });
    });
    describe("GET /signup (wrong method)", function () {
        it("should return a 405 status code", function (done) {
            chai.request(app)
                .get("/signup")
                .end(function(err, res) {
                    res.should.have.status(405)
                    done()
                })
        })
    })
})

// test MongoDB
describe ("MongoDB", function() {
      describe("GET /signup (wrong method)", function () {
        it("should return a 405 status code", function (done) {
            chai.request(app)
                .get("/signup")
                .end(function(err, res) {
                    res.should.have.status(405)
                    done()
                })
        })
    })
})
