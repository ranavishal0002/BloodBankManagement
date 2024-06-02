// Import required modules
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const multer = require('multer');
// const sharp = require('sharp');
const app = express();
const auth = require('./middleware/auth'); // Authentication middleware
const hbs = require('hbs');
require("./db/conn"); // Database connection

const bcrypt = require('bcrypt');
const Admin = require('./models/admin'); // Admin model
const User = require('./models/registers'); // User model

// Set up port, model, and template paths
const port = process.env.PORT || 3000;
const Register = require("./models/registers");
const Static_Path = path.join(__dirname, "../public");
const templates_Path = path.join(__dirname, "../templates/views");
const partials_Path = path.join(__dirname, "../templates/partials");

// Set up middleware and view engine
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(express.static(Static_Path)); // Serve static files
app.set('view engine', 'hbs'); // Set view engine to Handlebars
app.set("views", templates_Path); // Set views directory
hbs.registerPartials(partials_Path); // Register partials for Handlebars

// Define routes
app.get('/', (req, res) => {
    res.render('index'); // Render the index page
});
app.get('/landingpage', (req, res) => {
    res.render('landingpage'); // Render the landing page
});
app.get('/admin', (req, res) => {
    res.render('admin'); // Render the admin page
});
app.get('/adminlogin', (req, res) => {
    res.render('adminlogin'); // Render the admin login page
});
app.get('/register', (req, res) => {
    res.render('register'); // Render the register page
});
app.get('/login', (req, res) => {
    res.render('login'); // Render the login page
});
app.get('/home', (req, res) => {
    res.render('home'); // Render the home page
});
app.get('/donate', (req, res) => {
    res.render('donate'); // Render the donate page
});
// app.get("/secret", auth, (req, res) => {
//     res.render("secret"); // Render the secret page, protected by auth middleware
// });

// Register route
app.post('/register', async (req, res) => {
    try {
        const user = new Register(req.body); // Create a new user instance
        const result = await user.save(); // Save the user to the database
        console.log(result); // Log the result
        res.status(201).render('login'); // Render the login page on success
    } catch (error) {
        res.status(500).send(error.message); // Handle errors
    }
});

// Login route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Register.findOne({ email }); // Find the user by email
        if (!user) {
            return res.status(404).json({ message: 'User not found' }); // User not found
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password); // Compare passwords
        if (isPasswordMatch) {
            res.status(200).render("home"); // Successful login
        } else {
            res.status(401).json({ message: 'Invalid credentials' }); // Incorrect password
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message }); // Handle errors
    }
});

// Blood bank schema and model
const bloodBankSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    age: Number,
    bloodgroup: String,
    phonenumber: Number,
    email: String,
    gender: String,
    password: String,
    confirmPassword: String,
});
const BloodBank = mongoose.model('BloodBank', bloodBankSchema);

// Blood bank data route
app.get('/bloodbank', async (req, res) => {
    try {
        const data = await BloodBank.find(); // Fetch all blood bank records
        res.json(data); // Send data as JSON
        console.log(data); // Log the data
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error'); // Handle errors
    }
});

// Admin login route
app.post('/adminlogin', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username }); // Find the admin by username
        if (!admin) {
            return res.status(404).render('adminlogin', { error: 'Admin not found' }); // Admin not found
        }
        if (password === admin.password) {
            return res.redirect('/admin'); // Successful login, redirect to admin page
        } else {
            return res.status(401).render('adminlogin', { error: 'Invalid credentials' }); // Incorrect password
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('adminlogin', { error: 'Internal Server Error' }); // Handle errors
    }
});

// Fetch and display all users
app.get('/users', async (req, res) => {
    try {
        const users = await Register.find(); // Fetch all users
        res.render('admin', { users }); // Render the admin page with user data
    } catch (error) {
        res.status(500).send(error); // Handle errors
    }
});

// Edit user route
app.post('/edit-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        await Register.findByIdAndUpdate(userId, updatedData); // Update user data
        res.redirect('/users'); // Redirect to the users page
    } catch (error) {
        res.status(500).send(error); // Handle errors
    }
});

// Delete user route
app.post('/delete-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await Register.findByIdAndDelete(userId); // Delete user by ID
        res.redirect('/users'); // Redirect to the users page
    } catch (error) {
        res.status(500).send(error); // Handle errors
    }
});

// app.js
app.get('/inventory', async (req, res) => {
    try {
        const bloodGroups = await Register.aggregate([
            { $group: { _id: "$bloodgroup", count: { $sum: 1 } } }
        ]);
        res.render('admin', { users: [], bloodGroups });
        console.log(bloodGroups);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
});



// Check if the server is up
app.listen(port, () => {
    console.log(`listening on port ${port}`); // Log the port
});
