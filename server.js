const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const assignmentRoutes = require("./routes/assignmentRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/assignments", assignmentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});

app.get("/", (req, res) => {
  res.send("API is running...");
});
