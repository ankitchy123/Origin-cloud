const connectToMongo = require('./db');
const express = require('express');
const app = express()
var cors = require('cors')
const cookieParser = require('cookie-parser')

app.use(cors())
app.use(express.json());
app.use(cookieParser())

const port = process.env.PORT || 5000

// connect with database
connectToMongo();

// Available routes
app.use('/api/auth', require('./routes/auth'));

app.listen(port, () => {
    console.log(`App is listening on port http://localhost:${port}`);
})