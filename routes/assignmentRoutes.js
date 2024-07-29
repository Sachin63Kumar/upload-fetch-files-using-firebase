const express = require("express");
const router = express.Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const Assignment = require("../models/Assignment");
const bucket = require("../config/firebase");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB file size limit
});

router.post("/create", upload.single("file"), async (req, res) => {
  try {
    let fileUrl = "";

    if (req.file) {
      const blob = bucket.file(
        `assignment/${uuidv4()}-${req.file.originalname}`
      );
      const blobStream = blob.createWriteStream({
        metadata: {
          contentType: req.file.mimetype,
        },
      });

      blobStream.on("error", (error) => {
        res.status(500).json({ error: error.message });
      });

      blobStream.on("finish", async () => {
        fileUrl = `https://firebasestorage.googleapis.com/v0/b/${
          bucket.name
        }/o/${encodeURIComponent(blob.name)}?alt=media`;

        const assignment = new Assignment({
          title: req.body.title,
          instructions: req.body.instructions,
          fileUrl: fileUrl,
          deadline: req.body.deadline,
          marks: req.body.marks,
        });

        await assignment.save();
        res.status(201).json(assignment);
      });

      blobStream.end(req.file.buffer);
    } else {
      res.status(400).json({ error: "File is required" });
    }
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const assignments = await Assignment.find();
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
