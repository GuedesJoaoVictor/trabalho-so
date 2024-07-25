const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/todo-lists';

mongoose.connect(mongoUrl)
    .then(() => console.log("Conectado ao MongoDB"))
    .catch((err) => console.log(err));