
const axios = require('axios');

// No mock validation needed - only real Judge0 results
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
        'x-rapidapi-key': 'efe3d391dcmsh3cec8119e1ca704p197c79jsn95b7e784472c',
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
            if ((response.status === 200 || response.status === 201) && response.data) {
                return response.data;
            } else {
                throw new Error(`Judge0 API returned status ${response.status}`);
            }
        } catch (error) {
            console.error('Judge0 submitbatch error:', error.message);
            
            // If API subscription expired or failed, throw error instead of mock
            if (error.response?.status === 403 || error.response?.data?.message?.includes('not subscribed')) {
                console.log('❌ Judge0 API subscription expired. Please check your API key.');
                throw new Error('Judge0 API subscription expired. Please contact administrator.');
            }
            
            throw error;
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

    // No mock tokens - only real Judge0 results

const options = {
  method: 'GET',
  url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
  params: {
    tokens: restokens.join(","),  // jitne bhi tokan hai result me usko comma se seprate kro 
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'efe3d391dcmsh3cec8119e1ca704p197c79jsn95b7e784472c',
    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
  }
};

async function fetchData() {
	try {
		const response = await axios.request(options);
		if ((response.status === 200 || response.status === 201) && response.data) {
			return response.data;
		} else {
			throw new Error(`Judge0 API returned status ${response.status}`);
		}
	} catch (error) {
		console.error('Judge0 submittoken error:', error.message);
		
		// If API subscription expired or failed, throw error instead of mock
		if (error.response?.status === 403 || error.response?.data?.message?.includes('not subscribed')) {
			console.log('❌ Judge0 API subscription expired. Please check your API key.');
			throw new Error('Judge0 API subscription expired. Please contact administrator.');
		}
		
		throw error;
	}
}
    while(true){
        try {
            const result=await fetchData();  // check result if status is is 1 and 2 then give this again bcon it means that it is underprocess or processing. 
            const isresultobtained=result.submissions.every((r)=>r.status_id>2);  // ye nsubmissions aise hi format me atta hai krke go to judge 0 doc and see the get all batch submission doc thrn ans come like this: submissionzs:{...}
            if(isresultobtained)
                return result.submissions;
            // if isresultobtained false i.e., status  id is 1 and 2 so call again for get valid answer thats why while call jb tk shi rhega tb shi nhi to fir se call  to yha pr 1 second ke loye wait krenge then again for go for fn call
            await waiting(1000);
        } catch (error) {
            // If we get an error in the while loop, it means API failed
            console.log('❌ Judge0 API failed during polling. No mock results will be returned.');
            throw new Error('Judge0 API failed during execution. Please try again later.');
        }
    }
}
module.exports={getlanguagebyid,submitbatch,submittoken};