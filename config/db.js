// MongoDB_URI required in .env file

// dependency
const mongoose = require('mongoose');
const { Schema } = mongoose;
const Log = require('./Log');
const User = require('./User');

// define user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: {type: String, required: true },
});

// create user model
const userModel = mongoose.model('User', userSchema);

// function to connect model to database
const connectMongoDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        console.log(`mongoDB connected: ${conn.connection.host}`);

        // create new user
        const newUser = new User({
            username: 'example',
            password: 'password',
        });

        //save the user to the database
        await newUser.save();

        // log out the user
        console.log('User is logged out');
        } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectMongoDB;
