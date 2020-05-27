const Validator = require('validator');
const isEmpty = require('../../utils/isEmpty');

module.exports = function validatePasswordChangedInput(data) {
    let validationErrors = {};
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password_confirm = !isEmpty(data.password_confirm) ? data.password_confirm : '';

    if(Validator.isEmpty(data.password)) {
        validationErrors.password = 'Password is required';
    }

    if(!Validator.equals(data.password, data.password_confirm)) {
      validationErrors.password_confirm = 'Password and Confirm Password must match';
    }

    const regexRule = RegExp("^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$");
    let str = data.password;
    let ruleOneOne = regexRule.test(str); //at least 1 alphabetical, 1 digit & 8 characters
    /* ref: https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a */
    /* ref: https://stackoverflow.com/questions/11533474/java-how-to-test-if-a-string-contains-both-letter-and-number */
    /* ref: https://stackoverflow.com/questions/34292024/regular-expression-vs-vs-none */
    if( !ruleOneOne ) {
      validationErrors.password = 'Password must be more than 8 chars and incl. at least 1 letter and 1 number';
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
