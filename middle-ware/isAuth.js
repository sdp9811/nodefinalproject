module.exports=(request,response)=>{
    if(!request.session.isLoggedIn)
    {
        response.redirect('/lgnFrm');
    }
    next();
}