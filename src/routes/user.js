const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModal = require("../models/connectionRequest");
const { status } = require("express/lib/response");
const User = require("../models/user");
const userRouter = express.Router();
userRouter.get("/users/request/received", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        const connectionRequestList = await ConnectionRequestModal.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", [
            "firstName",
            "lastName",
            "age",
            "about",
            "phothoUrl",
        ]);
        //  console.log("rrr", connectionRequestList);
        if (connectionRequestList.length == 0) {
            return res.status(200).json({ data: [] });
        }
        res.status(200).json({ data: connectionRequestList });
    } catch (error) {
        console.log("Error in userRouter", error.message);
        res.status(500).send({ msg: error.message });
    }
});
userRouter.get("/users/connection", userAuth, async (req, res, next) => {
    try {
        const loggedInUser = req.user;
        // const connectionRequestList = await ConnectionRequestModal.find({
        //     toUserId: loggedInUser._id,
        //     status: "accepeted",
        // }).populate("fromUserId", ["firstName", "lastName"]);
        //  console.log("rrr", connectionRequestList);
        const connectionRequestList = await ConnectionRequestModal.find({
            $or: [
                { toUserId: loggedInUser._id, status: "accepeted" },
                { fromUserId: loggedInUser._id, status: "accepeted" },
            ],
        })
            .populate("fromUserId", [
                "firstName",
                "lastName",
                "phothoUrl",
                "about",
                "gender",
            ])
            .populate("toUserId", [
                "firstName",
                "lastName",
                "phothoUrl",
                "about",
                "gender",
            ]);
        // console.log("onne", connectionRequestList);
        if (connectionRequestList.length == 0) {
            return res.status(400).json({ msg: "No request Found" });
        }
        const data = connectionRequestList.map((row) => {
            if (row.fromUserId._id.toString() == loggedInUser._id.toString()) {
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.status(200).json({ data });
    } catch (error) {
        console.log("Error in userRouter", error.message);
        res.status(500).send({ msg: error.message });
    }
});
userRouter.get("/users/feed", userAuth, async (req, res, next) => {
    try {
        //Fetch all Users List
        //Filter the user based on uid nd we will get the the user hs sent reuest to which connection

        const loggedInUser = req.user;

        const alluserList = await User.find();
        const connectionReuestList = await ConnectionRequestModal.find();

        const temprry = [];
        const fromUserList = connectionReuestList.map((list) => {
            if (
                list.fromUserId.toString() == loggedInUser._id.toString() ||
                list.toUserId.toString() == loggedInUser._id.toString()
            ) {
                temprry.push(list.fromUserId.toString());
                temprry.push(list.toUserId.toString());
                //  return list.fromUserId.toString(), list.toUserId.toString();
            }
        });
        const filtereDt = alluserList.filter((data) => {
            if (
                !temprry.includes(data._id.toString()) &&
                data._id.toString() != loggedInUser._id.toString()
            ) {
                return data;
            }
        });
        // console.log(";is", filtereDt);

        res.status(200).json({ ok: filtereDt });
        // alluserList.filter(())
    } catch (error) {
        console.log("Error in Feed", error.message);
        res.status(500).send({ msg: error.message });
    }
});
module.exports = userRouter;
