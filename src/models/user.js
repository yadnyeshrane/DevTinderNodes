const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
        },
        email: {
            type: String,
            lowerase: String,
            trim: true,

            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        age: {
            type: String,
        },

        gender: {
            type: String,
            enum: {
                values: ["Male", "Female", "Others"],
                message: `{VALUE}is not a valid gender`,
            },
            validate(value) {
                if (!["Male", "Female", "Others"].includes(value)) {
                    throw new Error("Gender data is not valid");
                }
            },
        },
        phothoUrl: {
            type: String,
        },
        about: {
            type: String,
            default: "This is a default about of the user",
        },
        skills: {
            type: [String],
        },
    },
    { timestamps: true }
);
userSchema.index({ firstName: 1, lastName: 1 });
userSchema.methods.getJwt = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, "DEV@TINDER@897");
    return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
