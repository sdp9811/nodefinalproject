const express = require('express');
const {check, body} = require('express-validator');
const auth_check=require('../middle-ware/isAuth');
const adm_router = express.Router();
const admnController = require('../Controller/adminController');
adm_router.get('/homePage', admnController.getHomePage);
adm_router.get('/addproduct', admnController.getFormDisplay,auth_check);
adm_router.get('/details', admnController.productDetails);
adm_router.get('/edit_prod/:eid', admnController.editFormDisplay);
adm_router.get('/delete_prod/:eid', admnController.deletProductAdmin);
 adm_router.post('/postValue',
  [ body('pname' , 'valid product name').isLength({min:2, max:15}),
  body('pdes', 'input valid description').isLength({min:5, max:300})], admnController.postFormValue);
adm_router.post('/posteditValue', admnController.postEditFormData);
module.exports = adm_router;