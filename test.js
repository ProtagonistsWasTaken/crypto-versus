const app = require("./index")

const assert = require('assert');
let chaiHttp = require('chai-http');
const chai = require("chai")
chai.use(chaiHttp)

let should = chai.should();
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

    describe('GET /login (with no data)', function() {
        it('should return 405 status code', function(done) {
            chai.request(app)
                .get('/login')
                .end(function(err, res) {
                    res.should.have.status(405)
                    done()
                })
        });
    });
    describe("POST /signup (wrong method)", function () {
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
