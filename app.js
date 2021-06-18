const express = require('express');
const fs = require('fs');
const app = express();
const filePath = "users.json";
const jsonParser = express.json();


app.use(express.static(__dirname + "/public"));
app.get('/', function (request, response) {
    response.render('/index.html');
});

//users.json
app.get("/api/users", function (req, res) {
    const content = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(content);
    res.send(users);
});

// GET
//getting one user by id
app.get("/api/users/:id", function (req, res) {
    const id = req.params.id;
    const content = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(content);
    let getUser;
    users.forEach(i=>{
        if(i.id==id){getUser=i}
    });
    getUser ? res.send(getUser) : res.status(404).send();
});

// POST
// getting submitted data from a form
app.post("/api/users", jsonParser, function (req, res) {
    if (!req.body) {
        return res.status(400).send('<h1>request 400 !!!</h1>');
    }
    const userName = req.body.name;
    const userLevel = req.body.level;
    // create new user
    const user = {name: userName, level: userLevel};
    let data = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(data);
if (users.length===0){
    user.id=1;
}else{
    // search max id
    const id = Math.max(...users.map(i => i.id));
    user.id = id + 1;
}
    users.push(user);
    // create new JSON
    data = JSON.stringify(users);
    // write files with new data
    fs.writeFileSync(filePath, data);
    res.send(user);
});

//PUT
// change user data
app.put("/api/users", jsonParser, function (req, res) {
    if (!req.body) {
         res.status(400).send('error 400');
    }
    const userId = req.body.id;
    const userName = req.body.name;
    const userLevel = req.body.level;
    let data = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(data);
    let user;
    users.forEach(i=>{
        if (i.id==userId){
            user=i;
        }
    })
    //change data
    if (user) {
        user.id=userId;
        user.name = userName;
        user.level = userLevel;
        data = JSON.stringify(users);
        fs.writeFileSync(filePath, data);
        res.send(user);
    } else {
        res.status(404).send(user);
    }
});

// DELETE
// delete user where id
app.delete("/api/users/:id", function (req, res) {
    const id = req.params.id;
    const data = fs.readFileSync(filePath, 'utf8');
    const users = JSON.parse(data);
    const user = users.filter(i => i.id == id);
    if (user[0]) {
        const index = users.indexOf(user[0]);
        const tmp = user[0];
        users.splice(index, 1);
        fs.writeFileSync(filePath, JSON.stringify(users));
        res.send(tmp);
    } else {
        res.status(404).send();
    }
});
app.listen(7000, () => console.log('Port 7000 Ok'));