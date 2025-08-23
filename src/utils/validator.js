

const validator=require("validator")


const validate=(data)=>{
  const mandatoryfield=['firstname','emailId','password'];

    const isallowed= mandatoryfield.every((k)=>Object.keys(data).includes(k));
    if(!isallowed)
        throw new error("field mising")
 if(!validator.isEmail(data.emailId))
         throw new Error("invalid email");
     if(!validator.isStrongPassword(data.password))
         throw new Error("weak password ");
     
}
module.exports=validate;