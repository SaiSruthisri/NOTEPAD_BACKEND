// const mongoose = require('mongoose');



// // mongoose.connect("mongodb://127.0.0.1:27017/Notepad_Backend")
// mongoose.connect("mongodb+srv://nsaisruthisri:F0AyDWTtfEIeirns@notepadcluster.iumwv.mongodb.net/Notepad_Backend?retryWrites=true&w=majority", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// })
// .then(() => console.log("✅ Connected to MongoDB Atlas"))
// .catch(err => console.error("❌ Error connecting to MongoDB Atlas:", err));
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB Atlas"))
.catch(err => console.error("❌ Error connecting to MongoDB Atlas:", err));



const userSchema = mongoose.Schema({
    username :String,
    name : String,
    age: Number,
    email: String,
    password: String,
    profilepic :{
        type:String,
        default : "default.png"
    },
    posts :[{
        type : mongoose.Schema.Types.ObjectId , ref:"post"
    }]
})


module.exports = mongoose.model('user' , userSchema);