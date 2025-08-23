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
    // Verify problem exists
    const Problem = await problem.findById(problemid);
    if (!Problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }

    // Generate unique public_id for the video
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `leetcode-solutions/${problemid}/${userid}_${timestamp}`;
    
    // Upload parameters
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId,
    };

    // Generate signature
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

    // Verify the upload with Cloudinary
    const cloudinaryResource = await cloudinary.api.resource(
      cloudinaryPublicId,
      { resource_type: 'video' }
    );

    if (!cloudinaryResource) {
      return res.status(400).json({ error: 'Video not found on Cloudinary' });
    }

    // Check if video already exists for this problem and user
    const existingVideo = await SolutionVideo.findOne({
      problemid,
      userid,
      cloudinaryPublicId
    });

    if (existingVideo) {
      return res.status(409).json({ error: 'Video already exists' });
    }

    // const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
    // resource_type: 'video',  
    // transformation: [
    // { width: 400, height: 225, crop: 'fill' },
    // { quality: 'auto' },
    // { start_offset: 'auto' }  
    // ],
    // format: 'jpg'
    // });

    const thumbnailUrl = cloudinary.image("snow_deer.gif", {resource_type: "video"})
 

    // Create video solution record
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
// // // const clo

// // const cloudinary = require('cloudinary').v2;
// // const problem = require("../models/problem");
// // const user = require("../models/users"); // Assuming 'users' model, not 'user'
// // const SolutionVideo = require("../models/solutionVideo");
// // // const { sanitizeFilter } = require('mongoose'); // Not used, can be removed

// // cloudinary.config({
// //   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //   api_key: process.env.CLOUDINARY_API_KEY,
// //   api_secret: process.env.CLOUDINARY_API_SECRET
// // });

// // const generateUploadSignature = async (req, res) => {
// //   try {
// //     const { problemid } = req.params;
    
// //     // Ensure req.ans1 (from adminmiddleware) provides the user ID
// //     const userid = req.ans1.id; 
    
// //     // Verify problem exists
// //     const Problem = await problem.findById(problemid);
// //     if (!Problem) {
// //       return res.status(404).json({ error: 'Problem not found' });
// //     }

// //     // Check if a video already exists for this problem (and potentially user)
// //     // If you want only ONE video solution per problem across all admins:
// //     const existingVideo = await SolutionVideo.findOne({ problemid });
// //     if (existingVideo) {
// //       return res.status(409).json({ error: 'A video solution already exists for this problem. Please delete the existing one first if you wish to upload a new one.' });
// //     }
// //     // If you want one video solution PER ADMIN per problem, use:
// //     // const existingVideo = await SolutionVideo.findOne({ problemid, userid });
// //     // if (existingVideo) { ... }

// //     // Generate unique public_id for the video
// //     // Recommended format: leetcode-solutions/problem_<id>/user_<id>_<timestamp>
// //     const timestamp = Math.round(new Date().getTime() / 1000);
// //     const publicId = `leetcode-solutions/problem_${problemid}/solution_by_${userid}_${timestamp}`;
    
// //     // Upload parameters for Cloudinary (must match what client sends)
// //     const uploadParams = {
// //       timestamp: timestamp,
// //       public_id: publicId,
// //       // You can add more parameters here if needed, e.g., eager transformations
// //       // eager: [
// //       //   { width: 400, height: 225, crop: 'fill', format: 'jpg' } // For a thumbnail directly on upload
// //       // ]
// //     };

// //     // Generate signature
// //     const signature = cloudinary.utils.api_sign_request(
// //       uploadParams,
// //       process.env.CLOUDINARY_API_SECRET
// //     );

// //     res.json({
// //       signature,
// //       timestamp,
// //       public_id: publicId,
// //       api_key: process.env.CLOUDINARY_API_KEY,
// //       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
// //       upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
// //     });

// //   } catch (error) {
// //     console.error('Error generating upload signature:', error);
// //     res.status(500).json({ error: 'Failed to generate upload credentials' });
// //   }
// // };


// // const saveVideoMetadata = async (req, res) => {
// //   try {
// //     const {
// //       problemid,
// //       cloudinaryPublicId,
// //       secureUrl,
// //       duration,
// //       // You might also get thumbnailUrl from client if it's generated there,
// //       // but generating on server is safer.
// //     } = req.body;

