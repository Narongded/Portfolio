var express = require('express');
var router = express.Router();
var path = require('path');
var user = require('../model/user');
var multer =  require('multer');
var data = require('../model/data');
const bcrypt = require('bcrypt')
/* GET home page. */
var _img = '';
const storage = multer.diskStorage({
	destination : (request, file, callback) => {
        
            console.log(request.body.name);
        
		callback(null, path.join(__dirname+'/../public/images'));
	},
	filename: (request, file, callback) => {
        _img = file.originalname;
        console.log(file.originalname);
		callback(null, file.originalname)
	}
});
const upload = multer({ storage: storage })


const isLoggedIn = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  next()
}

router.get('/',function(req, res, next) {
 
  res.render('index');
});

router.get('/login',function(req, res, next) {
 
  res.render('login');
});
router.post('/login',async function(req, res, next) {


  

  // simple validation
  

  // const passwordHash = bcrypt.hashSync(req.body.password, 10)
  // const _user = new user({
  //   name : req.body.name,
  //   password: passwordHash
  // })

  // await _user.save()
  // res.render('index')
  test = await user.findOne({name: req.body.name},(err,doc)=>{
    try {
      if(doc.name == null || doc.password == null || err != null){
        res.redirect('/login')
      }
      
    } catch (error) {
      return res.redirect('/login');
    }
   
    
  });
  if(bcrypt.compareSync(req.body.password,test.password)){
    
    req.session.user = test.name;
    return res.redirect('/');
  }
  else{
    res.redirect('/login');
  }
    
  
});

router.get('/logout',(req,res)=>{
  req.session.user = null;
  res.redirect('/');
})
router.get('/project', async function(req, res, next) {

  _data = await data.find({});

 
  res.render('Project',{data : _data});
});


router.get('/add',isLoggedIn,(req,res)=>{
  res.render('add');


})

router.post('/add', isLoggedIn,upload.any(),async(req,res)=>{

  input = new data({
    name : req.body.name,
    url : req.body.url,
    des : req.body.des,
    img : _img
  }
  );
  await input.save();
  res.redirect('/project')


})

module.exports = router;
