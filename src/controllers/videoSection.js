const cloudinary = require('cloudinary').v2;
const problem = require("../models/problem");
const user = require("../models/users");
const SolutionVideo = require("../models/solutionVideo");
const { sanitizeFilter } = require('mongoose');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const generateUploadSignature = async (req, res) => {
  try {
    const { problemid } = req.params;
    
    const userid = req.ans1.id;
  
    const Problem = await problem.findById(problemid);
    if (!Problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

   
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `leetcode-solutions/${problemid}/${userid}_${timestamp}`;
    
  
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

  
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );

    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
    });

  } catch (error) {
    console.error('Error generating upload signature:', error);
    res.status(500).json({ error: 'Failed to generate upload credentials' });
  }
};


const saveVideoMetadata = async (req, res) => {
  try {
    const {
      problemid,
      cloudinaryPublicId,
      secureUrl,
      duration,
    } = req.body;

    const userid = req.ans1.id;

   
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: 'video' }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: 'Video not found on Cloudinary' });
    }


    const existingVideo = await SolutionVideo.findOne({
      problemid,
      userid,
      cloudinaryPublicId
    });

    if (existingVideo) {
      return res.status(409).json({ error: 'Video already exists' });
    }

  

    const thumbnailUrl = cloudinary.image("snow_deer.gif", {resource_type: "video"})
 

  
    const videoSolution = await SolutionVideo.create({
      problemid,
      userid,
      cloudinaryPublicId,
      secureUrl,
      duration: cloudinaryResource.duration || duration,
      thumbnailUrl
    });


    res.status(201).json({
      message: 'Video solution saved successfully',
      videoSolution: {
        id: videoSolution.id,
        thumbnailUrl: videoSolution.thumbnailUrl,
      secureUrl: videoSolution.secureUrl,

        duration: videoSolution.duration,
        uploadedAt: videoSolution.createdAt
      }
    });

  } catch (error) {
    console.error('Error saving video metadata:', error);
    res.status(500).json({ error: 'Failed to save video metadata' });
  }
};


const deleteVideo = async (req, res) => {
  try {
    const { problemid } = req.params;
    const userid = req.ans1.id;

    const video = await SolutionVideo.findOneAndDelete({problemid:problemid});
    
   

    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    await cloudinary.uploader.destroy(video.cloudinaryPublicId, { resource_type: 'video' , invalidate: true });

    res.json({ message: 'Video deleted successfully' });

  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};

module.exports = {generateUploadSignature,saveVideoMetadata,deleteVideo};