// //     const userid = req.ans1.id;

// //     // Verify the upload with Cloudinary (Optional, but good for security and consistency)
// //     // This makes an API call to Cloudinary to ensure the video actually exists
// //     let cloudinaryResource;
// //     try {
// //         cloudinaryResource = await cloudinary.api.resource(
// //             cloudinaryPublicId,
// //             { resource_type: 'video' } // Specify resource_type to avoid conflicts
// //         );
// //     } catch (cloudinaryErr) {
// //         console.error("Cloudinary resource verification failed:", cloudinaryErr);
// //         return res.status(400).json({ error: 'Video resource could not be verified on Cloudinary.' });
// //     }

// //     if (!cloudinaryResource || cloudinaryResource.secure_url !== secureUrl) {
// //         return res.status(400).json({ error: 'Video details do not match Cloudinary record.' });
// //     }

// //     // Check if video already exists for this problem (and potentially user)
// //     // Consistent with the check in generateUploadSignature
// //     const existingVideo = await SolutionVideo.findOne({ problemid }); // Assuming one video per problem
// //     // If one video per problem PER USER: await SolutionVideo.findOne({ problemid, userid });
    
// //     if (existingVideo) {
// //       return res.status(409).json({ error: 'A video solution already exists for this problem. Please delete the existing one first if you wish to upload a new one.' });
// //     }
    
// //     // --- CORRECT WAY TO GENERATE THUMBNAIL FROM THE UPLOADED VIDEO ---
// //     // Generate a thumbnail URL from the uploaded video's public ID
// //     // You can customize transformation parameters as needed
// //     const thumbnailUrl = cloudinary.url(cloudinaryResource.public_id, {
// //         resource_type: 'video',
// //         format: 'jpg', // Desired format for the thumbnail
// //         width: 400,
// //         height: 225,
// //         crop: 'fill', // Crop to fill the specified dimensions
// //         quality: 'auto:eco', // Optimize quality
// //         fetch_format: 'auto',
// //         // start_offset: 'auto' or a specific time (e.g., '10' for 10 seconds in)
// //         start_offset: 0 // Get frame from the very beginning
// //     });

// //     // Create video solution record
// //     const videoSolution = await SolutionVideo.create({
// //       problemid,
// //       userid,
// //       cloudinaryPublicId,
// //       secureUrl,
// //       duration: cloudinaryResource.duration || duration, // Prefer Cloudinary's reported duration
// //       thumbnailUrl
// //     });

// //     res.status(201).json({
// //       message: 'Video solution saved successfully',
// //       videoSolution: {
// //         id: videoSolution._id, // Use _id for consistency
// //         thumbnailUrl: videoSolution.thumbnailUrl,
// //         secureUrl: videoSolution.secureUrl,
// //         duration: videoSolution.duration,
// //         uploadedAt: videoSolution.createdAt
// //       }
// //     });

// //   } catch (error) {
// //     console.error('Error saving video metadata:', error);
// //     // Be more specific with error messages if possible
// //     res.status(500).json({ error: 'Failed to save video metadata. ' + error.message });
// //   }
// // };


// // const deleteVideo = async (req, res) => {
// //   try {
// //     const { problemid } = req.params;
// //     // const userid = req.ans1.id; // Only needed if deleting *user-specific* videos

// //     // Find and delete the video solution linked to this problem
// //     // Assuming you want to delete THE video solution for this problem, regardless of who uploaded it (as long as an admin does it).
// //     // If it's specific to the UPLOADING ADMIN, then add userid to the query:
// //     // const video = await SolutionVideo.findOneAndDelete({ problemid: problemid, userid: userid });
// //     const video = await SolutionVideo.findOneAndDelete({ problemid: problemid });
    
// //     if (!video) {
// //       return res.status(404).json({ error: 'No video solution found for this problem.' });
// //     }

// //     // Destroy the video from Cloudinary using its public ID
// //     await cloudinary.uploader.destroy(video.cloudinaryPublicId, { 
// //       resource_type: 'video', 
// //       invalidate: true // Invalidate CDN caches
// //     });

