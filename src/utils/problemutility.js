
const axios = require('axios');

const getlanguagebyid=(lang)=>{

    const language={
        "c++":105,
        "java":91,
        "javascript":63
    }
    return language[lang.toLowerCase()];

}






const submitbatch=async(submissions)=>{
   

    const options = {
      method: 'POST',
      url: 'https://judge0-ce.p.rapidapi.com/submissions/batch',
      params: {
        base64_encoded: 'false'
      },
      headers: {
        'x-rapidapi-key': 'ea26078f5cmsh7221c5275ad865ep15c92bjsn28c7c395efa4',
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
            
            if (error.response?.status === 403 || error.response?.data?.message?.includes('not subscribed')) {
                console.log(' Judge0 API subscription expired. Please check your API key.');
                throw new Error('Judge0 API subscription expired. Please contact administrator.');
            }
            
            throw error;
        }
    }
    
   return  await fetchData();
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
    tokens: restokens.join(","),
    base64_encoded: 'false',
    fields: '*'
  },
  headers: {
    'x-rapidapi-key': 'ea26078f5cmsh7221c5275ad865ep15c92bjsn28c7c395efa4',
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
		
		if (error.response?.status === 403 || error.response?.data?.message?.includes('not subscribed')) {
			console.log(' Judge0 API subscription expired. Please check your API key.');
			throw new Error('Judge0 API subscription expired. Please contact administrator.');
		}
		
		throw error;
	}
}
    while(true){
        try {
            const result=await fetchData();
            const isresultobtained=result.submissions.every((r)=>r.status_id>2);
            if(isresultobtained)
                return result.submissions;
            
            await waiting(1000);
        } catch (error) {
           
            console.log(' Judge0 API failed during polling. No mock results will be returned.');
            throw new Error('Judge0 API failed during execution. Please try again later.');
        }
    }
}
module.exports={getlanguagebyid,submitbatch,submittoken};