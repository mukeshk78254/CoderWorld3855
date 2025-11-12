    const express=require('express');
    const problemrouter=express.Router();
    const adminmiddleware=require("../middleware/adminmiddle")
    const {createproblem,updateproblem,deleteproblem,getproblembyid,getallproblem,solvedallproblembyuser,submittedproblem,getSuggestedProblems} = require("../controllers/userproblem");
    const usermiddleware=require("../middleware/middle")
    
  
    problemrouter.post("/create",adminmiddleware,createproblem);
    problemrouter.put("/update/:id",adminmiddleware,updateproblem); 
    problemrouter.delete("/delete/:id",adminmiddleware,deleteproblem);

  
    problemrouter.get("/public/problembyid/:id",getproblembyid);  
    problemrouter.get("/public/getallproblem",getallproblem);  

  
    problemrouter.get("/problembyid/:id",usermiddleware,getproblembyid); 
    problemrouter.get("/getallproblem",usermiddleware,getallproblem); 
    
    problemrouter.get("/problemsolvedbyuser",usermiddleware,solvedallproblembyuser);
    problemrouter.get("/submittedproblem/:pid",usermiddleware,submittedproblem);
    problemrouter.get('/suggested', usermiddleware, getSuggestedProblems); 










    


module.exports=problemrouter



