const express=require('express');
const submitrouter=express.Router();
const usermiddleware=require("../middleware/middle")
const {submitcode, runcode, getAllSubmissions, postSubmissionAsSolution}=require("../controllers/usersubmission")




submitrouter.post("/submit/:id",usermiddleware,submitcode);
submitrouter.post("/run/:id",usermiddleware,runcode);
submitrouter.get("/history",usermiddleware,getAllSubmissions);
submitrouter.post("/post-as-solution/:submissionId",usermiddleware,postSubmissionAsSolution);



module.exports=submitrouter; 