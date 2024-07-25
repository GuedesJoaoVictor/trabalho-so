const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://mongo_db/todo-lists")
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.log(err));