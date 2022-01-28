const ProductModel = require("../Model/product");
const {validationResult} = require('express-validator');
exports.getFormDisplay = (request, response) => {
    response.render('Admin/addProduct', {
        title_page: "addproduct",
        path:'/addproduct'
    }
    )
}
exports.getHomePage = (request, response)=>{
    response.render('Admin/Home',{
    title_home: "HomePage" ,
    path: '/homePage'  
    })
}
exports.editFormDisplay = (request, response) => {
     const product_id = request.params.eid;
    console.log(product_id);
    ProductModel.findById(product_id).then(products => {
        console.log(products);
        response.render('Admin/editProduct', {
            title_edt: " edit_prod",
            data: products,
            path:'/edit_prod/:eid'
        })
    }).catch(err => {
        console.log(err);
    })
}

exports.postFormValue = (request, response) => {
    console.log("collected value from form: ", request.body);
    const pName = request.body.pname;
    const pPrice = request.body.price;
    const pDes = request.body.pdes;
    //  const pImg= request.body.pimg;
    const p_Img = request.file;
    //console.log(p_Img);
    const pImage_url = p_Img.path;
    let error = validationResult(request);
    if(!error.isEmpty())
    {
        errorResponse = validationResult(request).array();
        console.log("errorResponse " , errorResponse);
        response.render('Admin/addProduct',{
            title_page: "addProduct",
            error: errorResponse,
            path:  '/addproduct'
        })
    }
    else
    {

    const Product = new ProductModel({ prodName: pName, prodPrice: pPrice, prodDesc: pDes, prodImage: pImage_url });
    Product.save().then(results => {
        console.log('created product', results);

    }).catch(err => {
        console.log(err);
  
    });
    response.redirect('/details');
}
}

exports.postEditFormData = (request, response) => {
    const product_id = request.body.productId;

    const updatedName = request.body.pname;
    const updatedPrice = request.body.price;
    const updatedDesc = request.body.pdesc;
    // const updatedImage=request.body.pimg;
    const update_img = request.file;
    const updateImg_url = update_img.path;
    ProductModel.findById(product_id).then(productsData => {
        console.log("product: ", productsData);
        productsData.prodName = updatedName;
        productsData.prodPrice = updatedPrice;
        productsData.prodDesc = updatedDesc;
        productsData.prodImage = updateImg_url;

        return productsData.save().then(results => {
            console.log("data updated:", results);
            response.redirect('/details');
        });
    }).catch(err => {
        console.log(err);
    })
}
exports.productDetails = (request, response) => {
    ProductModel.find().then(products => {
        console.log("product: ", products);
        response.render('Admin/prodDetails.ejs', {
            title: "details Page",
            data: products,
            path:'/details'
        });

    }).catch(err => {
        console.log("Data fetching error", err);
    })

}
exports.deletProductAdmin = (request, response) => {
    const product_id = request.params.eid;
    ProductModel.deleteOne({ _id: product_id }).then(results => {      // deleteOne is predefined func
        console.log(results);
        response.redirect('/details');
    }).catch(err => {
        console.log(err);
    })



}
// exports.deletProductAdmin=(request,response)=>{
//     const product_id=request.body.proDt_Id;
//     ProductModel.deleteById(product_id).then(results=>{
//         console.log(results);
//         response.redirect('/details');
//     }).catch(err=>{
//         console.log(err);
//     })



// } 
