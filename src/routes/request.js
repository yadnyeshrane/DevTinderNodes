const express = require("express");
const { userAuth } = require("../middleware/auth");
const ConnectionRequestModal = require("../models/connectionRequest");
const { status } = require("express/lib/response");

const requestRoute = express.Router();

requestRoute.post(
    "/request/send/:status/:toUserId",
    userAuth,
    async (req, res) => {x
        try {
            const fromUserId = req.user._id;
            const toUserId = req.params.toUserId;
            const status = req.params.status;
            const allowedStatus = ["ignored", "interested"];
            if (!allowedStatus.includes(status)) {
                return res.status(500).send({ msg: "Invalid status Type" });
            }
            //If there is Existing ConnectionReues

            const existingconnectionRequest =
                await ConnectionRequestModal.findOne({
                    $or: [
                        { fromUserId, toUserId },
                        { fromUserId: toUserId, toUserId: fromUserId },
                    ],
                });
            if (existingconnectionRequest) {
                return res
                    .status(400)
                    .send({ msg: "Connection Request ALready Sent" });
            }
            const connectionRequest = new ConnectionRequestModal({
                fromUserId: fromUserId,
                toUserId: toUserId,
                status: status,
            });
            const data = await connectionRequest.save();
            res.status(200).send({
                msg: "connection request send succesfully",
            });
        } catch (error) {
            console.log("Error", error.message);
        }
    }
);
requestRoute.post(
    "/request/review/:status/:requestId",
    userAuth,
    async (req, res) => {
        try {
            const loggedInUser = req.user;
            console.log("logged", loggedInUser._id);
            const allowedStatus = ["accepeted", "rejected"];
            const status1 = req.params.status;
            const requestId = req.params.requestId;
            if (!allowedStatus.includes(status1)) {
                return res.status(400).json({ msg: "Invalid status type" });
            }
            const connetionRequest = await ConnectionRequestModal.findOne({
                _id: requestId,
                toUserId: loggedInUser._id,
                status: "interested",
            });
            if (!connetionRequest) {
                return res
                    .status(400)
                    .json({ msg: "Connection Request Not Found" });
            }
            connetionRequest.status = status1;
            await connetionRequest.save();
            return res
                .status(200)
                .json({ msg: `Connection Request ${status1}` });
        } catch (error) {
            console.log("Error", error.message);
            res.status(400).json({ msg: error.message });
        }
    }
);

module.exports = requestRoute;
