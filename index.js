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

const checkMethod = (methods = []) => (req, res, next) => {
    if (!methods.includes(req.method))
        return next({status: 405, message: `Incorrect request method: ${req.method}\nShould be: ${methods}`})
    else 
        return next();
}

const checkContentType = (type = "application/json") => (req, res, next) => {
    if (!req.is(type))
        return next({status: 415, message: `Invalid data format. Please send your data in the format: ${type}`});
    else 
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

app.use("/", checkMethod("GET"), (request, response) => {
    response.send(cows.speak("Mooooooo"));
});

app.use("/getAll", checkMethod("GET"), (req, res) => res.json(data));

app.use("/get/:id", checkMethod("GET"), (req, res, next) => {
    const id = Number.parseInt(req.params.id);

    if (id == null || undefined || id === NaN) 
        return next({ status: 400, message: "Invalid id" });
    else if (id > data.length) 
        return next({ status: 404, message: "No person found with id " + id });
    
    res.json(data[id]);
})

app.use("/create", checkMethod("POST"), checkContentType(), bloop, (req, res) => {
    const person = req.body;
    data.push(person);
    res.status(201).send("Successfully created");
});

app.use("/replace/:id", checkMethod("PUT"), (req, res) => {
    const newPerson = req.query;
    const id = Number.parseInt(req.params.id);

    if (id == null || undefined || id === NaN) 
        return next({ status: 400, message: "Invalid id" });
    else if (id > data.length) 
        return next({ status: 404, message: "No person found with id " + id });
    
    data.splice(id, 1, newPerson);
    res.status(202).json(data[id]);
});

app.use("/remove/:id", checkMethod("DELETE"), (req, res) => {
    const id = Number.parseInt(req.params.id);

    if (id == null || undefined || id === NaN) 
        return next({ status: 400, message: "Invalid id" });

    data.splice(id, 1);
    res.sendStatus(204);
});

app.use("*", (req, res, next) => {
    return next({status: 404, message: "Invalid URL"});
});

// never gonna get hit due to response being sent previously
app.use((req, res, next) => {
    console.log("Never gonna give you up");
})

app.use((err, req, res, next) => {
     res.status(err.status || 400).send(err.message || "ERROR");
})


const server = app.listen(4494, () => {
     console.log("Server successfully started on port", server.address().port);
});