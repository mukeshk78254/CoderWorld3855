const mongoose = require('mongoose');

const {Schema}=mongoose;


const problemschema=new Schema({
  

    title:{   // two sum//id
        type:String,
        required:true
    },
    description:{    // a array of n elements ...
        type:String,
        required:true
    },
    difficulty:{  // easy ,ed hard
        type:String,
        required:true,
        enum:['easy','medium','hard']
    },
    tags:{      // array ka hai ki dp hai greedy ka hai problem
        type:String,
        required:true,
        enum:['array','linked list','dp','string']
    },  
     visibletestcases:[{
        input:{
            type:String,
        required:true
        },
        output:{
            type:String,
        required:true
        },explanation:{
            type:String,
        required:true
        }
    }],
    hiddentestcases:[{
        input:{
            type:String,
        required:true
        },
        output:{
            type:String,
        required:true
        }
    }],
    startcode:[{
        language:{        // c++,pyhton..
            type:String,
        required:true
        },
        initialcode:{   // clas sol   public   int sum(vector<int>arr){  };
            type:String,
            required:true
        }
    }],
    refsolution:[{
        language:{        // c++,pyhton..
            type:String,
        required:true
        },
        completecode:{   // clas sol   public   int sum(vector<int>arr){  };
            type:String,
            required:true
        }
    }],


    // kaun bnaya is sar problem ko us wale admin ka object id ko lelo //user ka id lena hai so give refernce as a user kyunki schema to bhut ka hoga n lena user ka id hai jo us problem ko cerate kiya hai

    problemcreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }







})
const problem=mongoose.model("problem",problemschema)
    module.exports=problem; 