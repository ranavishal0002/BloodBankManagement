const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,  // Minimum password length
        validate: {
            validator: function (value) {
                // Validate that the password contains at least one uppercase letter, one lowercase letter, and one digit
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(value);
            },
            message: 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one digit.',
        },
    },
    confirmPassword: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                // Validate that the confirm password matches the password
                return value === this.password;
            },
            message: 'Passwords do not match.',
        },
    },
});

// Pre-save hook to hash password before saving admin to database
AdminSchema.pre("save", async function (next) {
    if (this.isModified('password')) {  // Only hash if password is modified
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;