// //     res.json({ message: 'Video solution deleted successfully' });

// //   } catch (error) {
// //     console.error('Error deleting video:', error);
// //     res.status(500).json({ error: 'Failed to delete video. ' + error.message });
// //   }
// // };

// // module.exports = {generateUploadSignature, saveVideoMetadata, deleteVideo};



// const cloudinary = require('cloudinary').v2;
// const Problem = require("../models/problem");
// const User = require("../models/users");
// const SolutionVideo = require("../models/solutionVideo");

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// // ====================== SIGNATURE FOR CLIENT ======================
// const generateUploadSignature = async (req, res) => {
//   try {
//     const { problemid } = req.params;
//     const userid = req.ans1.id;

//     const foundProblem = await Problem.findById(problemid);
//     if (!foundProblem) {
//       return res.status(404).json({ error: 'Problem not found' });
//     }

//     const timestamp = Math.round(new Date().getTime() / 1000);
//     const publicId = `leetcode-solutions/${problemid}/${userid}_${timestamp}`;

//     const signature = cloudinary.utils.api_sign_request(
//       { timestamp, public_id: publicId },
//       process.env.CLOUDINARY_API_SECRET
//     );

//     res.json({
//       signature,
//       timestamp,
//       public_id: publicId,
//       api_key: process.env.CLOUDINARY_API_KEY,
//       cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//       upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`,
//     });

//   } catch (err) {
//     console.error('Error generating Cloudinary signature:', err);
//     res.status(500).json({ error: 'Server error while generating signature' });
//   }
// };

// // ====================== SAVE VIDEO METADATA ======================
// const saveVideoMetadata = async (req, res) => {
//   try {
//     const { problemid, cloudinaryPublicId, secureUrl, duration } = req.body;
//     const userid = req.ans1.id;

//     if (!cloudinaryPublicId || !secureUrl || !problemid) {
//       return res.status(400).json({ error: 'Missing required fields' });
//     }

//     let cloudinaryResource;
//     try {
//       cloudinaryResource = await cloudinary.api.resource(cloudinaryPublicId, { resource_type: 'video' });
//     } catch (err) {
//       console.error('Cloudinary resource fetch failed:', err);
//       return res.status(400).json({ error: 'Could not verify video on Cloudinary' });
//     }

//     const alreadyExists = await SolutionVideo.findOne({ problemid, userid, cloudinaryPublicId });
//     if (alreadyExists) {
//       return res.status(409).json({ error: 'Duplicate video already exists' });
//     }

//     const thumbnailUrl = cloudinary.url(cloudinaryPublicId + ".jpg", {
//       resource_type: "video",
//       transformation: [{ width: 400, height: 225, crop: "fill" }]
//     });

//     const newVideo = await SolutionVideo.create({
//       problemid,
//       userid,
//       cloudinaryPublicId,
//       secureUrl,
//       duration: cloudinaryResource.duration || duration,
//       thumbnailUrl
//     });

//     res.status(201).json({
//       message: "Video saved successfully",
//       videoSolution: {
//         id: newVideo.id,
//         thumbnailUrl: newVideo.thumbnailUrl,
//         secureUrl: newVideo.secureUrl,
//         duration: newVideo.duration,
//         uploadedAt: newVideo.createdAt
//       }
//     });

//   } catch (err) {
//     console.error("Error saving video metadata:", err);
//     res.status(500).json({ error: "Internal server error while saving video" });
//   }
// };

// // ====================== DELETE VIDEO ======================
// const deleteVideo = async (req, res) => {
//   try {
//     const { problemid } = req.params;
//     const userid = req.ans1.id;

//     const video = await SolutionVideo.findOneAndDelete({ problemid, userid });
//     if (!video) {
//       return res.status(404).json({ error: "Video not found" });
//     }

//     await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
//       resource_type: "video",
//       invalidate: true,
//     });

//     res.json({ message: "Video deleted successfully" });
//   } catch (err) {
//     console.error("Error deleting video:", err);
//     res.status(500).json({ error: "Internal server error while deleting video" });
//   }
// };

// module.exports = {
//   generateUploadSignature,
//   saveVideoMetadata,
//   deleteVideo,
// };
