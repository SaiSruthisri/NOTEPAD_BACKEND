const multer = require('multer');
const path = require('path');
const crypto = require('crypto');


//disk storage


//to calculate to new random name to our files being stored use - crypto
//to extract extension - extname a function in path.

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/uploads')
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12 , function(err,name){
           const fn = name.toString("hex") + path.extname(file.originalname)
           cb(null, fn)
       })
        
    }
  })
  




//export upload variable

const upload = multer({ storage: storage })

module.exports = upload;