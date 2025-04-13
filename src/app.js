const express = require("express");
const app = express();
const User = require("./models/user");
const connetDB = require("./config/database");
const { validateSignupData } = require("./utils/validation");
const cors = require("cors");
const cokkieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);
app.use(express.json());
app.use(cokkieParser());
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/pr", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.get("/feed", async (req, res) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({ "All Users data": allUsers });
    } catch (error) {}
});

app.delete("/deleteuser", async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _id: userId });
        res.status(200).json({ msg: "USer Deleted Succesfully" });
    } catch (error) {}
});
app.patch("/user", (req, res) => {
    const UserId = req.body.UserId;

    const data = req.body;

    const isAllowedUpdates = ["about", "gender", "age", "phothoUrl"];

    const isUpdteallowed = Object.keys(data).every((k) =>
        isAllowedUpdates.includes(k)
    );
    if (!isUpdteallowed) {
        res.status(400).send("Update Not Allowed");
    }
});

connetDB()
    .then(() => {
        console.log("Db connected");
        app.listen(3000, () => {
            console.log("Server is Listening");
        });
    })
    .catch((err) => {
        console.log("Error in connectind Db");
    });
