const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstname:
    {
        type: String,
        required: [true, "Please enter first name"],
        trim: true
    },
    lastname:
    {
        type: String,
        required: [true, "Please enter last name"],
        trim: true
    },
    email:
    {
        type: String,
        required: [true, "Please enter email address"],
        unique: true,
        trim: true
    },
    dob:
    {
        type: Date
    },
    gender: {
        type: String
    },
    occupation: {
        type: String
    },
    education: {
        institutionName: {
            type: String
        },
        course: {
            type: String
        },
        year: {
            type: Number
        },
        location: {
            type: String
        }
    },
    employment: {
        company: {
            type: String,
        },
        role: {
            type: String
        },
        experience: {
            type: Number
        }
    },
    interests: {
        type: String
    },
    socialNetworks: {
        facebook: {
            type: String
        },
        instagram: {
            type: String
        },
        linkedin: {
            type: String
        },
        youtube: {
            type: String
        },
        pinterest: {
            type: String
        }
    },
    password:
    {
        type: String,
        required: [true, "Please enter your password"]
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;