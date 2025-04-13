const User = require("../models/user");
const jwt = require("jsonwebtoken");
const userAuth = async (req, res, next) => {
    try {
        const t1 = req.cookies;
        const { token } = t1;
        // console.log("jwts", token);
        if (!token) {
            res.status(401).json({ msg: "Un Authorized" });
        }
        const decodedMessage = await jwt.verify(token, "DEV@TINDER@897");
        const { _id } = decodedMessage;
        const user = await User.findById({ _id: _id });
        if (!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        console.log("Errorsss", error.message);
        res.status(400).json({ Error: error.message });
    }
};

module.exports = { userAuth };
