    const express=require('express');
    const problemrouter=express.Router();
    const adminmiddleware=require("../middleware/adminmiddle")
    const {createproblem,updateproblem,deleteproblem,getproblembyid,getallproblem,solvedallproblembyuser,submittedproblem,getSuggestedProblems} = require("../controllers/userproblem");
    const usermiddleware=require("../middleware/middle")
    
    
    
    
    // create problem  // ADMIN 
    problemrouter.post("/create",adminmiddleware,createproblem);
    problemrouter.put("/update/:id",adminmiddleware,updateproblem); // put for updation bcoz pura data aata hai hmare pas usme jo update krna hai hoga aur pura data jta hai server ko
    problemrouter.delete("/delete/:id",adminmiddleware,deleteproblem);

  // KOI BHI

    problemrouter.get("/problembyid/:id",usermiddleware,getproblembyid);  // kisi specific problem k0 fetch
    problemrouter.get("/getallproblem",usermiddleware,getallproblem);  //sare problem k0 fetch 
    // wo problem jo user ne solve kr loya hai
    problemrouter.get("/problemsolvedbyuser",usermiddleware,solvedallproblembyuser);
    problemrouter.get("/submittedproblem/:pid",usermiddleware,submittedproblem);
    problemrouter.get('/suggested', usermiddleware, getSuggestedProblems); 










    // fetch problem





    // delete problem
    // update problem



module.exports=problemrouter



