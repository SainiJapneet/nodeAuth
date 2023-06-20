const mongoose = require('mongoose');
require('dotenv').config();

async function dbConnect() {

    console.log(process.env.DB_URL)
    mongoose.connect(process.env.DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log('Connection to DB successful');
    }).catch((error) => {
        console.log('Failed to connect to DB')
        console.log(error)
    })
}

module.exports = dbConnect;