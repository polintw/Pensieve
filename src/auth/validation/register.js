const Validator = require('validator');
const isEmpty = require('../../utils/isEmpty');

module.exports = function validateRegisterInput(data) {
    let errors = {};
    data.account = !isEmpty(data.lastName) && !isEmpty(data.firstName) ? data.firstName+' '+data.lastName : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';
    data.gender = !isEmpty(data.gender) ? data.gender : '';

    if(!Validator.isLength(data.account, { min: 2, max: 42 })) {
        errors.account = 'Both first and family name are required.';
    }

    if(Validator.isEmpty(data.account)) {
        errors.account = 'Both first and family name field is required';
    }

    if(!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }

    if(Validator.isEmpty(data.email)) {
        errors.email = 'Email is required';
    }


    if(!Validator.equals(data.password, data.password_confirm)) {
      errors.password_confirm = 'Password and Confirm Password must match';
    }

    if(Validator.isEmpty(data.password) || Validator.isEmpty(data.password_confirm)) {
        errors.password = 'Password is required';
    }

    if(!Validator.isLength(data.password, {min: 6, max: 32}) || !Validator.isLength(data.password_confirm, {min: 6, max: 32})) {
      errors.password = 'Password must have at least 6 chars, and using both numbers and letters.';
    }

    if(Validator.isAlphanumeric(data.password) || Validator.isAlphanumeric(data.password_confirm)) {
        errors.password = 'Password must have at least 6 chars, and using both numbers and letters.';
    }


    if (Validator.isEmpty(data.gender)) {
        errors.warning = 'Select a gender or set pronoun.';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
