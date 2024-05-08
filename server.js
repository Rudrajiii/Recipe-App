const express = require("express");
const { main } = require("./app");
const path = require("path");
const server = express();
server.set('view engine', 'ejs');
server.set('views', path.join(__dirname, 'views'));
server.use(express.static('public'));

server.get('/', function (req, res) {
    res.render('index');
})
server.get('/api' ,async function(req, res){
    try {
        const userPrompt = req.query.prompt;
        const apiData = await main(userPrompt);
        res.json({ response: apiData }); //JSON
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
})

server.listen(8080 , ()=>{
    console.log('listening on port 8080');
});
