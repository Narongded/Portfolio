const mongo = require('./db');


const data = new mongo.Schema({
    name : String,
    des : String,
    img : String
})


module.exports = mongo.model('data',data)

