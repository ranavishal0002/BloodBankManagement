const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

const UserSchema = new Schema({
    firstname: { 
        type: String,
         required: true 
        },
    lastname: { 
        type: String,
         required: true
         },
    age: { 
        type: Number,
         required: true 
        }, // Changed type to Number for age
    bloodgroup: { 
        type: String,
         required: true
         },
    phonenumber: {
        type: Number,
        required: true,
        unique: false,
        validate: {
            validator: function (value) {
                return /^\d{10}$/.test(value.toString()); // Converted value to string before validation
            },
            message: 'Please enter a valid 10-digit phone number.',
        },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Added lowercase option to ensure emails are saved in lowercase
        validate: {
            validator: function (value) {
                // Added a more comprehensive regex for email validation
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            message: 'Please enter a valid email address.',
        },
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'], // Added enum for gender with specific values
        required: true
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter and one digit.',
        },
    },
    confirmpassword: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value === this.password;
            },
            message: 'Passwords do not match.',
        },
    },
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = mongoose.model('Userdata', UserSchema);

module.exports = User;
