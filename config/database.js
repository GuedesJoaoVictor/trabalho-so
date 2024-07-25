const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://mongodb:27017/todolist", { useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.log(err));