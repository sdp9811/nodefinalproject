const express = require('express');
const appServer = express();
const session = require('express-session');
//session package used to store info in memory but it has no infinite resource.
const mongodb_session = require('connect-mongodb-session')(session);
//used to store data in mongodb in a session package.
const path = require('path');
const multer = require ('multer');
//multer is a  node.js middleweare for handling multipart/formdata,
//which is primarily used for uploading files.
const flash = require('connect-flash');
const cookieParser=require('cookie-parser');
const csurf = require('csurf');
const mongoose = require('mongoose');
const dbDriver = "mongodb+srv://sudeep321:asdf4545@cluster0.6d2zj.mongodb.net/shopProject?retryWrites=true&w=majority";
const RegLgnModel= require('./Model/authModel');
const auth_check=require('./middle-ware/isAuth');
const adm_router = require('./Router/adminRoute');
const shp_router=require('./Router/shopRoute');
const reg_router=require('./Router/authRoute');
const csrfProtection = csurf(); 
// const mongoConnect=require('./Database/db').mongoConnect;
appServer.use(express.urlencoded());
appServer.set('view engine', 'ejs');
appServer.set('Views', 'Views');
appServer.use(flash());
appServer.use(cookieParser());
appServer.use(express.static(path.join(__dirname, 'Public')));
//to store data in mongodb session collection
const storeValue = new mongodb_session({
uri:"mongodb+srv://sudeep321:asdf4545@cluster0.6d2zj.mongodb.net/shopProject",
collection: 'my-session'
})
appServer.use(session({secret:'secret-key' , resave: false, saveUninitialized:false, store:storeValue}))
// session is a function here. to stop resaving resave value false.
//to stop storing uninitialized value, saveUninitialized:false
appServer.use('/uploaded_image', express.static(path.join(__dirname, 'uploaded_image'))) //to store image
// to use the image folder after adding it to database.
const fileStorage=multer.diskStorage({
    destination:(request,file,callback)=>{
        callback(null, 'uploaded_image')
 },
 filename:(request,file,callback)=>{
        callback(null, file.originalname)
    }
});
//file.mimetype==='image/jpg
const fileFilter=(request,file,callback)=>{
    if(file.mimetype.includes("png")|| file.mimetype.includes("jpg")|| file.mimetype.includes("jpeg"))
    {
        callback(null, true)
    }
    else
    {
     callback(null,false)
    }
}
appServer.use(multer({storage:fileStorage,fileFilter:fileFilter, limits:{fieldSize:1024*1024*5}}).single('pimg'));
//pimg is coming form addproduct.ejs image field
appServer.use((request, response, next)=>{
    if(!request.session.user){
        return next();
    }
    RegLgnModel.findById(request.session._id)
    .then(userValue=>{
        request.user=userValue;
        console.log('user details:', request.user)
        next();
    }).catch(err=> console.log("user not found" , err));
});
appServer.use(csrfProtection); // use always after cookies and session.
appServer.use((request,response, next)=>{
response.locals.isAuthenticated=request.session.isLoggedIn;
    // console.log("isLogin value",request.session.isLoggedIn);
response.locals.csrf=request.csrfToken();
    next();
})
appServer.use(adm_router);
appServer.use(shp_router);
appServer.use(reg_router);
mongoose.connect(dbDriver,{useNewUrlParser:true, useUnifiedTopology:true}).then(result=>{
    // console.Console(result);
    appServer.listen(1300,()=>{
               console.log("server is connected localhost:1300")
           });

}).catch(err=>{
    console.log(err);

})