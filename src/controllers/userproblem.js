const problem=require("../models/problem");
const User=require("../models/users")
const {getlanguagebyid,submitbatch,submittoken} =require("../utils/problemutility")
const Submission = require("../models/submission");
const SolutionVideo = require("../models/solutionVideo")




const createproblem=async(req,res)=>{

const{title,description,difficulty,tags,visibletestcases,hiddentestcases, refsolution,problemcreator}=req.body;  
  try{
   for(const {language,completecode} of refsolution){

    const languageid= getlanguagebyid(language);
// visibletestcase ke schema me jo input nad output hai usko map ke   help se nikalega aur hr ek object ke sath  ayega aur judge 0 ko jayega
    // const submission=visibletestcases.map((input,output)=>({  ye glat hai kyuki jis tarh se hm le rhe hai i/p and o/p waise hm elemnt and index lete hai to visibletestcase me sare uth kr aa jayenge phle index pr
    const submissions=visibletestcases.map((testcase)=>({

        source_code:completecode,
        language_id:languageid,
        stdin:testcase.input,
        expected_output:testcase.output
    }));
    const submitresult=await submitbatch(submissions); // ye token dega as  a result now batch submission me hm log token to ek array me rakh kr bhejte 

    const resulttoken=submitresult.map((value)=>value.token)// return in the form of array like that :["dawertyuiopokj","ktredfghjklk","teyrujfcdvbnkgh"]

    const testresult= await submittoken(resulttoken);

    for(const test of testresult ){
      if(test.status_id !== 3){
        return res.status(400).send("error occured "); // return bcoz iske bd koi ab nhi run hoga
      }
    }

   }
   // now jitna bhi error hoga sare for loop me ho gya hoga agr error aaya to yha aayega hi ngi so now we can store in db.

const userproblem =await problem.create({
  ...req.body,
  problemcreator:req.ans1.id// adminmiddleware se ye pta lg jayega admin ka id kya hai whi to hmne req me result ko save kraya tha ki bad me le ske
})

res.status(201).send("problem saved successfully");


  }
  catch(err){
   res.send("error1"+err);
  }
}

// jo bhi code aaya hoga ya update ho ya n a ho usko check krenge wh achhe se run ho rha hai ki nhi to jo hm create problem me bnaye hai to check whi simple isme bhi dal denge 
const updateproblem = async(req,res)=>{
   const {id}=req.params;
     const{title,description,difficulty,tags,visibletestcases,hiddentestcases, refsolution,problemcreator}=req.body;  
  try{
    // let say no any id 
    if(!id)
      return res.status(400).send("id is missing")
//let say id is not mathcing in server i.e.,any wrong id come
    const dsaprob=await problem.findById(id);
    if(!dsaprob)
      return res.status(404).send("id is not present in server")


   for(const {language,completecode} of refsolution){

    const languageid= getlanguagebyid(language);
// visibletestcase ke schema me jo input nad output hai usko map ke   help se nikalega aur hr ek object ke sath  ayega aur judge 0 ko jayega
    // const submission=visibletestcases.map((input,output)=>({  ye glat hai kyuki jis tarh se hm le rhe hai i/p and o/p waise hmelemnt and index lete hai to visibletestcase me sare uth kr aa jayenge phle index pr
    const submissions=visibletestcases.map((testcase)=>({

        source_code:completecode,
        language_id:languageid,
        stdin:testcase.input,
        expected_output:testcase.output
    }));
    const submitresult=await submitbatch(submissions); // ye token dega as  a result now batch submission me hm log token to ek array me rakh kr bhejte 

    const resulttoken=submitresult.map((value)=>value.token)// return in the form of array like that :["dawertyuiopokj","ktredfghjklk","teyrujfcdvbnkgh"]

    const testresult= await submittoken(resulttoken);

    for(const test of testresult ){
      if(test.status_id !== 3){
        return res.status(400).send("error occured "); // return bcoz iske bd koi ab nhi run hoga
      }
    }

  }
   // now jitna bhi error hoga sare for loop me ho gya hoga agr error aaya to yha aayega hi ngi so now we can store in db.




  //  is wale me id me update kro jo jo req.body me update hoga aur update se phle validate kr len ai.e., firstlength>3 and soon and update ke bad jo doc mile use return kr do
const newupdatedproblem=await problem.findByIdAndUpdate(id,{...req.body},{runValidators:true,new:true});
res.status(200).send(newupdatedproblem);
  }


catch(err){
  res.status(500).send("error"+err)
}
}

