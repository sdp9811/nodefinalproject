const express=require('express');
const {check,body} = require('express-validator');
const auth_check=require('../middle-ware/isAuth');
const reg_router=express.Router();
const regController=require('../Controller/authController.js');
reg_router.get('/regFrm', regController.regField);
reg_router.get('/lgnFrm', regController.lgnField);
reg_router.post('/regValue',[ body('fname' , 'input valid name').isLength({min:3, max:12}),
check('email').isEmail().withMessage("input valid email"),
body('psd', 'enter valid password').matches('^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9])(?=.*[a-z]).{4,12}$')
], regController.postRegValue);
reg_router.post('/lgnUser', [check('email').isEmail().withMessage("input valid email")], regController.postlogin);
reg_router.get('/forgotPassword' , regController.forgotPassword);
reg_router.post('/PostforgotPassword' , regController.PostforgotPassword)
 reg_router.get('/SetNewPassword/:id' , regController.setPassword);
 reg_router.post('/setNewPassword', regController.postSetpass);
reg_router.get('/lgOut', regController.logOut,auth_check);
module.exports = reg_router;