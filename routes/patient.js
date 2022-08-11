const router = require("express").Router();
const Patient = require("../models/Patient");
const { patientregister, userAuthorization, verifyRole } = require('../utils/auth');

const multer = require('multer');
const upload = multer({dest: 'uploads/'});

const fs = require('file-system');
const { db } = require("../models/Patient");

//
router.post("/patient-register",userAuthorization, verifyRole(['staff']),async(req, res)=> {
    await patientregister(req.body,"patient", res);
  })


  router.get("/allpatients", userAuthorization, verifyRole(['staff']), async(req, res)=> {
    Patient.find({}, function(err,result)
      {
          if (err){
              console.log(err);        
          }
          else {
              res.status(200).json(result)
          }
      });
  })


  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now())
    }
  })
   
  
  router.post('/uploadphoto',userAuthorization, verifyRole(['staff']),upload.single('scanImage') ,(req, res) => {
    console.log(req.file)
    console.log(req.body)


    var img = fs.readFileSync(req.file.path);
    var encode_image = img.toString('base64');

    var finalImg = {
        contentType: req.file.mimetype,
        image: Buffer.from(encode_image, 'base64')
    };


    const newimage = new Patient({
          username : req.body.username,
          scanimage : finalImg.image,
          name : req.body.name,
        //  dateofbirth: req.dateofbirth
        });
        newimage
        .save()
        .then(result => {
          console.log(result);
          res.status(201).json({
            message: "image uploaded sucessfully",
          });

        })
    })





module.exports = router;