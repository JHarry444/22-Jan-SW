console.log('Hello, World!');

const express = require('express');
const parser = require('body-parser');

const app = express();

// every req we receive will first pass through this function and convert the body into json
app.use(parser.json());

const cows = require('./cows');
const personRoutes = require('./routes/personRoutes');

app.use((err, req, res, next) => { // never called as there's been no error at this point
  console.log('bloop');
  return next();
});

app.use((req, res, next) => {
  console.log(req.method, req.url, new Date());
  return next(); // next -> app.post(...)
});

app.get('/', (request, response) => {
  response.send(cows.speak('Mooooooo'));
});

app.use('/person', personRoutes);

app.use('*', (req, res, next) => next({ status: 404, message: 'Invalid URL' }));

// never gonna get hit due to response being sent
// eslint-disable-next-line no-unused-vars
app.use((req, res, next) => {
  console.log('Never gonna give you up');
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status).send(err.message);
});

const server = app.listen(4494, () => {
  console.log('Server successfully started on port', server.address().port);
});

module.exports = server;
