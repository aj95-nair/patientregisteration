const { Schema, model } = require("mongoose");



const UserSchema = new Schema(
  { 
    name: { 
      type: String,
      required: true
    },
    username: {
      type: String,
      required: true
    },

    dateofbirth: {
      type: String,
    //  required: true
    },

    age: {
        type: String,
      //  required: true
    },

    condition: {
        type: String,
        default: "normal",
        enum: ["critical","normal"]
    }   , 
    scanimage:
    {
      type: String
     
    },
     
    email:
    {
      type: String,
      //required: true
    }

  });

module.exports = model("Patient", UserSchema);