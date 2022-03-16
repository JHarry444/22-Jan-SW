console.log("Hello, World!");

const express =require("express");
const parser = require("body-parser");

const app = express();

app.use(parser.json()); // every req we receive will first pass through this function and convert the body into json

const cows = require("./cows");

const data = [];

app.get("/", (request, response) => {
    response.send(cows.speak("Mooooooo"));
});

app.get("/getAll", (req, res) => res.json(data));

app.get("/get/:id", (req, res) => {
    const id = req.params.id;

    res.json(data[id]);
})

app.post("/create", (req, res) => {
    const person = req.body;
    data.push(person);
    res.status(201).send("Successfully created");
});

app.put("/replace/:id", (req, res) => {
    const newPerson = req.query;
    const id = req.params.id;
    
    data.splice(id, 1, newPerson);
    res.status(202).json(data[id]);
});


const server = app.listen(4494, () => {
     console.log("Server successfully started on port", server.address().port);
});