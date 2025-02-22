const express = require("express");
const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from server");
});
app.get("/user", (re, res) => {
    res.send({ fname: "Yadnyesh", name: "rane" });
});
app.post("/post", (req, res) => {
    res.send("Dat added succesfully");
});
app.listen(3000, () => {
    console.log("Server is Listening");
});
