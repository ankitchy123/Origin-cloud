const connectToMongo = require('./db');
const express = require('express');
const app = express()
var cors = require('cors')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const authUser = require('./middleware/authUser');
const User = require('./models/UserModel');
const { Cookie } = require('express-session');
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

app.get('/getcookie', function (req, res) {
    res.send(req.cookies);
})


// Middleware
app.set('view engine', 'ejs')
// connect with database
connectToMongo();

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register', {
        CLIENT_ID: process.env.MAILING_SERVICE_CLIENT_ID
    })
})

app.get('/', authUser, async (req, res) => {
    if (req.user) {
        const { email } = req.user.data;
        let user = await User.findOne({ email });

        return res.render('dashboard', {
            user, CLIENT_ID: process.env.MAILING_SERVICE_CLIENT_ID
        })
    }
    req.flash("success", "Please login")
    return res.redirect('/login')
})

app.get('/profile', authUser, async (req, res) => {
    if (req.user) {
        const { email } = req.user.data;
        let user = await User.findOne({ email });
        return res.render('profile', {
            user, CLIENT_ID: process.env.MAILING_SERVICE_CLIENT_ID
        })
    }
    req.flash("success", "Please login")
    return res.redirect('/login')
})

app.get('/update', authUser, async (req, res) => {
    if (req.user) {
        const { email } = req.user.data;
        let user = await User.findOne({ email });
        return res.render('update', {
            user, CLIENT_ID: process.env.MAILING_SERVICE_CLIENT_ID
        })
    }
    req.flash("success", "Please login")
    return res.redirect('/login')
})


app.use('/api/auth', require('./routes/auth'));

app.listen(port, () => {
    console.log(`App is listening on port http://localhost:${port}`);
})