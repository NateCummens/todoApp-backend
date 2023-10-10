"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
let expect = chai.expect;
let chaiHttp = require("chai-http");
chai.use(chaiHttp);
let server = require("../app");
describe("/Post Task", () => {
    it("it post a new Tasks", (done) => {
        const task = {
            "_id": "651b49fc91fc797ce2590098",
            "content": "this is a testing app",
            "completed": true
        };
        chai.request(server)
            .post('/')
            .type('json')
            .send(task)
            .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body.status).to.equal('Task Created');
            done();
        });
    });
    it("/Get returns a single task with the id", (done) => {
        const id = "651b49fc91fc797ce2590098";
        chai.request(server)
            .get('/' + id)
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('object');
            done();
        });
    });
});
describe("/Get Task", () => {
    it("it should Get all the Tasks", (done) => {
        chai.request(server)
            .get('/')
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            done();
        });
    });
    it("it should Get all completed Tasks", (done) => {
        chai.request(server)
            .get('/completed')
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            done();
        });
    });
    it("it should Get all pending Tasks", (done) => {
        chai.request(server)
            .get('/pending')
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            done();
        });
    });
    it("it should Get amount of the Tasks", (done) => {
        chai.request(server)
            .get('/count')
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            expect(res.body[0].tasks).to.be.a('number');
            done();
        });
    });
    it("it should Get all Tasks organized by date", (done) => {
        chai.request(server)
            .get('/bydate')
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a('array');
            expect(res.body[0]).to.be.a('object');
            expect(res.body[0]._id).to.be.a('string');
            expect(res.body[0].count).to.be.a('number');
            expect(res.body[0].tasks).to.be.a('array');
            done();
        });
    });
});
describe("/patch Task", () => {
    it("it patches a Task with new content", (done) => {
        const id = "651b49fc91fc797ce2590098";
        const task = {
            "content": "this is an updated testing task"
        };
        chai.request(server)
            .patch('/' + id)
            .type('json')
            .send(task)
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('task updated');
            done();
        });
    });
});
describe("/delete Task", () => {
    const id = "651b49fc91fc797ce2590098";
    it("it delete a task the Tasks", (done) => {
        chai.request(server)
            .delete('/' + id)
            .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.status).to.equal('Task Deleted');
            done();
        });
    });
    it("it should return a 404 with no task found", (done) => {
        chai.request(server)
            .delete('/' + id)
            .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.status).to.equal('no task found');
            done();
        });
    });
    it("/Get returns a single task with the id", (done) => {
        const id = "651b49fc91fc797ce2590098";
        chai.request(server)
            .get('/' + id)
            .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.status).to.equal('no task found');
            done();
        });
    });
});
