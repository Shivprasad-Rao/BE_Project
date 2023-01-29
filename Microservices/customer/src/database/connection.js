const mongoose = require('mongoose');
const { DB_URL } = require('../config');

module.exports = async() => {

    try {
        await mongoose.connect("mongodb+srv://Mystic-SAM:m8HqvI6lS4G5ymP9@cluster-sam.5s56yfg.mongodb.net/?retryWrites=true&w=majority", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        console.log('Db Connected');
        
    } catch (error) {
        console.error('Error ============ ON DB Connection')
        console.log(error);
    }
 
};

 
