const mongoose =require ('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const { userInfo } = require('os');

// user schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minLength: 6
    }
});

//generate JWT - unique id as payload - replace scret key with env variable
userSchema.methods.getJWT = async function() {
    const user = this;
    const token = jwt.sign({ _id: user._id, }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

//validate password
userSchema.methods.validatePassword = async function(userpassword) {
    const user = this;
    //get hashed password
    const passwordHash = user.password;
    //compare
    const isPasswordValid = await bcrypt.compare(userpassword, passwordHash);
    //as boolean
    return isPasswordValid;
};

// export schema as model
module.exports = mongoose.model('User', userSchema);