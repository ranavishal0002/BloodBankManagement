const { MongoClient, ServerApiVersion } = require('mongodb');

const mongoose = require('mongoose');

const uri = "mongodb+srv://rvishalsingh:Vishal1234@bloodbank.oqtzajo.mongodb.net/BloodBank?retryWrites=true&w=majority"; // this is used to connect mongodb atlas

const connection = mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true // Ensure unique indexes
}).then(() => {
    console.log('MongoDB connected...');
}).catch((err) => {
    console.error('MongoDB connection error:', err);
});

console.log(connection);

