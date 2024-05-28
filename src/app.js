
// import required modules from    
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
// const multer = require('multer');
// const sharp = require('sharp');
const app = express();
const auth = require('./middleware/auth');
const hbs = require('hbs');
require("./db/conn");

const bcrypt = require('bcrypt');
const Admin = require('./models/admin');


// import user model so that we can save our data in the databse. 
const User = require('./models/registers');

// Set up port, model, and template paths
const port = process.env.PORT || 3000;
const Register = require("./models/registers");
const Static_Path = path.join(__dirname, "../public");
const templates_Path = path.join(__dirname, "../templates/views");
const partials_Path = path.join(__dirname, "../templates/partials");
// const landingPagePath = "C:/PROJECT_MONGODB/src/public/landingpage.html";



// Set up middleware and view engine
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(Static_Path));
app.set('view engine', 'hbs');
app.set("views", templates_Path);
hbs.registerPartials(partials_Path);


// Define routes 
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/landingpage', (req, res) => {
    res.render('landingpage');
});
app.get('/admin', (req, res) => {
    res.render('admin');
});
app.get('/adminlogin', (req, res) => {
    res.render('adminlogin');
});
app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});


// In your server file (app.js or index.js)
app.get('/home', (req, res) => {
    res.render('home');
});

app.get('/donate', (req, res) => {
    res.render('donate'); //  "donate.hbs" is in our views directory
});

app.get("/secret", auth, (req, res) => {
    res.render("secret")
});


app.post('/register', async (req, res) => {
    try {
        // Create a new user instance
        const user = new Register(req.body);

        // Save the user to the database
        const result = await user.save();

        // Log the result after the promise is resolved
        console.log(result);

        // Send a response to the client
        res.status(201).render('login');
    } catch (error) {
        // Handle any errors that occurred during the process
        res.status(500).send(error.message);
    }
});




  /// for login purpose only to check if the user is already registered or not registered
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await Register.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the entered password with the hashed password in the database
        const isPasswordMatch = await bcrypt.compare(password, user.password);

        if (isPasswordMatch) {
            // Successful login
            res.status(200).render("home");
        } else {
            // Incorrect password
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: error.message });
    }
});

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

app.get('/bloodbank', async (req, res) => {
    try {
        const data = await BloodBank.find();

        res.json(data);
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Admin login route
app.post('/adminlogin', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find the admin by username
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(404).render('adminlogin', { error: 'Admin not found' });
        }

        // Compare the entered password with the password in the database
        if (password === admin.password) {
            // Successful login, redirect to the admin page
            return res.redirect('/admin'); // Redirect to the admin page
        } else {
            // Incorrect password, render the login page with an error message
            return res.status(401).render('adminlogin', { error: 'Invalid credentials' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).render('adminlogin', { error: 'Internal Server Error' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await Register.find();
        res.render('admin', { users });
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/edit-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const updatedData = req.body;
        await Register.findByIdAndUpdate(userId, updatedData);
        res.redirect('/users');
    } catch (error) {
        res.status(500).send(error);
    }
});


app.post('/delete-user/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        await Register.findByIdAndDelete(userId);
        res.redirect('/users');
    } catch (error) {
        res.status(500).send(error);
    }
});





// this is to check whether the server is up or not
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});


