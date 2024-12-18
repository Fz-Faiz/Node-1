const express = require("express");
const fs = require('fs');
const users = require("./MOCK_DATA.json");
const { json } = require("stream/consumers");

const app = express();
const PORT = 8000;

// Middleware - Plugins
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
    fs.appendFile(
        'log.txt',
        `\n${Date.now()}:${req.ip} ${req.method}: ${req.path}`,
        (err, data) => {
            next();

        }
    );
    
})
app.use((req, res, next) => {
    console.log("Hello from middle ware 2", req.myUserName);
    next()
})

app.get('/users', (req, res) => {
    const html = `
     <ul>
        ${users.map((users) => `<li>${users.first_name}<li/>`).join(" ")}
     <ul/>
    `;
    res.send(html)
})


// Rest API

app.get('/', (req, res) => {
    return res.send("Home Page");
})
app.get('/api/users', (req, res) => {
    res.setHeader("X-MyName","faiz"); // Custom Header
    // Always add X to custom header
    
    return res.json(users)
})

// Dynamic Path
app.route("/api/users/:id")
    .get((req, res) => {
        const id = Number(req.params.id);
        const user = users.find((user) => user.id === id)
        if(!user) return res.status(404).json({ msg : "User not found"})
        return res.json(user)
    })
    .patch((req, res) => {
        const id = Number(req.params.id);
        const body = req.body;

        const user = users.findIndex((user) => user.id === id)
        const gotUser = users[user];

        const updateUser = { ...gotUser, ...body };
        users[user] = updateUser;

        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (error, data) => {
            return res.json({ status: "Success" })

        })

    })
    
    .delete((req, res) => {
        const id = Number(req.params.id);
        const body = req.body;
        const user = { ...body }
        users[id - 1] = user
        fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (error, data) => {
            return res.json({ status: "Success" })

        })


    })

app.post('/api/users', (req, res) => {
    const body = req.body;
    if(!body || !body.first_name || !body.last_name || !body.email || !body.gender || !body.job_title) {
        return res.status(400).json({ message: "All fields are required" })
    }
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile('./MOCK_DATA.json', JSON.stringify(users), (error, data) => {
        return res.status(201).json({ status: "Success", id: users.length })
    })


})


app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`))