const express = require('express');
const adminmiddleware = require('../middleware/adminmiddle');
const videoRouter =  express.Router();
const {generateUploadSignature,saveVideoMetadata,deleteVideo} = require("../controllers/videoSection")

videoRouter.get("/create/:problemid",adminmiddleware,generateUploadSignature);
videoRouter.post("/save",adminmiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:problemid",adminmiddleware,deleteVideo);


module.exports = videoRouter;