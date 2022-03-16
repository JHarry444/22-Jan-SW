console.log("Hello, World!");

const express =require("express");
const parser = require("body-parser");

const app = express();

app.use(parser.json()); // every req we receive will first pass through this function and convert the body into json

const cows = require("./cows");

const data = [];

const bloop = (req, res, next) => {
    console.log("bloop");
    return next();
}


app.use((err, req, res, next) => { // never called as there's been no error at this point
    console.log("bloop");
    return next();
})

app.use((req, res, next) => {
    console.log(req.method, req.url, new Date())
    return next(); // next -> app.post(...)
});

app.get("/", (request, response) => {
    response.send(cows.speak("Mooooooo"));
});

app.get("/getAll", (req, res) => res.json(data));

app.get("/get/:id", (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    if (id == null || undefined || id === NaN) 
        return next({ status: 400, message: "Invalid id" });
    else if (id > data.length) 
        return next({ status: 404, message: "No person found with id " + id });
    
    res.json(data[id]);
})

app.post("/create", bloop, (req, res) => {
    const person = req.body;
    data.push(person);
    res.status(201).send("Successfully created");
});

app.put("/replace/:id", (req, res) => {
    const newPerson = req.query;
    const id = Number.parseInt(req.params.id);

    if (id === null || undefined || id === NaN) 
        return next({ status: 400, message: "Invalid id" });
    else if (id > data.length) 
        return next({ status: 404, message: "No person found with id " + id });
    
    data.splice(id, 1, newPerson);
    res.status(202).json(data[id]);
});

app.delete("/remove/:id", (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (id === null || undefined || id === NaN) 
        return next({ status: 400, message: "Invalid id" });
    else if (id > data.length) 
        return next({ status: 404, message: "No person found with id " + id });

    data.splice(id, 1);
    res.sendStatus(204);
});

app.use("*", (req, res, next) => {
    return next({status: 404, message: "Invalid URL"});
});

// never gonna get hit due to response being sent
app.use((req, res, next) => {
    console.log("Never gonna give you up");
})

app.use((err, req, res, next) => {
     res.status(err.status).send(err.message);
})


const server = app.listen(4494, () => {
     console.log("Server successfully started on port", server.address().port);
});