const deleteproblem=async(req,res)=>{
  // kis priblem wale me id me delete krna hai  
 try{
  const {id}=req.params;
  if(!id)
    return res.status(400).send("id is missing");

  // agr id mil jaye to delete kr do problem se 


  const deletedproblem=await problem.findByIdAndDelete(id);
  if(!deletedproblem)
    return res.status(404).send("problem is not there correspond to this id");
  res.status(200).send("successful deleted");

 }
 catch(err){
  res.send("error"+err);
 }
}
const getproblembyid=async(req,res)=>{
  // kis priblem wale me id ke according get krne hai  
 try{
  const {id}=req.params;
  if(!id)
    return res.status(400).send("id is missing");

  

  // id se find krenge to sare data front end ko dedega jaise hidden tets case but actually me deta nhi hai so we select those thing those frontend required.
  const getproblem=await problem.findById(id).select('id title description tags difficulty visibletestcases startcode refsolution ');
  // video ka jo bhi url wagera le aao
 
    if(!getproblem)
     return res.status(404).send("Problem is Missing");
 
    const videos = await SolutionVideo.findOne({problemid:id});
 
     if(videos){   
    
   const responseData = {
    ...getproblem.toObject(),
    secureUrl:videos.secureUrl,
    thumbnailUrl : videos.thumbnailUrl,
    duration : videos.duration,
   } 
  
   return res.status(200).send(responseData);
   }
   res.status(200).send(getproblem);

 }
 catch(err){
  res.status(500).send("error"+err);
 }
}
const getallproblem=async(req,res)=>{
  // kis priblem wale me id ke according get krne hai  
 try{
 

  

// jitne bhi problem hai usko ek empty arry me daldo aur fetch kr do
  const getproblem=await problem.find({}).select('id title difficulty tags');
  if(getproblem.length==0)
    return res.status(404).send("problem is missing");
  res.status(200).send(getproblem);

 }
 catch(err){
  res.status(500).send("error"+err);
 }
}

