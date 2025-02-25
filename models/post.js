// const mongoose = require('mongoose');



// // mongoose.connect("mongodb://127.0.0.1:27017/Notepad_Backend")

// const postSchema = mongoose.Schema({
//     user :{
//         type : mongoose.Schema.Types.ObjectId,
//         ref :"user"
//     } ,
//     date :{
//         // timestampas:true
//         type:Date,
//         default :Date.now 
//     },
//     content :String,

//     likes:[
//         { type : mongoose.Schema.Types.ObjectId,  ref :"user" }
//     ]
// })


// module.exports = mongoose.model('post' , postSchema);


const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    title: {  // Add title field
        type: String,
        required: true
    },
    content: {  // Store task details as post content
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    likes: [
        { type: mongoose.Schema.Types.ObjectId, ref: "user" }
    ]
});

module.exports = mongoose.model('post', postSchema);

