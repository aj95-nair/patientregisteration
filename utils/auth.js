const User = require("../models/Patient");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const {SECRET} = require('../config');
const passport = require("passport");


const adminLogin= async(userData, role, res) => {

    let { email, password } = userData;
    const user =  await User.findOne({email});
    if (!user) {
        return res.status(404).json({
            message: "Credentials not found",
            success: false,
        });

    }

    if (user.role != role) {
        return res.status(401).json({
            message: "NOT AUTHORISED",
            success: false,
            role: `${user.role}`,
            email : `${user.email}`
        });
    }



    let passwordmatch = await bcrypt.compare(password, user.password);
    

    if (passwordmatch) {

        let token = jwt.sign({
            _id: user._id,
            role: user.role,
            email: user.email
        }, SECRET, { expiresIn: "7 days" });

        let authtoken = {
            _id: user._id,
            role: user.role,
            email: user.email,
            token: `Bearer ${token}`,
            expiresIn: 168
        };
        return res.status(200).json({
            authtoken,
            message: `${user.role} SUCESS `,
            success: true
        });

    } else {
        return res.status(404).json({
            message: "WRONG PASSWORD",
            success: false, 
            username: `${req.email}`,
        });
    }
}




const userAuthorization = passport.authenticate("jwt", { session: false });


const verifyRole = roles => (req, res, next) => {
    if(roles.includes(req.user.role)){
        return next()
    }
    return res.status(401).json({
        message: "Not Authorised In this Route",
        success: false
    });
};


const patientregister = async(userDetails, role, res) => {
    try{
        let usernamecheck = await(checkusername(userDetails.username));
        if(!usernamecheck){
            return res.status(400).json({
                message: `Username is already taken`,
                success: false
            });
        }
        let emailcheck = await(checkuseremail(userDetails.email));
        if(!emailcheck){
            return res.status(400).json({
                message: `Email is already registered`,
                success: false
            });
        }
    
        const username = userDetails.username;
        const name = userDetails.name;
        const email = userDetails.email;
        const dateofbirth = userDetails.dateofbirth;
        const age = userDetails.age;
        const condition = userDetails.condition;
        //create a new patient
        const newpatient = new User({
            username, email,name,email,dateofbirth,age,condition
        });    
        await newpatient.save();

        

        return res.status(201).json({
            message: "patient is Registered",
            success: true
        });
    }catch(err){
        return res.status(500).json({
            message: `not registered due to  error: ${err}`,
            success: false
        });
    }
};


const checkusername = async username => {
    let user = await User.findOne({username});
    if(user){
        return false;
    }else{
        return true;
    }
};

const checkuseremail = async email => {
    let user = await User.findOne({email});
    if(user){
        return false;
    }else{
        return true;
    }
};



module.exports ={
    adminLogin,
    userAuthorization,
    verifyRole,
    patientregister
};