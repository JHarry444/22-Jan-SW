const router = require("express").Router();
const Person = require("../db");

router.get("/getAll", (req, res, next) => {
    // Person.find().then((results) =>  {
    //     return res.json(results);
    // }).catch(err => next({status: 400, message: err.message}));
    Person.find((err, people) => {
        if (err)
            return next({status: 400, message: err.message});
        else 
            return res.json(people);
    })

});

// {"age": 27, "name": "Jordan"}

router.get("/find", ({query}, res, next) => {
    Person.find(query, (err, people) => {
        if (err)
            return next({status: 400, message: err.message});
        else
            return res.json(people);
    })
})

router.get("/get/:id", ({params: {id}}, res, next) => {
    Person.findById(id, (err, found) => {
        if (err)
            return next({status: 400, message: err.message});
        else if (!found)
            return next({ status: 404, message: "No person found with id: " + id });
        else
            return res.send(found);
    });
})

router.post("/create", ({body: person}, res, next) => {    
    new Person(person).save()
        .then(() => res.status(201).send("Successfully created"))
        .catch(err => next({status: 400, message: err.message}));
});

router.put("/replace/:id", ({query: newPerson, params: {id}}, res) => {    
    Person.findByIdAndUpdate(id, newPerson, (err, replaced) => {
        if (err)
            return next({status: 400, message: err.message});
        else 
            Person.findById(id, (err, updatedPerson) => {
                if (err)
                    return next({status: 400, message: err.message});
                else
                    return res.status(202).send(updatedPerson);
            });
    })
   
});

router.delete("/remove/:id", ({params: {id}}, res) => {
    Person.findByIdAndDelete(id, (err) => {
        if (err)
            return next({status: 400, message: err.message});
        else
            return res.sendStatus(204);
    })
});


module.exports = router;