const Validator = require('validator');
const isEmpty = require('../../utils/isEmpty');

module.exports = function validatePasswordChangedInput(data) {
    let validationErrors = {};
    data.password = !isEmpty(data.password) ? data.password : '';
    
    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        validationErrors.password = 'Password must have 6 chars';
    }
    
    if(Validator.isEmpty(data.password)) {
        validationErrors.password = 'Password is required';
    }

    /*
    if the client also pass the current(old) password,
    we validate it inside the parent f()
     */
    
    return {
        validationErrors,
        isValid: isEmpty(validationErrors)
    }
}
