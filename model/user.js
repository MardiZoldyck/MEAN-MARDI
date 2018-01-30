const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');
const emailRegex = require('email-regex');
const regex = require('regex-username');

// this is a email validators
let emailLengthChecker = (email) =>{
    if (!email) {
        return false;        
    }else{
        if (email.length < 5 || email.length > 30) {
            return false;
        }else{
            return true;
        }
    }
};

let validateEmailChecker = (email) => {
    if (!email) {
        return false;
    } else {
        // Regular expression to test for a valid e-mail
        // const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        // return regExp.test(email); // Return regular expression test results (true or false)
        // Contains an email address
        return emailRegex().test(email);
        //=> true
    }
};

const emailValidators = [
    {
        validator: emailLengthChecker, message: 'Email must be at least 5 character but no more than 30'
    },
    {
        validator: validateEmailChecker, message: 'Must be valid email'
    }
];

// this is a username validators
let usernameLengthChecker = (username) => {
    if (!username) {
        return false;
    } else {
        if (username.length < 3 || username.length > 15) {
            return false;
        } else {
            return true;
        }
    }
};

let validateUsername = (username) => {
    if (!username) {
        return false;
    } else {
        // const redExp = new RegExp(/^[a-zA-Z0-9]+$/);
        // return RegExp.test(username);
        // Contains an email address
        return regex().test(username);
        //=> true
    }
};

const usernameValidators = [
    {
        validator: usernameLengthChecker, message: 'Username must be at least 3 character but no more than 15'
    },
    {
        validator: validateUsername, message: 'Username must no have any special characters'
    }
];

// Validate Function to check password length
let passwordLengthChecker = (password) => {
    // Check if password exists
    if (!password) {
        return false; // Return error
    } else {
        // Check password length
        if (password.length < 8 || password.length > 35) {
            return false; // Return error if passord length requirement is not met
        } else {
            return true; // Return password as valid
        }
    }
};

// Validate Function to check if valid password format
let validPassword = (password) => {
    // Check if password exists
    if (!password) {
        return false; // Return error
    } else {
        // Regular Expression to test if password is valid format
        const regExp = new RegExp(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
        return regExp.test(password); // Return regular expression test result (true or false)
    }
};

// Array of Password validators
const passwordValidators = [
    // First password validator
    {
        validator: passwordLengthChecker,
        message: 'Password must be at least 8 characters but no more than 35'
    },
    // Second password validator
    {
        validator: validPassword,
        message: 'Must have at least one uppercase, lowercase, special character, and number'
    }
];

const userSchema = new Schema({
    email : { type: String, required: true, unique: true, lowercase: true, validate: emailValidators},
    username : { type: String, required: true, unique: true, lowercase: true, validate: usernameValidators},
    password: { type: String, required: true, validate: passwordValidators}
});

userSchema.pre('save', function(next){
    if(!this.isModified('password'))
    return next;

    bcrypt.hash(this.password, null, null, (err, hash) =>{
        if(err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.method.comparePassword = (password) =>{
    return bcrypt.compareSync(password, this.password);
};
module.exports = mongoose.model('User', userSchema);