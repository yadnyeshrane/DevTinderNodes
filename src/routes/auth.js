const express = require("express");

const authRouter = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
authRouter.post("/signup", async (req, res) => {
    //   validateSignupData(req);
    console.log("Request", req.body);
    const passwordHash = bcrypt.hash(req.body.password, 10);

    const user = new User(req.body);
    try {
        await user.save();
        res.send("User Added Succefullly");
    } catch (error) {
        console.log("Error", error);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        console.log("Login");
        const { email, password } = req.body;
        // console.log("Emil", emailId);
        const user = await User.findOne({ email: email });
        console.log("user", user);
        if (user) {
            const token = await user.getJwt();

            res.cookie("token", token);
            res.status(200).json({ data: user });
        }
        res.status(500).json({ msg: "User Not Present" });
    } catch (error) {
        console.log("Err", error);
    }
});
authRouter.post("/logout", async (req, res) => {
    return res
        .cookie("token", null, { expires: new Date(Date.now()) })
        .send("USer logged out");
});
module.exports = authRouter;
