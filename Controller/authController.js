const RegLgnModel= require('../Model/authModel.js');
const bcrypt = require('bcryptjs');
const nodemailer=require('nodemailer');
const sendGridMailer=require('nodemailer-sendgrid-transport');
const {validationResult} = require('express-validator');
const createTranspoter = nodemailer.createTransport(sendGridMailer({
    auth:{
        api_key: 'SG.CVtZOF88TdC7gkwQYUoVkw.fXZGTZvmQL9EN_ZcUfmQXETcwpTsak_e2dZwOQVGzwc'
    }
}))
exports.regField=(request, response)=> {
    let message = request.flash('error');
    console.log(message);
    if(message.length>0)
    {
        message=message[0];
    }
    else{
        message=null;
    }
    response.render('Auth/registration',{
        title_reg:" regFrm ",
        path:'/regFrm',
        errorMsg: message,
        error: []
    })

}
exports.postRegValue=(request, response)=>{
console.log("collected value form", request.body);
const f_Name= request.body.fname;
const l_Name= request.body.lname;
const e_Ml = request.body.email;
const p_Srd = request.body.psd;

let error=validationResult(request);
if(!error.isEmpty())
{
    errorResponse = validationResult(request).array();
    console.log("errorResponse" , errorResponse);
    response.render('Auth/registration',{
        title_reg:"Registration form",
        path: '/regFrm',
        errorMsg: '',
        error: errorResponse
    })
}
else
{

RegLgnModel.findOne({eMail:e_Ml})
.then(userValue=>{
    if(userValue){
        console.log(userValue, "Email already exist");
        request.flash('error', 'Email already exist, try another email')
        return response.redirect('/regFrm');
    }
   return bcrypt.hash(p_Srd,12)
   .then(hashPassword=>{
    const regvalue=new RegLgnModel({firstName: f_Name, lastName:l_Name, eMail:e_Ml, pSrd: hashPassword  } );
   return regvalue.save()
   }).then(results => {
    console.log('registered done', results);
     createTranspoter.sendMail({
         to: e_Ml,
         from: "mondalrahulrks620@gmail.com",
         subject:"Registration Procedure",
         html: "<h1> You have successfully registered <h1>"
     })
     
 response.redirect('/lgnFrm');
}).catch(err => {
    console.log("reg error", err);

});

})
// response.redirect('/addproduct');
}
}
exports.lgnField=(request, response)=>{
   let lgnmessage = request.flash('error');
    console.log(lgnmessage);
    if(lgnmessage.length>0)
    {
        lgnmessage=lgnmessage[0];
    }
    else{
        lgnmessage=null;
    }
response.render('Auth/login',{
     title_lgn: "lgnFrm",
     path:'/lgnFrm',
     errorLgn:lgnmessage,
     cookie_data: request.cookies,
     error:[]
 })   
}
exports.postlogin=(request, response, next)=>{
    const email = request.body.email;
    const password = request.body.password;
    const check = request.body.check;

    let error=validationResult(request);
    if(!error.isEmpty())
    {
        errorResponse = validationResult(request).array();
        console.log("errorResponse" , errorResponse);
        response.render('Auth/login',{
            title_lgn:"loginFrm",
            path: '/lgnFrm',
            errorLgn: '',
            error: errorResponse,
            cookie_data:''
        })
    }
 else{
   RegLgnModel.findOne({eMail:email})
    .then(userValue=>{
        if(!userValue)
        {
            console.log('invalid email ');
            request.flash('error', 'Invalid email')
            return response.redirect('/lgnFrm')
        }
        bcrypt.compare(password , userValue.pSrd )
        .then(result=>{
            if(!result){
                console.log("Invalid Password")
            }
            else{
                console.log('logged in ' +result);
                request.session.isLoggedIn=true;
            // isLoggedin is a user defined variable
               request.session.user=userValue;
           return request.session.save(err=>{
                   if(err)
                   {
                       console.log(err);
                    }
                   else{
                       if(check){
                           const cookiedata ={emailCookie:userValue.eMail, password:password};
                           response.cookie("cookiedata", cookiedata,{
                               expires:new Date(Date.now() + 120000),
                               httpOnly: true
                           })
                       }
                   }
                   console.log('logged in ');
                   createTranspoter.sendMail({
                    to: email,
                    from: "mondalrahulrks620@gmail.com",
                    subject:"Login Procedure",
                    html: "<h1> You have successfully login <h1>"
                })
                   return response.redirect('/shpDetails')
               })

            }
            response.redirect('/lgnFrm')
        }).catch(err=>{
            console.log(err);
            response.redirect('/lgnFrm')
        })
    }).catch(err=>{
        console.log("error to find email: ", err)
    })
}
}

exports.forgotPassword = (request, response)=>{
   response.render('Auth/Forget',{
       title_forgot: "forgotpassword",
       path:'/forgotPassword'
   })

}
exports.PostforgotPassword = (request, response)=>{
       const u_email = request.body.email;
       RegLgnModel.findOne({eMail:u_email})
       .then(userValue=>{
           if(!userValue){
               consol.log("invalid email");
               return response.redirect('/lgnFrm')

           }
           else{
              const user_id = userValue._id;
              console.log("user id: " , user_id);
              const url ="http://localhost:1300/SetNewPassword/"+user_id;
              console.log(url);
              const text = "click here-> "
              createTranspoter.sendMail({
                  to:u_email,
                  from:"mondalrahulrks620@gmail.com",
                  subject: "Forget Password",
                  html:text.concat(url)
              })

           }
       })

}
exports.setPassword =(request, response)=>{

    const user_id = request.params.id;
    console.log(user_id);
    RegLgnModel.findById(user_id).then(userValue => {
        console.log(userValue);
        response.render('Auth/setPass', {
            title_setPass: "setPass",
            data: userValue,
            path:'/setNewPassword/:id'
        })
    }).catch(err => {
        console.log(err);
    })
}

exports.postSetpass=(request, response)=>{
    const user_id = request.body.spdid;
    const fname = request.body.fname;
    const lname=request.body.lname;
    const email = request.body.email;
    const password = request.body.password;
      RegLgnModel.findById(user_id).then(userValue=>{
         return bcrypt.hash(password,12)
          .then(hashPassword=>{
            userValue.firstName = fname;
            userValue.lastName = lname;
            userValue.eMail= email;
            userValue.pSrd=hashPassword;
            return userValue.save()

          })
        
        .then(result=>{
            console.log("created password", result);
            response.redirect('/lgnFrm');
        })
    }).catch(err=>{
        cole.log(err);

    })
}

exports.logOut=(request,response)=>{
    request.session.destroy();
    response.redirect('/lgnFrm');
    
}