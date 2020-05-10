const Validator = require('validator');
const isEmpty = require('../../utils/isEmpty');

module.exports = function validatePasswordChangedInput(data) {
    let validationErrors = {};
    data.password = !isEmpty(data.password) ? data.password : '';

    if(Validator.isEmpty(data.password) ) {
      errors.password = 'Password is required';
    }

    if(!Validator.isLength(data.password, {min: 6, max: 32}) ) {
      errors.password = 'Password must have at least 6 chars, and using both numbers and letters.';
    }

    if(Validator.isAlphanumeric(data.password) ) {
      errors.password = 'Password must have at least 6 chars, and using both numbers and letters.';
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
