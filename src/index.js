const express = require("express");
const route = require("./routes/route");
const mongoose = require("mongoose");
const app = express();
const ErrorHandler = require("./errorHandler/errorHandler");
const port = 3000;
app.use(express.json());

mongoose
  .connect(
    "mongodb://dk7696822:wnyQpzrA3d4AcykC@ac-a7evnqw-shard-00-00.hef809l.mongodb.net:27017,ac-a7evnqw-shard-00-01.hef809l.mongodb.net:27017,ac-a7evnqw-shard-00-02.hef809l.mongodb.net:27017/group5Database?ssl=true&replicaSet=atlas-lqhhsx-shard-0&authSource=admin&retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDB is Connected"))
  .catch((err) => console.log(err));

app.use("/", route);

app.listen(port, (req, res) => {
  console.log(`Express is Running on ${port}`);
});
app.use(ErrorHandler);
