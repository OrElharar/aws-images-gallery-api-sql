const cors = require('cors')
const express = require("express")

const imageRouter = require("./routers/imageRouter");

const app = express();

app.use(express.json());
app.use(cors());
app.use(imageRouter);
app.use("/", (req, res) => {
    res.send("ok")
})

module.exports = app;