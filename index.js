const express = require("express");
const fs =require('fs');
const users = require("./MOCK_DATA.json");
const { json } = require("stream/consumers");

const app = express();
const PORT = 8000;

// Middleware - Plugins
app.use(express.urlencoded({extended:false}));

app.get('/users',(req,res)=>{
    const html = `
     <ul>
        ${users.map((users)=>`<li>${users.first_name}<li/>`).join(" ")}
     <ul/>
    `;
    res.send(html)
})


// Rest API

app.get('/',(req,res)=>{
    return res.send("Home Page");
})
app.get('/api/users',(req,res)=>{
    return res.json(users)
})

// Dynamic Path
app.route("/api/users/:id")
   .get((req,res)=>{
        const id = Number(req.params.id);
        const user = users.find((user)=>user.id === id)
        return res.json(user)
    })
    .patch((req,res)=>{
        const id = Number(req.params.id);
        const body = req.body;
    
        const user = users.findIndex((user)=>user.id === id)
        const gotUser = users[user];
        
        const updateUser = {...gotUser,...body};
        users[user]=updateUser;

        fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(error,data)=>{
            return res.json({status:"Success"})

        })
        
    })
    .delete((req,res)=>{
        const id = Number(req.params.id);
        const body = req.body;
        const user = {...body}
        users[id-1]=user
        fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(error,data)=>{
            return res.json({status:"Success"})

        })

        
    })

app.post('/api/users',(req,res)=>{
    const body = req.body;
    users.push({...body,id:users.length+1});
    fs.writeFile('./MOCK_DATA.json',JSON.stringify(users),(error,data)=>{
        return res.json({status:"Success",id:users.length})
    })
    
   
})


app.listen(PORT,()=>console.log(`Server Started at PORT:${PORT}`))