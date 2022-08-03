const { response } = require('express');
var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers=require('../helpers/user-helpers');

const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
    res.redirect('/login')
  }
}


/* GET home page. */
router.get('/', async function(req, res, next) {
  let user=req.session.user
  console.log(user)
  let cartCount=null
  if(req.session.user){
  cartCount = await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products )=>{
    console.log(products)
  res.render('user/view-products',{products,user,cartCount})
  })
 
});
router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{

    res.render('user/login',{"loginErr":req.session.loginErr})
    req.session.loginErr=false
  }

  
})
router.get('/signup',function(req,res){
  res.render('user/signup')
  })
  router.post('/signup',(req,res)=>{
   console.log(req.body);//Print user details
    //console.log(req.files.Image)
    userHelpers.doSignup(req.body).then((response)=>{
      console.log(response)
      req.session.loggedIn=true;
      req.session.user=response.user;
      res.redirect('/')

      

    })
  
  })

  router.post('/login',(req,res)=>{
    console.log(req.body);//Print user details
  //Passing login form to doLogin fun()
     userHelpers.doLogin(req.body).then((response)=>{
      if(response.status){
        req.session.loggedIn=true
        req.session.user=response.user
        res.redirect('/')
      }else{
        req.session.loginErr=true
        res.redirect('/login')
      }
  })
})


router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/cart',verifyLogin,async(req,res)=>{
  let products= await userHelpers.getCartProducts(req.session.user._id)
  res.render('user/cart',{products,user:req.session.user})
})

router.get('/add-to-cart/:id',verifyLogin,(req,res)=>{
  userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    res.redirect('/')
  })

})
router.post('/change-product-quantity',(req,res,next)=>{
  console.log(req.body);
  userHelpers.changeProductQuantity(req.body).then(()=>{

  })
})



 
  

module.exports = router;
