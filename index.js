const connectToMongo = require('./db');
const express = require('express');
const app = express()
var cors = require('cors')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const authUser = require('./middleware/authUser');
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(require("express-session")({
    secret: "The milk would do that",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(function (req, res, next) {
    res.locals.message = req.flash();
    next();
});


// Middleware
app.set('view engine', 'ejs')
// connect with database
connectToMongo();

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.get('/dashboard', authUser, (req, res) => {
    if (req.user) {
        return res.render('dashboard')
    }
    req.flash("success", "Please login")
    return res.redirect('/login')
})

app.get('/updatedetails', authUser, (req, res) => {
    if (req.user) {
        return res.render('update', {
            user: req.user.data
        })
    }
    req.flash("success", "Please login")
    return res.redirect('/login')
})

app.use('/api/auth', require('./routes/auth'));

app.listen(port, () => {
    console.log(`App is listening on port http://localhost:${port}`);
})