/* eslint-disable no-unused-expressions */
const { expect } = require('chai');
const chai = require('chai'); // importing the chai library
const chaiHttp = require('chai-http'); // importing the http plugin

chai.use(chaiHttp); // adding the plugin to the library
const { it, describe, beforeEach } = require('mocha');

const server = require('../index');

const Person = require('../db');

describe('Test Person', () => {
  let testPerson;

  beforeEach((done) => {
    Person.deleteMany((err) => {
      if (!err) {
        Person.create({
          name: 'Bob',
          age: 40,
          jobTitle: 'Builder',
        }, (error, created) => {
          if (!error) {
            testPerson = created;
          }
          return done();
        });
      }
    });
  });

  it('Should create a person', (done) => {
    chai.request(server).post('/person/create').send({
      name: 'Jordan',
      age: 27,
      jobTitle: 'Trainer',
    }).end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(201);
      expect(res).to.haveOwnProperty('text', 'Successfully created');
      return done(); // ends the test
    });
  });

  it('Should NOT create a person', (done) => {
    chai.request(server).post('/person/create').send().end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(400);
      expect(res).to.haveOwnProperty('text', 'Person validation failed: jobTitle: Path `jobTitle` is required., age: Path `age` is required., name: Path `name` is required.');
      return done();
    });
  });

  it('Should find a Person', (done) => {
    chai.request(server).get(`/person/get/${testPerson.id}`).end((err, res) => {
      expect(err).to.be.null;
      expect(res).to.have.status(200);
      expect(res.body).to.haveOwnProperty('name', 'Bob');
      expect(res.body).to.haveOwnProperty('age', 40);
      expect(res.body).to.haveOwnProperty('jobTitle', 'Builder');
      return done();
    });
  });
});
