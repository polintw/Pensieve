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

    const regexRule = RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$");
    let str = data.password;
    let ruleOneOne = regexRule.test(str); //at least 1 alphabetical, 1 digit & 8 characters
    /* ref: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a */
    /* ref: https://stackoverflow.com/questions/11533474/java-how-to-test-if-a-string-contains-both-letter-and-number */
    /* ref: https://stackoverflow.com/questions/34292024/regular-expression-vs-vs-none */
    if( !ruleOneOne ) {
      errors.password = 'Password must be more than 8 chars and incl. at least 1 letter and 1 number';
    }


    if (Validator.isEmpty(data.gender)) {
        errors.warning = 'Select a gender or set pronoun.';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