// kitna user problem solved kiya hai ye to simple hai sirf dekh lo problemsolved ka length hai basicallw wh to eka array hai jisne sare unique problem id jo solve ho gye hai usko rkha hai to wh length de dega ki kitna solve hua hai
const solvedallproblembyuser=async(req,res)=>{
  try{ // usermiddlewares se pas kiye to user ke sare id and usko info store hai req.ans1 me
    const userid=req.ans1.id;
    
    // Check if user exists
    const userData = await User.findById(userid);
    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Use proper field name (problemsSolved not problemsolved)
    const user = await User.findById(userid).populate({
      path: "problemsSolved", // Correct field name based on your schema
      select: "title difficulty tags" // Include ID by default
    });
    
    // Check if problemsSolved exists and is an array
    if (!user.problemsSolved) {
      return res.status(200).json([]);
    }
    
    return res.status(200).json({
      problems: user.problemsSolved,
      count: user.problemsSolved.length
    });
  }
  catch(err){
    console.error("Error in solvedallproblembyuser:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const submittedproblem=async(req,res)=>{
 try{
   const userid=req.ans1.id;
   const problemid=req.params.pid;

   const ans=await Submission.find({userid,problemid}).sort({createdAt: -1});
   if(ans.length==0) {
     return res.status(200).json([]);  // Return an empty array instead of a string
   }

   return res.status(200).json(ans);  // Use json() for proper content type
 }
 catch(err){
   console.error("Error in submittedproblem:", err);
   return res.status(500).send("Internal server error");  // 500 is more appropriate than 501
 }

}

const getSuggestedProblems = async (req, res) => {
    try {
        const userId = req.ans1.id;
        const userData = await user.findById(userId).select('problemsSolved').lean();
        const solvedProblemIds = userData?.problemsSolved || [];

        // Find 3 random problems that the user has NOT solved
        const suggestedProblems = await problem.aggregate([
            { $match: { _id: { $nin: solvedProblemIds } } }, // Exclude solved problems
            { $sample: { size: 3 } }                         // Get 3 random documents
        ]).exec();
        
        res.status(200).json(suggestedProblems);
    } catch (err) {
        console.error("Error fetching suggested problems:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};


// Update your exports to include the new function
module.exports = { 
    createproblem, 
    updateproblem, 
    deleteproblem, 
    getproblembyid, 
    getallproblem, 
    solvedallproblembyuser, 
    submittedproblem,
    getSuggestedProblems, // <-- **ADD THIS EXPORT**
};






// module.exports={createproblem,updateproblem,deleteproblem,getproblembyid,getallproblem,solvedallproblembyuser,submittedproblem};





















// // //   {
// // //     "source_code": "#include <stdio.h>\n\nint main(void) {\n  char name[10];\n  scanf(\"%s\", name);\n  printf(\"hello, %s\n\", name);\n  return 0;\n}",
// // //     "language_id": 4,
// // //     "stdin": "world"
// // //   }


// // 1

// wrong code 

// // const problem = require("../models/problem");
// // const User = require("../models/users"); // Corrected model name
// // const { getlanguagebyid, submitbatch, submittoken } = require("../utils/problemutility");
// // const Submission = require("../models/submission");
// // const SolutionVideo = require("../models/solutionVideo");

// // const createproblem = async (req, res) => {
// //     const { title, description, difficulty, tags, visibletestcases, hiddentestcases, refsolution, problemcreator } = req.body;
// //     try {
// //         for (const { language, completecode } of refsolution) {
// //             const languageid = getlanguagebyid(language);
// //             const submissions = visibletestcases.map((testcase) => ({
// //                 source_code: completecode,
// //                 language_id: languageid,
// //                 stdin: testcase.input,
// //                 expected_output: testcase.output
// //             }));
// //             const submitresult = await submitbatch(submissions);
// //             const resulttoken = submitresult.map((value) => value.token);
// //             const testresult = await submittoken(resulttoken);
// //             for (const test of testresult) {
// //                 if (test.status_id !== 3) {
// //                     // --- FIX: Use return to exit immediately on error ---
// //                     return res.status(400).json({ message: "Reference solution failed on a test case." });
// //                 }
// //             }
// //         }
// //         await problem.create({
// //             ...req.body,
// //             problemcreator: req.ans1.id
// //         });
// //         res.status(201).json({ message: "Problem saved successfully" });
// //     } catch (err) {
// //         res.status(500).json({ message: "Server error: " + err.message });
// //     }
// // };

// // const updateproblem = async (req, res) => {
// //     const { id } = req.params;
// //     const { refsolution } = req.body;
// //     try {
// //         if (!id) return res.status(400).json({ message: "Problem ID is missing" });
// //         const dsaprob = await problem.findById(id);
// //         if (!dsaprob) return res.status(404).json({ message: "Problem not found in server" });

// //         if (refsolution && refsolution.length > 0) {
// //             for (const { language, completecode } of refsolution) {
// //                 const languageid = getlanguagebyid(language);
// //                 const submissions = req.body.visibletestcases.map((testcase) => ({
// //                     source_code: completecode,
// //                     language_id: languageid,
// //                     stdin: testcase.input,
// //                     expected_output: testcase.output
// //                 }));
// //                 const submitresult = await submitbatch(submissions);
// //                 const resulttoken = submitresult.map((value) => value.token);
// //                 const testresult = await submittoken(resulttoken);
// //                 for (const test of testresult) {
// //                     if (test.status_id !== 3) {
// //                          // --- FIX: Use return to exit immediately on error ---
// //                         return res.status(400).json({ message: "Updated reference solution failed on a test case." });
// //                     }
// //                 }
// //             }
// //         }
// //         const newupdatedproblem = await problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
// //         res.status(200).json(newupdatedproblem);
// //     } catch (err) {
// //         res.status(500).json({ message: "Server error: " + err.message });
// //     }
// // };

// // const deleteproblem = async (req, res) => {
// //     try {
// //         const { id } = req.params;
// //         if (!id) return res.status(400).json({ message: "ID is missing" });
// //         const deletedproblem = await problem.findByIdAndDelete(id);
// //         if (!deletedproblem) return res.status(404).json({ message: "Problem not found with this ID" });
// //         res.status(200).json({ message: "Successfully deleted" });
// //     } catch (err) {
// //         res.status(500).json({ message: "Server error: " + err.message });
// //     }
// // };

// // const getproblembyid = async (req, res) => {
// //     try {
// //         const { id } = req.params;
// //         if (!id) return res.status(400).json({ message: "ID is missing" });
// //         const getproblem = await problem.findById(id).select('id title description tags difficulty visibletestcases startcode refsolution ');
// //         if (!getproblem) return res.status(404).json({ message: "Problem is Missing" });
// //         const videos = await SolutionVideo.findOne({ problemid: id });
// //         if (videos) {
// //             const responseData = {
// //                 ...getproblem.toObject(),
// //                 secureUrl: videos.secureUrl,
// //                 thumbnailUrl: videos.thumbnailUrl,
// //                 duration: videos.duration,
// //             };
// //             return res.status(200).json(responseData);
// //         }
// //         res.status(200).json(getproblem);
// //     } catch (err) {
// //         res.status(500).json({ message: "Server error: " + err.message });
// //     }
// // };
// // const getallproblem = async (req, res) => {
// //   try {
// //     const getproblem = await problem.find({}).select('id title difficulty tags');

// //     // THIS IS THE BUG
// //     if (getproblem.length == 0) {
// //       return res.status(404).send("problem is missing"); 
// //     }
// //     // END OF BUG

// //     res.status(200).send(getproblem);
// //   } catch (err) {
// //     res.status(500).send("error" + err);
// //   }
// // }

// // const solvedallproblembyuser = async (req, res) => {
// //     try {
// //         const userid = req.ans1.id;
// //         const user = await User.findById(userid).populate({
// //             path: "problemsolved",
// //             select: "id title difficulty tags"
// //         });
// //         if (!user) {
// //             return res.status(404).json({ message: "User not found." });
// //         }
// //         res.status(200).json(user.problemsolved);
// //     } catch (err) {
// //         res.status(500).json({ message: "Server error: " + err.message });
// //     }
// // };

// // const submittedproblem = async (req, res) => {
// //     try {
// //         const userid = req.ans1.id;
// //         const problemid = req.params.pid;
// //         const ans = await Submission.find({ userid, problemid });
        
// //         // --- THIS IS THE MAIN FIX ---
// //         // If no submissions are found, we send a response AND return to stop the function.
// //         if (ans.length === 0) {
// //             // It's better to return an empty array, which the frontend can easily handle.
// //             return res.status(200).json([]);
// //         }
// //         // If submissions WERE found, this line is now safe to run.
// //         res.status(200).json(ans);
// //     } catch (err) {
// //         res.status(501).json({ message: "Internal server error: " + err.message });
// //     }
// // };

// // const getSuggestedProblems = async (req, res) => {
// //     try {
// //         const userId = req.ans1.id;
// //         const userData = await User.findById(userId).select('problemsSolved').lean();
// //         const solvedProblemIds = userData?.problemsSolved || [];
// //         const suggestedProblems = await problem.aggregate([
// //             { $match: { _id: { $nin: solvedProblemIds } } },
// //             { $sample: { size: 3 } }
// //         ]).exec();
// //         res.status(200).json(suggestedProblems);
// //     } catch (err) {
// //         console.error("Error fetching suggested problems:", err);
// //         res.status(500).json({ message: "Internal server error." });
// //     }
// // };

// // module.exports = {
// //     createproblem,
// //     updateproblem,
// //     deleteproblem,
// //     getproblembyid,
// //     getallproblem,
// //     solvedallproblembyuser,
// //     submittedproblem,
// //     getSuggestedProblems,
// // // };

// // const problem = require("../models/problem");
// // const User = require("../models/users");
// // const { getlanguagebyid, submitbatch, submittoken } = require("../utils/problemutility");
// // const Submission = require("../models/submission");
// // const SolutionVideo = require("../models/solutionVideo");

// // const createproblem = async (req, res) => {
// //     try {
// //         for (const { language, completecode } of req.body.refsolution) {
// //             const languageid = getlanguagebyid(language);
// //             const submissions = req.body.visibletestcases.map((testcase) => ({
// //                 source_code: completecode,
// //                 language_id: languageid,
// //                 stdin: testcase.input,
// //                 expected_output: testcase.output
// //             }));
// //             const submitresult = await submitbatch(submissions);
// //             const resulttoken = submitresult.map((value) => value.token);
// //             const testresult = await submittoken(resulttoken);
// //             for (const test of testresult) {
// //                 if (test.status_id !== 3) {
// //                     return res.status(400).json({ message: "Reference solution failed on a test case." });
// //                 }
// //             }
// //         }
// //         const newProblem = await problem.create({
// //             ...req.body,
// //             problemcreator: req.ans1.id
// //         });
// //         res.status(201).json({ message: "Problem saved successfully", problem: newProblem });
// //     } catch (err) {
// //         res.status(500).json({ message: "Server error: " + err.message });
// //     }
// // };

// // const updateproblem = async (req, res) => {
// //     try {
// //         const { id } = req.params;
// //         if (!id) return res.status(400).json({ message: "Problem ID is missing" });
// //         const dsaprob = await problem.findById(id);
// //         if (!dsaprob) return res.status(404).json({ message: "Problem not found in server" });

// //         if (req.body.refsolution && req.body.refsolution.length > 0) {
// //             for (const { language, completecode } of req.body.refsolution) {
// //                 // (Your validation logic for reference solution goes here...)
// //             }
// //         }
// //         const newupdatedproblem = await problem.findByIdAndUpdate(id, { ...req.body }, { runValidators: true, new: true });
// //         res.status(200).json(newupdatedproblem);
// //     } catch (err) {
// //         res.status(500).json({ message: "Server error: " + err.message });
// //     }
// // };

// // const deleteproblem = async (req, res) => {
// //     try {
// //         const { id } = req.params;
// //         if (!id) return res.status(400).json({ message: "ID is missing" });
// //         const deletedproblem = await problem.findByIdAndDelete(id);
// //         if (!deletedproblem) return res.status(404).json({ message: "Problem not found with this ID" });
// //         res.status(200).json({ message: "Successfully deleted" });
// //     } catch (err) {
// //         res.status(500).json({ message: "Server error: " + err.message });
// //     }
// // };

// // // const getproblembyid = async (req, res) => {
// // //     try {
// // //         const { id } = req.params;
// // //         if (!id) return res.status(400).json({ message: "ID is missing" });
// // //         const getproblem = await problem.findById(id).select('id title description tags difficulty visibletestcases startcode refsolution ');
// // //         if (!getproblem) return res.status(404).json({ message: "Problem is Missing" });
// // //         const videos = await SolutionVideo.findOne({ problemid: id });
// // //         if (videos) {
// // //             const responseData = {
// // //                 ...getproblem.toObject(),
// // //                 secureUrl: videos.secureUrl,
// // //                 thumbnailUrl: videos.thumbnailUrl,
// // //                 duration: videos.duration,
// // //             };
// // //             return res.status(200).json(responseData);
// // //         }
// // //         res.status(200).json(getproblem);
// // //     } catch (err) {
// // //         res.status(500).json({ message: "Server error: " + err.message });
// // //     }
// // // };

// // // const getallproblem = async (req, res) => {
// // //     try {
// // //         const allProblems = await problem.find({}).select('id title difficulty tags');
// // //         res.status(200).json(allProblems);
// // //     } catch (err) {
// // //         res.status(500).json({ message: "Server error: " + err.message });
// // //     }
// // // };

// // const getproblembyid=async(req,res)=>{
// //   // kis priblem wale me id ke according get krne hai  
// //  try{
// //   const {id}=req.params;
// //   if(!id)
// //     return res.status(400).send("id is missing");

  

// //   // id se find krenge to sare data front end ko dedega jaise hidden tets case but actually me deta nhi hai so we select those thing those frontend required.
// //   const getproblem=await problem.findById(id).select('id title description tags difficulty visibletestcases startcode refsolution ');
// //   // video ka jo bhi url wagera le aao
 
// //     if(!getproblem)
// //      return res.status(404).send("Problem is Missing");
 
// //     const videos = await SolutionVideo.findOne({problemid:id});
 
// //      if(videos){   
    
// //    const responseData = {
// //     ...getproblem.toObject(),
// //     secureUrl:videos.secureUrl,
// //     thumbnailUrl : videos.thumbnailUrl,
// //     duration : videos.duration,
// //    } 
  
// //    return res.status(200).send(responseData);
// //    }
// //    res.status(200).send(getproblem);

// //  }
// //  catch(err){
// //   res.status(500).send("error"+err);
// //  }
// // }
// // // const getallproblem=async(req,res)=>{
// // //   // kis priblem wale me id ke according get krne hai  
// // //  try{
 

  

// // // // jitne bhi problem hai usko ek empty arry me daldo aur fetch kr do
// // //   const getproblem=await problem.find({}).select('id title difficulty tags');
// // //   if(getproblem.length==0)
// // //     return res.status(404).send("problem is missing");
// // //   res.status(200).send(getproblem);

// // //  }
// // //  catch(err){
// // //   res.status(500).send("error"+err);
// // //  }
// // // }
// // const getallproblem = async (req, res) => {
// //   try {
// //     const getproblem = await problem.find({}).select('id title difficulty tags');

// //     // THIS IS THE BUG
// //     if (getproblem.length == 0) {
// //       return res.status(404).send("problem is missing"); 
// //     }
// //     // END OF BUG

// //     res.status(200).send(getproblem);
// //   } catch (err) {
// //     res.status(500).send("error" + err);
// //   }
// // }

// // // const solvedallproblembyuser = async (req, res) => {
// // //     try {
// // //         const userid = req.ans1.id;
// // //         const user = await User.findById(userid).populate({
// // //             path: "problemsolved",
// // //             select: "id title difficulty tags"
// // //         });
// // //         if (!user) {
// // //             return res.status(404).json({ message: "User not found." });
// // //         }
// // //         res.status(200).json(user.problemsolved);
// // //     } catch (err) {
// // //         res.status(500).json({ message: "Server error: " + err.message });
// // //     }
// // // };
// // // // const solvedallproblembyuser = async (req, res) => {
// // // //     try {
// // // //         const userid = req.ans1.id;
// // // //         const userData = await User.findById(userid).populate({
// // // //             // --- THIS IS THE FIX ---
// // // //             // The path must exactly match the field name in your Mongoose schema (`problemsSolved`).
// // // //             path: "problemsSolved",
// // // //             select: "_id title difficulty tags"
// // // //         });

// // // //         if (!userData) {
// // // //             return res.status(404).json({ message: "User not found" });
// // // //         }
        
// // // //         // Also ensure you are sending the correct property back and using .json()
// // // //         res.status(200).json(userData.problemsSolved || []);
// // // //     } catch (err) {
// // // //         res.status(500).json({ message: "Server error: " + err.message });
// // // //     }
// // // // };
// // const solvedallproblembyuser=async(req,res)=>{
// //   try{ // usermiddlewares se pas kiye to user ke sare id and usko info store hai req.ans1 me
// //   // const count =req.ans1.problemsolved.length;  // ye to sirf count dega agr hmo chahiye ki kaun kauns se problem solve kiya hai to use populate command

// //   const userid=req.ans1.id;
// //   const user=await User.findById(userid).populate({   // polulate se hota ye hai ye user jis problemsolved ka problem id  ko rfer krega uske sare detail ko lao
// //     path:"problemsolved",
// //     select:"id title difficulty tags"
// //   })
// //   res.status(200).send(user.problemsolved);  // fronetnd me whi dekho jo kam ka hai bs jaise problemsolved difficulty usliye select use 
// //   }
// //   catch(err){
// //   res.status(500).send("error : "+ err)
// //   }
// // }
// // // const solvedallproblembyuser = async (req, res) => {
// // //   try {
// // //     const userid = req.ans1.id;

// // //     const user = await User.findById(userid).populate({
// // //       path: "problemsolved", // ✅ Must match your schema
// // //       select: "_id title difficulty tags"
// // //     });

// // //     if (!user) {
// // //       return res.status(404).json({ message: "User not found" });
// // //     }

// // //     res.status(200).json(user.problemsolved || []);
// // //   } catch (err) {
// // //     console.error("Error in solvedallproblembyuser:", err);
// // //     res.status(500).json({ message: "Internal Server Error", error: err.message });
// // //   }
// // // };


// // const submittedproblem = async (req, res) => {
// //     try {
// //         const userid = req.ans1.id;
// //         const problemid = req.params.pid;
// //         const allSubmissions = await Submission.find({ userid, problemid });
// //         res.status(200).json(allSubmissions);
// //     } catch (err) {
// //         res.status(501).json({ message: "Internal server error: " + err.message });
// //     }
// // };

// // const getSuggestedProblems = async (req, res) => {
// //     try {
// //         const userId = req.ans1.id;
// //         const userData = await User.findById(userId).select('problemsSolved').lean();
// //         const solvedProblemIds = userData?.problemsSolved || [];
// //         const suggestedProblems = await problem.aggregate([
// //             { $match: { _id: { $nin: solvedProblemIds } } },
// //             { $sample: { size: 3 } }
// //         ]).exec();
// //         res.status(200).json(suggestedProblems);
// //     } catch (err) {
// //         console.error("Error fetching suggested problems:", err);
// //         res.status(500).json({ message: "Internal server error." });
// //     }
// // };

// // module.exports = {
// //     createproblem,
// //     updateproblem,
// //     deleteproblem,
// //     getproblembyid,
// //     getallproblem,
// //     solvedallproblembyuser,
// //     submittedproblem,
// //     getSuggestedProblems,
// // };


// const problem = require("../models/problem");
// const User = require("../models/users"); // Corrected to match common Mongoose model naming
// const { getlanguagebyid, submitbatch, submittoken } = require("../utils/problemutility"); // Ensure these utilities exist and work as expected
// const Submission = require("../models/submission");
// const SolutionVideo = require("../models/solutionVideo");

// // --- CREATE PROBLEM ---
// const createproblem = async (req, res) => {
//   const { title, description, difficulty, tags, visibletestcases, hiddentestcases, refsolution, problemcreator } = req.body; // problemcreator can be removed from destructuring as it's taken from req.ans1.id

//   try {
//     // --- Step 1: Validate Reference Solutions against Visible Test Cases ---
//     // This loop ensures that the provided reference solutions pass the visible test cases
//     // before the problem is saved.
//     if (!refsolution || refsolution.length === 0) {
//         return res.status(400).json({ message: "Reference solution is required." });
//     }
//     if (!visibletestcases || visibletestcases.length === 0) {
//         return res.status(400).json({ message: "Visible test cases are required to validate reference solution." });
//     }

//     for (const { language, completecode } of refsolution) {
//       const languageid = getlanguagebyid(language); // Utility to get language ID for Judge0

//       // Prepare submissions for batch testing
//       const submissions = visibletestcases.map((testcase) => ({
//         source_code: completecode,
//         language_id: languageid,
//         stdin: testcase.input,
//         expected_output: testcase.output
//       }));

//       const submitresult = await submitbatch(submissions); // Sends all test cases in a batch
//       const resulttokens = submitresult.map((value) => value.token); // Extract tokens from batch results

//       // Poll Judge0 for results using the tokens
//       const testresults = await submittoken(resulttokens);

//       // Check if all reference solution tests passed (status_id 3 usually means Accepted)
//       for (const test of testresults) {
//         if (test.status_id !== 3) {
//           // --- FIX: Return JSON and exit on first failure ---
//           return res.status(400).json({
//             message: `Reference solution for language "${language}" failed on a visible test case (Status ID: ${test.status_id}). Please check the solution.`,
//             testResult: test // Optionally send the specific test result for debugging
//           });
//         }
//       }
//     }

//     // --- Step 2: Save the problem to the database if all tests pass ---
//     const userproblem = await problem.create({
//       ...req.body, // Spread remaining properties from req.body
//       problemcreator: req.ans1.id // Get admin ID from middleware
//     });

//     // --- FIX: Return JSON success response ---
//     res.status(201).json({ message: "Problem saved successfully", problemId: userproblem._id });

//   } catch (err) {
//     console.error("Error creating problem:", err); // Log the error for server-side debugging
//     // --- FIX: Return JSON error response ---
//     res.status(500).json({ message: "Internal server error: " + err.message });
//   }
// }

// // --- UPDATE PROBLEM ---
// const updateproblem = async (req, res) => {
//   const { id } = req.params;
//   const { title, description, difficulty, tags, visibletestcases, hiddentestcases, refsolution } = req.body; // problemcreator should not be updated via this endpoint usually.

//   try {
//     if (!id) {
//       return res.status(400).json({ message: "Problem ID is missing." });
//     }

//     const existingProblem = await problem.findById(id);
//     if (!existingProblem) {
//       return res.status(404).json({ message: "Problem not found in server." });
//     }

//     // --- Conditional validation for reference solutions if they are being updated ---
//     // If refsolution is provided in the update, it must be validated.
//     // Use the *new* visibletestcases from req.body, or fall back to existing ones if not provided.
//     const testCasesToUse = visibletestcases || existingProblem.visibletestcases;

//     if (refsolution && refsolution.length > 0) {
//         if (!testCasesToUse || testCasesToUse.length === 0) {
//             return res.status(400).json({ message: "Cannot validate new reference solutions without visible test cases." });
//         }

//         for (const { language, completecode } of refsolution) {
//             const languageid = getlanguagebyid(language);
//             const submissions = testCasesToUse.map((testcase) => ({
//                 source_code: completecode,
//                 language_id: languageid,
//                 stdin: testcase.input,
//                 expected_output: testcase.output
//             }));
//             const submitresult = await submitbatch(submissions);
//             const resulttokens = submitresult.map((value) => value.token);
//             const testresults = await submittoken(resulttokens);

//             for (const test of testresults) {
//                 if (test.status_id !== 3) {
//                     // --- FIX: Return JSON and exit on failure ---
//                     return res.status(400).json({
//                         message: `Updated reference solution for language "${language}" failed on a visible test case (Status ID: ${test.status_id}). Please check the solution.`,
//                         testResult: test
//                     });
//                 }
//             }
//         }
//     }

//     // --- Update the problem in the database ---
//     const newupdatedproblem = await problem.findByIdAndUpdate(
//       id,
//       { ...req.body },
//       { runValidators: true, new: true } // runValidators ensures schema validation, new:true returns the updated doc
//     );

//     // --- FIX: Return JSON success response ---
//     res.status(200).json({ message: "Problem updated successfully", problem: newupdatedproblem });

//   } catch (err) {
//     console.error("Error updating problem:", err);
//     // --- FIX: Return JSON error response ---
//     res.status(500).json({ message: "Internal server error: " + err.message });
//   }
// }

// // --- DELETE PROBLEM ---
// const deleteproblem = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ message: "Problem ID is missing." });
//     }

//     const deletedproblem = await problem.findByIdAndDelete(id);
//     if (!deletedproblem) {
//       return res.status(404).json({ message: "Problem not found with this ID." });
//     }

//     // --- OPTIONAL: Delete related data (e.g., submissions, solution videos) ---
//     await Submission.deleteMany({ problemid: id });
//     await SolutionVideo.deleteOne({ problemid: id }); // Assuming one video per problem
//     console.log(`Deleted all submissions and solution videos for problem ${id}.`);


//     // --- FIX: Return JSON success response ---
//     res.status(200).json({ message: "Problem successfully deleted." });

//   } catch (err) {
//     console.error("Error deleting problem:", err);
//     // --- FIX: Return JSON error response ---
//     res.status(500).json({ message: "Internal server error: " + err.message });
//   }
// }

// // --- GET PROBLEM BY ID ---
// const getproblembyid = async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) {
//       return res.status(400).json({ message: "Problem ID is missing." });
//     }

//     // Selects specific fields to send to the frontend, excluding sensitive ones like hidden test cases or full refsolution code
//     const getproblem = await problem.findById(id).select('id title description tags difficulty visibletestcases startcode refsolution');
    
//     if (!getproblem) {
//       return res.status(404).json({ message: "Problem not found." });
//     }

//     const videos = await SolutionVideo.findOne({ problemid: id });

//     // If a solution video exists, include its details in the response
//     if (videos) {
//       const responseData = {
//         ...getproblem.toObject(), // Convert Mongoose document to plain JavaScript object
//         secureUrl: videos.secureUrl,
//         thumbnailUrl: videos.thumbnailUrl,
//         duration: videos.duration,
//       };
//       // --- FIX: Return JSON response ---
//       return res.status(200).json(responseData);
//     }
//     // If no video, just return the problem data
//     res.status(200).json(getproblem);

//   } catch (err) {
//     console.error("Error getting problem by ID:", err);
//     // --- FIX: Return JSON error response ---
//     res.status(500).json({ message: "Internal server error: " + err.message });
//   }
// }

// // --- GET ALL PROBLEMS ---
// const getallproblem = async (req, res) => {
//   try {
//     // Selects specific fields to send to the frontend for a list view
//     const allProblems = await problem.find({}).select('id title difficulty tags');

//     // --- FIX: Return 200 OK with an empty array if no problems are found ---
//     // A 404 status implies the endpoint itself doesn't exist or cannot find the 'collection',
//     // whereas an empty array means the 'collection' exists but is currently empty.
//     res.status(200).json(allProblems);

//   } catch (err) {
//     console.error("Error getting all problems:", err);
//     // --- FIX: Return JSON error response ---
//     res.status(500).json({ message: "Internal server error: " + err.message });
//   }
// }

// // --- GET ALL SOLVED PROBLEMS BY USER ---
// const solvedallproblembyuser = async (req, res) => {
//   try {
//     const userid = req.ans1.id; // Get user ID from authenticated middleware

//     // Populate the 'problemsSolved' field to get details of solved problems
//     const userWithSolvedProblems = await User.findById(userid).populate({
//       // --- FIX: Ensure 'path' matches your Mongoose schema's field name for the array of solved problems ---
//       // Common names are 'problemsSolved', 'solvedProblems', 'problems_solved'.
//       // Based on previous context, 'problemsSolved' is likely correct.
//       path: "problemsSolved", // Assuming your User schema has a 'problemsSolved' field referencing Problem model
//       select: "_id title difficulty tags" // MongoDB uses _id, not 'id'
//     }).lean(); // .lean() for plain JS objects, faster for reads if not modifying.

//     if (!userWithSolvedProblems) {
//         return res.status(404).json({ message: "User not found." });
//     }

//     // Return the array of solved problems (or an empty array if none)
//     res.status(200).json(userWithSolvedProblems.problemsSolved || []);

//   } catch (err) {
//     console.error("Error fetching solved problems for user:", err);
//     // --- FIX: Return JSON error response ---
//     res.status(500).json({ message: "Internal server error: " + err.message });
//   }
// }

// // --- GET SUBMITTED PROBLEMS BY USER FOR A SPECIFIC PROBLEM ---
// const submittedproblem = async (req, res) => {
//   try {
//     const userid = req.ans1.id;
//     const problemid = req.params.pid; // Problem ID from URL parameters

//     const submissions = await Submission.find({ userid, problemid }).sort({ createdAt: -1 }); // Sort by newest first

//     // --- FIX: Always return an array (empty if no submissions), not a string message ---
//     // This avoids "Headers already sent" error and provides consistent API response type.
//     if (submissions.length === 0) {
//       return res.status(200).json([]); // Return empty array if no submissions found
//     }

//     res.status(200).json(submissions); // Return found submissions

//   } catch (err) {
//     console.error("Error fetching user submissions for problem:", err);
//     // --- FIX: Return JSON error response with appropriate status code ---
//     res.status(500).json({ message: "Internal server error: " + err.message });
//   }
// }

// // --- GET SUGGESTED PROBLEMS FOR USER ---
// const getSuggestedProblems = async (req, res) => {
//     try {
//         const userId = req.ans1.id;
//         const userData = await User.findById(userId).select('problemsSolved').lean();
//         const solvedProblemIds = userData?.problemsSolved || [];

//         // Find 3 random problems that the user has NOT solved
//         const suggestedProblems = await problem.aggregate([
//             { $match: { _id: { $nin: solvedProblemIds } } }, // Exclude problems user has already solved
//             { $sample: { size: 3 } }                         // Get 3 random documents
//         ]).exec();
        
//         res.status(200).json(suggestedProblems);
//     } catch (err) {
//         console.error("Error fetching suggested problems:", err);
//         res.status(500).json({ message: "Internal server error." });
//     }
// };

// // --- EXPORT ALL CONTROLLER FUNCTIONS ---
// module.exports = {
//     createproblem,
//     updateproblem,
//     deleteproblem,
//     getproblembyid,
//     getallproblem,
//     solvedallproblembyuser,
//     submittedproblem,
//     getSuggestedProblems,
// };