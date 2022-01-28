const ProductModel=require('../Model/product')
const CartModel = require('../Model/Cart');

exports.productDetailsShop=(request,response)=>{

    ProductModel.find().then(products=>{
        response.render('Shop/shopDetails.ejs',{
            title_shop:"details page",
            data: products,
            path:'/shpDetails'
        });
    }).catch(err=>{
        console.log("shopData fetch error : ", err)
    })
}
    exports.ViewProductShop=(request, response)=>{

        const product_id=request.params.mid;
        console.log(product_id);
        ProductModel.findById(product_id).then(products=>{
            console.log(products);
            response.render('Shop/sProdDetails.ejs', {
             title_det:"shopProduct details",
             data: products ,
             path:'/sprod/:mid' 
            })
        }).catch(err=>{
            console.log(err);
        })
    }

    exports.searchProduct=(request,response)=>{
        const productName=request.body.searchText;
        console.log("searching text: ", productName);
        ProductModel.find({prodName: productName}).then(results=>{
            console.log("after searching: ", results);
            response.render('Shop/shopDetails',{
                title_shop:"details page",
                data:results,
                path:'/searchItem'
            });
        }).catch(err=>{
            console.log(err);
        })
    }

    exports.postAddToCart = (request, response)=>{
        const pId = request.body.productId;
        const quantity = request.body.quantity;
        const userId= request.session.user._id;
        const cartValue=[];
        console.log("After add to cart: pid: ", pId, " Q: ", quantity,  "Id: ", userId);
       CartModel.find({userId:userId, productId:pId})
       .then(cartData=>{
           if(cartData==='')
           {
               ProductModel.findById(pId)
               .then(productForCart=>{
                   cartValue.push(productForCart);
                   const cartProduct=new CartModel({productId:pId, quantity:quantity, userId: userId, cart:cartValue});
                   cartProduct.save()
                   .then(result=>{
                       console.log("product added to cart successfully", result);
                       response.redirect('/cartPage');

                   }).catch(err=>{
                       console.log(err);
                   })
               })

           }

           else
           {
               ProductModel.findById(pId)
               .then(productForCart=>{
                   cartValue.push(productForCart);
                   const cartProduct=new CartModel({productId:pId, quantity:quantity, userId: userId, cart:cartValue});
                   cartProduct.save()
                   .then(result=>{
                       console.log('product added into cart successfully', result);
                        response.redirect('/cartPage')
                   }).catch(err=>{
                       console.log(err);
                   })
               }).catch(err=>{
                   console.log(err);
               })
           }
       })
    
    }

    exports.getCartPage=(request, response)=>{
        const user_id =request.session.user._id;
        CartModel.find({userId:user_id}).then(viewProductsCart=>{
            console.log("view cart", viewProductsCart);
            response.render('Shop/cartPage',{
                title_cart: 'cart',
                data: viewProductsCart,
                path: '/cartPage'

            });
        }).catch(err=>{
            console.log(err);
        })
    }

    exports.getPaymentPage=(request, response)=>{
        response.render('Shop/pay',{
            title_pay: "payPage",
            path: "/gatPay"

        })
    }

    exports.getSuccess=(request, response)=>{
        response.render('Shop/paySuccess', {
            title_sucess: "paysuccess",
            path:"/paySuccess"
        })
    }

    exports.deleteCartProduct=(request,response)=>{
        const cart_id = request.params.cid;
        CartModel.deleteOne({ _id : cart_id}).then(results=>{
            console.log("CartModel",results);
            response.redirect('/cartPage');
        }).catch(err=>{
            console.log(err);
        })
    }
