var express = require('express');
const { options } = require('nodemon/lib/config');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();
var productHelper=require('../helpers/product-helpers')
/* GET users listing. */
router.get('/', function(req, res, next) {

  productHelpers.getAllProducts().then((products )=>{
    console.log(products)
  res.render('admin/view-products',{admin:true,products})
  })
 
});
router.get('/add-product',function(req,res){
res.render('admin/add-product')
})
router.post('/add-product',function(req,res){
  //console.log(req.body);
  //console.log(req.files.Image)

  productHelpers.addProduct(req.body,(id)=>{
    let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg',(err)=>{
      if(!err){
        res.render("admin/add-product")
      }else{
        console.log(err)
      }
    }) 
    //console.log(id);
  })
})


router.get('/delete-product',(req,res)=>{
  let proId=req.query.id
console.log(proId)//Id of item to be deleted
productHelpers.deleteProduct(proId).then((response)=>{
  res.redirect('/admin/')
       })
})

router.get('/edit-product',async (req,res)=>{
  let product =await productHelpers.getProductDetails(req.query.id)
  console.log(product)
  res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.Image){
      let image=req.files.Image
      image.mv('./public/product-images/'+id+'.jpg') 
    }
  })

})


module.exports = router;
