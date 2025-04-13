const mongoose = require("mongoose");
const connetDB = async () => {
    await mongoose.connect(
        "mongodb://127.0.0.1:27017/devtinder?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.1.5"
    );
};

module.exports = connetDB;
