export function isAlphabeticWithSpaces(input) {
    const regex = /^[A-Za-z\s]+$/;
    return regex.test(input);
}

//function to validate 10 digit mobile number
export function isValidMobileNumber(input) {
    const regex = /^\d{10}$/;
    return regex.test(input);
}