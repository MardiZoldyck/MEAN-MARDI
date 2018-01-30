const express = require('express');
const app = express();
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/database');
const authentication = require('./routes/authentication')(router);
const bodyParser = require('body-parser');



mongoose.Promise = global.Promise;
mongoose.connect(config.uri, (err) =>{
    if (err){
        console.log('Could not connect to database:', err);
    }else{
        //console.log(config.secret);
        console.log('Connected to database:'+ config.db);
    }
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use(express.static(__dirname + '/client/dist/'));
app.use('/authentication', authentication);

app.get('/', (req, res) =>{
    res.sendFIle(path.join(__dirname + '/client/dist/index.html'));
});
  
app.listen(8080, () =>{
    console.log('Listening on port 8080');
});