const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateEditProfileData } = require("../utils/validation");

const profileRouter = express.Router();
profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.status(200).json({ user });
        // res.send("Profile Fetched", _id);
    } catch (error) {}
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error("Invalid Edit Request");
        }
        const user = req.user;
        console.log("Before", user);
        Object.keys(req.body).forEach((element) => {
            user[element] = req.body[element];
        });
        console.log("After", user);
        await user.save();
        res.status(200).send({
            msg: user,
        });
    } catch (error) {
        console.log("Err", error);
        res.status(400).send({ Error: error.message });
    }
});

module.exports = profileRouter;
