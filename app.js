const express = require('express');
const app = express();
const userModel = require('./models/user');
const postModel = require('./models/post');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const upload = require("./config/multerconfig");
const fs = require('fs');


app.set("view engine" ,"ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname , 'public')));






app.get('/',(req,res)=>{
    res.render('index');
})

app.get('/profile/upload', isLoggedIn ,(req,res)=>{
    res.render('profileupload');
})

app.post('/upload' ,isLoggedIn , upload.single("image") , async(req,res)=>{
   let user = await userModel.findOne({email : req.user.email});
   user.profilepic = req.file.filename;
   await user.save();
   res.redirect("/profile");


})

app.get('/login', (req,res)=>{
    console.log(req.user);
    res.render('login');
})


//this route is protected by a middleware 
app.get('/profile',isLoggedIn, async(req,res)=>{
    let user = await userModel.findOne({email :req.user.email }).populate("posts");;
    res.render('profile' , {user}); 
})

//extra route this is profile/upload 
app.get('/profile/upload', isLoggedIn, (req, res) => {
    res.render('profileupload');
});




app.get('/like/:id',isLoggedIn, async(req,res)=>{
    let post = await postModel.findOne({_id :req.params.id }).populate("user");
    if(post.likes.indexOf(req.user.userid)===-1){
        post.likes.push(req.user.userid);
    }
    else{
       post.likes.splice(post.likes.indexOf(req.user.userid) , 1);   
    }


    
    await post.save();
    res.redirect("/profile"); 
})





app.get('/edit/:id',isLoggedIn, async(req,res)=>{
    let post = await postModel.findOne({_id :req.params.id }).populate("user");
    res.render("edit" ,{post} );

})


app.post('/update/:id',isLoggedIn, async(req,res)=>{
    let post = await postModel.findOneAndUpdate({_id :req.params.id } , {
        title: req.body.title,
        content :req.body.content
    });

    res.redirect("/profile" );

})

app.post('/post',isLoggedIn, async(req,res)=>{
    let user = await userModel.findOne({email :req.user.email });
    let {content} = req.body;
    let post = await postModel.create({
        user: user._id,
        content

    });
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile"); 
})

app.post('/register',async (req,res)=>{
    let {email , password , username , name , age} = req.body;
    // if (Array.isArray(name)) {
    //     name = name.join(" ");  // Joins array elements into a single string
    // }

    let user = await userModel.findOne({email});

    if(user) return res.status(500).send("User Already registered");


    bcrypt.genSalt(10 , (err,salt)=>{
        bcrypt.hash(password , salt ,async  (err , hash) =>{
           let user = await userModel.create({
                username ,
                email,
                age ,
                name ,
                password :hash
            });
        let token = jwt.sign({email :email , userid : user._id} , "shhhh");
        res.cookie("token", token);
        res.send("Registered");
        })

        

    })
});


//extra
app.post('/create', isLoggedIn, async (req, res) => {
    try {
        const title = req.body.title.trim();
        const content = req.body.details;
        const user = await userModel.findOne({ email: req.user.email });

        // Create a new post with the task details
        let post = await postModel.create({
            user: user._id,
            title,
            content
        });

        // Add post to user's posts array
        user.posts.push(post._id);
        await user.save();

        res.redirect("/profile");
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).send("Failed to create the task.");
    }
});

//extra to view a single post

app.get("/post/:id", isLoggedIn, async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await postModel.findById(postId).populate("user");

        if (!post) {
            return res.status(404).send("Post not found");
        }

        res.render("post", { 
            filename: post.title,  // Pass title as filename
            filedata: post.content // Pass content as filedata
        });
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).send("Internal Server Error");
    }
});






app.post('/login',async (req,res)=>{
    let {email , password } = req.body;
    
    let user = await userModel.findOne({email});

    if(!user) return res.status(500).send("Something went wrong");
    
    bcrypt.compare(password , user.password , function(err , result){
        if(result) {
           
            let token = jwt.sign({email :email , userid : user._id} , "shhhh");
            res.cookie("token", token);
            res.status(200).redirect("/profile");
            
        }
        else res.redirect("/login");
    })
        

  
});


app.get('/logout',(req,res)=>{
    res.cookie("token" , "");
    res.redirect('/login');
})

app.get('/delete/:id', isLoggedIn ,async(req,res)=>{
    // let users = await userModel.findOneAndDelete({_id: req.params.id});
    const postId = req.params.id;
    let post = await postModel.findOneAndDelete({ _id: postId });
    res.redirect("/profile");
}) 


//middle ware for protecing the routes

function isLoggedIn(req , res , next){
   if(req.cookies.token === "") res.redirect("/login");
    else{
        let data = jwt.verify(req.cookies.token , "shhhh");
        req.user = data ;
        next();
    }
    
}



const PORT = process.env.PORT || 5001;  // Change 5001 to any free port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
