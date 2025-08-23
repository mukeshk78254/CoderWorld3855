
const axios = require('axios');
const getlanguagebyid=(lang)=>{

    const language={
        "c++":105,
        "java":91,
        "javascript":63
    }
    return language[lang.toLowerCase()];

}



// JUDGE 0 ME KAISE SUBMISSION KRTE HAI APNE SUBMISSION KO


const submitbatch=async(submissions)=>{
   

    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
      params: {
        base64_encoded: 'false'
      },
      headers: {
        'x-rapidapi-key': 'b7055c95acmsh34946e84e4e6f61p1448adjsn7ebce46cd253',
        'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        submissions
      }
    };
    
    async function fetchData() {
        try {
            const response = await axios.request(options);
           return response.data;
        } catch (error) {
            console.error(error);
        }
    }
    
   return  await fetchData();  // ye as a response ek token lakr deta hai hr ek submission ke regard phir us token ko getrequest marenge agr wh status id return me 3 de diya to code accepted  
}


const waiting=async(timer)=>{
  setTimeout(()=>{
    return 1;
  },timer);
}

const submittoken=async(restokens)=>{



  

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: restokens.join(","),  // jitne bhi tokan hai result me usko comma se seprate kro 
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'b7055c95acmsh34946e84e4e6f61p1448adjsn7ebce46cd253',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		return response.data;
	} catch (error) {
		console.error(error);
	}
}
    while(true){
const result=await fetchData();  // check result if status is is 1 and 2 then give this again bcon it means that it is underprocess or processing. 
 const isresultobtained=result.submissions.every((r)=>r.status_id>2);  // ye nsubmissions aise hi format me atta hai krke go to judge 0 doc and see the get all batch submission doc thrn ans come like this: submissionzs:{...}
 if(isresultobtained)
  return result.submissions;
// if isresultobtained false i.e., status  id is 1 and 2 so call again for get valid answer thats why while call jb tk shi rhega tb shi nhi to fir se call  to yha pr 1 second ke loye wait krenge then again for go for fn call




await waiting(1000);
}
}
module.exports={getlanguagebyid,submitbatch,submittoken};