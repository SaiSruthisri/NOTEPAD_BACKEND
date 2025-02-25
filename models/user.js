const mongoose = require('mongoose');



mongoose.connect("mongodb://127.0.0.1:27017/Notepad_Backend")

const userSchema = mongoose.Schema({
    username :String,
    name : String,
    age: Number,
    email: String,
    password: String,
    profilepic :{
        type:String,
        default : "defaultprofile.png"
    },
    posts :[{
        type : mongoose.Schema.Types.ObjectId , ref:"post"
    }]
})


module.exports = mongoose.model('user' , userSchema);