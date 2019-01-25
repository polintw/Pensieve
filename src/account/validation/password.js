const Validator = require('validator');
const isEmpty = require('../../utils/isEmpty');

module.exports = function validatePasswordChangedInput(data) {
    let errors = {};
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_old = !isEmpty(data.password_old) ? data.password_old : '';

    if(!Validator.isLength(data.password, {min: 6, max: 30})) {
        errors.password = 'Password must have 6 chars';
    }

    if(Validator.isEmpty(data.password)) {
        errors.password = 'Password is required';
    }

    if(Validator.isEmpty(data.password_old)) {
      errors.password_old = 'Password is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
