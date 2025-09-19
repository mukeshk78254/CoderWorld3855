


const problem=require("../models/problem");
const submission=require("../models/submission");
const user=require("../models/users")
const {getlanguagebyid,submitbatch,submittoken}=require("../utils/problemutility")

const submitcode=async(req,res)=>{
// user ka id to jb hm usermiddleware se authenticate krenge to pta lg jayega usko hmlog ans1 ke form me rkhe hai wha se yha hm la denge
try{
   const userid=req.ans1.id ;
   const problemid=req.params.id ;
   const {code,language}=req.body; // ye req.body se pta lg jayega jo hm bhejenge 

   if(!userid || !problemid || !code || !language)//i.e. agr undefined aa jaye mtlb ki koi glat data hai 
    return res.status(400).send("some field missing or wrong") 

    if(language==='cpp')
    language='c++';

    // fetch the problem from databse bcz ki hmko ye problem ka hidden testcase bhi to lana padega
    const Problem = await problem.findById(problemid);
    
    if (!Problem) {
        return res.status(404).send("Problem not found");
    }

    if (!Problem.hiddentestcases || Problem.hiddentestcases.length === 0) {
        return res.status(400).send("No hidden test cases found for this problem");
    }

    // submit to judge 0
    const languageid = getlanguagebyid(language);
    
    if (!languageid) {
        return res.status(400).send("Unsupported language");
    }

    //apne submiossion ko db me store kro pehle 
    const submittedresult = await submission.create({
        userid,
        problemid,
        code,
        language,
        status:'pending',   // initially to pending hi krenge n code ko bcoz sare code ko start me db me dal rhe hai 
        testCasesTotal:Problem.hiddentestcases.length 
    })

    // hidden test cases ko dalenge judge o ke ander se to check my code 
    const submissions = Problem.hiddentestcases.map((testcase)=>({
        source_code:code,
        language_id:languageid,
        stdin:testcase.input,
        expected_output:testcase.output
    }));
    
    const submitresult = await submitbatch(submissions); // ye token dega as  a result now batch submission me hm log token to ek array me rakh kr bhejte 
    
    if (!submitresult || !Array.isArray(submitresult)) {
        submittedresult.status = 'error';
        submittedresult.errorMessage = 'Failed to submit code to judge';
        await submittedresult.save();
        return res.status(500).send("Failed to submit code to judge");
    }
    
    const resulttoken = submitresult.map((value)=>value.token)// return in the form of array like that :["dawertyuiopokj","ktredfghjklk","teyrujfcdvbnkgh"]
    
    const testresult = await submittoken(resulttoken);
    
    if (!testresult || !Array.isArray(testresult)) {
        submittedresult.status = 'error';
        submittedresult.errorMessage = 'Failed to get test results';
        await submittedresult.save();
        return res.status(500).send("Failed to get test results");
    }
    
    // pehle ye dekh lenge userproblem me se ki testresult me kya kya a rha hai console.log krne pr 
    // ab submitted result mo update maro

    let testCasesPassed=0,memory=0,runtime=0,status='accepted',errorMessage=null;
    for(const test of testresult){
        if(test.status.id==3){
            testCasesPassed++;
            runtime=runtime+ parseFloat(test.time);
            memory=Math.max(memory,test.memory);
        }
        else{
            if(test.status.id==4){
                status='error'
                errorMessage=test.stderr
            }
            else{
                status='wrong answer'
                errorMessage=test.stderr
            }
        }
    }
    // store updated testresult in db in submission

    submittedresult.status=status; 
    submittedresult.runtime=runtime; 
    submittedresult.memory=memory; 
    submittedresult.errorMessage=errorMessage; 
    submittedresult.testCasesPassed=testCasesPassed; 

    await submittedresult.save();  // db me isko save krdo jo result aaya hai ye jruri hai 

    //problem id ko dal kr dekhenge problemsolved user schema me agr wh present nhi to insert krenge  nhi to igmore
    //re.ans1 me user ka info rhta hai
    if( !req.ans1.problemsolved.includes(problemid)) { // agr iske andr nhi hai top upush kr do
        req.ans1.problemsolved.push(problemid)
        await req.ans1.save();}   // db me save kro 

    res.status(201).send(submittedresult);

}
catch(err){
    console.error("Submit code error:", err);
    
    // If MongoDB is not connected, return error instead of mock
    if (err.name === 'MongoNetworkError' || err.message.includes('connect')) {
        return res.status(500).send("Database connection failed. Please try again later.");
    }
    
    res.status(500).send("internal server error: " + err.message);
}
}


// run code ke liye same code use hoga submit code jaise bs database me save nhi krana hai submit ke jaise 


const runcode=async(req,res)=>{
// user ka id to jb hm usermiddleware se authenticate krenge to pta lg jayega usko hmlog ans1 ke form me rkhe hai wha se yha hm la denge
try{
   const userid=req.ans1.id ;
   const problemid=req.params.id ;
   const {code,language}=req.body; // ye req.body se pta lg jayega jo hm bhejenge 

   if(!userid || !problemid || !code || !language)//i.e. agr undefined aa jaye mtlb ki koi glat data hai 
    return res.status(400).send("some field missing or wrong") 

   if(language==='cpp')
    language='c++';
    
    // fetch the problem from databse bcz ki hmko ye problem ka hidden testcase bhi to lana pdega
    const Problem = await problem.findById(problemid);
    
    if (!Problem) {
        return res.status(404).send("Problem not found");
    }

    if (!Problem.visibletestcases || Problem.visibletestcases.length === 0) {
        return res.status(400).send("No visible test cases found for this problem");
    }

    // submit to judge 0
    const languageid = getlanguagebyid(language);
    
    if (!languageid) {
        return res.status(400).send("Unsupported language");
    }

    // visible test cases ko dalenge judge o ke ander se to check my code for run kyuki ye testcase sbko dikhta haui
    const submissions = Problem.visibletestcases.map((testcase)=>({
        source_code: code,
        language_id: languageid,
        stdin: testcase.input,
        expected_output: testcase.output
    }));
    
    const submitresult = await submitbatch(submissions); // ye token dega as  a result now batch submission me hm log token to ek array me rakh kr bhejte 
    
    if (!submitresult || !Array.isArray(submitresult)) {
        return res.status(500).send("Failed to submit code to judge");
    }
    
    const resulttoken = submitresult.map((value)=>value.token)// return in the form of array like that :["dawertyuiopokj","ktredfghjklk","teyrujfcdvbnkgh"]
    
    const testresult = await submittoken(resulttoken);
    
    if (!testresult || !Array.isArray(testresult)) {
        return res.status(500).send("Failed to get test results");
    }

    res.status(201).send(testresult);

}
catch(err){
    console.error("Run code error:", err);
    
    // If MongoDB is not connected, return error instead of mock
    if (err.name === 'MongoNetworkError' || err.message.includes('connect')) {
        return res.status(500).send("Database connection failed. Please try again later.");
    }
    
    res.status(500).send("internal server error: " + err.message);
}
}





module.exports={submitcode,runcode}