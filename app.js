const express = require('express');
const CONFIG = require('./config');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const participantRoute = require('./routes/participant');
const userRoute = require('./routes/user');
const tournamentRoute = require('./routes/tournament');
const groupRoute = require('./routes/group');
const passport = require('passport');
const handleError = require('./errorHandler');

require('./authentication/localStrategy');
require('./authentication/jwtStrategy');

if(process.env.NODE_ENV && process.env.NODE_ENV === 'test'){
    mongoose.connect(CONFIG.CONNECTION_STRING_TEST)
}
else{
    mongoose.connect(CONFIG.CONNECTION_STRING)
}

mongoose.Promise = global.Promise;

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use('/participants', participantRoute);
app.use('/tournaments', tournamentRoute);
app.use('/groups', groupRoute);
app.use('/user', userRoute);
app.use(handleError);

const listener = app.listen(process.env.PORT || CONFIG.PORT, () => {
    console.log(`Server started! listening on port: ${listener.address().port}`);
})

module.exports = app;