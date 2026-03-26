const validator = require('validator');

// Validate user registration data
const validatesSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName ){
        throw new Error('Invalid name');
    }
    else if (!validator.isEmail(email)) {
        throw new Error('Invalid email');
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is too weak")
    }
};


module.exports = { validatesSignUpData };