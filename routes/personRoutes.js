const router = require('express').Router();
const Person = require('../db');

router.get('/getAll', async (req, res, next) => {
  try {
    const people = await Person.find();
    return res.json(people);
  } catch (err) {
    return next({ status: 400, message: err.message });
  }
});

// {"age": 27, "name": "Jordan"}

router.get('/find', ({ query }, res, next) => {
  Person.find(query, (err, people) => {
    if (err) return next({ status: 400, message: err.message });
    return res.json(people);
  });
});

router.get('/get/:id', async ({ params: { id } }, res, next) => {
  try {
    const found = await Person.findById(id);
    if (!found) return next({ status: 404, message: `No person found with id: ${id}` });
    return res.send(found);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
});

router.post('/create', ({ body: person }, res, next) => {
  new Person(person).save()
    .then(() => res.status(201).send('Successfully created'))
    .catch((err) => next({ status: 400, message: err.message }));
});

router.put('/replace/:id', async ({ query: newPerson, params: { id } }, res, next) => {
  try {
    await Person.findByIdAndUpdate(id, newPerson);
    const updatedPerson = await Person.findById(id);
    return res.status(202).send(updatedPerson);
  } catch (error) {
    return next({ status: 400, message: error.message });
  }
});

router.delete('/remove/:id', ({ params: { id } }, res, next) => {
  Person.findByIdAndDelete(id, (err) => {
    if (err) return next({ status: 400, message: err.message });
    return res.sendStatus(204);
  });
});

module.exports = router;
