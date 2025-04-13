const validator = require("validator");
const validateSignupData = (req) => {
    const { firstName, lastName, emailId, password } = req.body;
    if (!firstName || !lastName) {
        throw new Error("name is not valid");
    } else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("Firstname charater should be between 4 to 50");
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email should be valid");
    }
};

const validateEditProfileData = (req) => {
    const allowedEditFields = ["gender", "age", "phothoUrl", "about"];

    const isAllowed = Object.keys(req.body).every((field) =>
        allowedEditFields.includes(field)
    );
    return isAllowed;
};

module.exports = {
    validateSignupData,
    validateEditProfileData,
};
