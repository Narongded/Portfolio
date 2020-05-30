const mongo = require('./db');


const user = new mongo.Schema({
    name : {type : String},
    password : {type : String}

})


module.exports = mongo.model('user',user);