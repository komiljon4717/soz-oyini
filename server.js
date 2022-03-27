const formData = require("express-form-data");
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const options = {
    uploadDir: path.join(__dirname, 'public', "files"),
    autoClean: false
};

app.use(express.static('public'))
app.use(express.json())
app.use(formData.parse(options));


app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));

app.post('/', (req, res) => {
    let users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')));
    users.push({
        userId: users.at(-1)?.userId + 1 || 1,
        username: req.body.username,
        proFileImage: `./files/` + path.basename(req.files.file.path)
    })
    fs.writeFileSync("./users.json", JSON.stringify(users))
    res.end()
});


app.get('/game', (req, res) => res.sendFile(path.join(__dirname, 'views', 'game.html')));


app.get('/users', (req, res) => res.json(JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')))));

app.delete('/users', (req, res) => {
    let users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')))
    users = users.filter(el => el.userId != req.body.userId)
    fs.writeFileSync("./users.json", JSON.stringify(users))
});


app.get('/word', (req, res) => {
    let words = JSON.parse(fs.readFileSync(path.join(__dirname, 'words.json')))
    if (words.length) {
        res.json({message: "start"})
    }else{
        res.json({message: "boshlanmagan"})
    }
});



app.delete('/word', (req, res) => {
    let words = []
    fs.writeFileSync("./words.json", JSON.stringify(words))
});




app.post('/word', (req, res) => {
    let words = JSON.parse(fs.readFileSync(path.join(__dirname, 'words.json')))
    if (words.length == 0) {
        words.push({
            userId: req.body.userId,
            username: req.body.username, 
            word: req.body.newWord
        })
        fs.writeFileSync("./words.json", JSON.stringify(words))
    }else{
        if (words.at(-1).word.at(-1) == req.body.newWord[0]) {
            words.push({
                userId: req.body.userId,
                username: req.body.username, 
                word: req.body.newWord
            })
            fs.writeFileSync("./words.json", JSON.stringify(words))
            res.end()
        }else{
            res.sendStatus(404)
        }
    }
    res.end()
});







app.listen(5000, () => console.log("server is running on 5000"))







// (req, res, next) =>{
//     let users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json')))
//     users.map(user => {
//         user.proFileImage = `http://192.168.1.2:5000/public/files/` + user.proFileImage
//         return user
//     })
//     res.end(users)
//     next()
// } ,