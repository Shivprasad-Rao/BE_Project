const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async() => {

    try {
        await mongoose.connect("mongodb+srv://ShivaRao:T4ITnbLgjDQTgCxQ@cluster0.syx5jly.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Db Connected');
        
    } catch (error) {
        console.log('Error ============')
        console.log(error);
    }
 
};

 
