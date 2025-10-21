const mongoose = require('mongoose');

const {Schema}=mongoose;


const problemschema=new Schema({
  

    title:{  
        type:String,
        required:true
    },
    description:{   
        type:String,
        required:true
    },
    difficulty:{  
        type:String,
        required:true,
        enum:['easy','medium','hard']
    },
    tags:{      
        type:String,
        required:true,
        enum:['array','linked list','dp','string','Graph','trees','greedy','math','Backtracking','sorting','searching','stack','queue','bit manipulation']
    },  
     visibletestcases:[{
        input:{
            type:String,
        
        },
        output:{
            type:String,
            
        },explanation:{
            type:String,
          
        }
    }],
    hiddentestcases:[{
        input:{
            type:String,
       
        },
        output:{
            type:String,
      
        }
    }],
    startcode:[{
        language:{       
            type:String,
        
        },
        initialcode:{   
            type:String,
            required:true
        }
    }],
    refsolution:[{
        language:{        
            type:String,
        required:true
        },
        completecode:{   
            type:String,
            required:true
        }
    }],


    

    problemcreator:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }







})
const problem=mongoose.model("problem",problemschema)
    module.exports=problem; 