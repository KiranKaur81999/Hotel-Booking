const mongoose = require('mongoose');

var mongoURL = 'mongodb+srv://kiran8:kiran8@cluster0.kogws.mongodb.net/mern-rooms';

mongoose.connect(mongoURL, {useUnifiedTopology : true, useNewUrlParser : true});

var connection = mongoose.connection;

connection.on('error', () => {
    console.log('MongoDB connection failed');
})

connection.on('connected', ()=>{
    console.log('MongoDB connection successful');
})

module.exports = mongoose
