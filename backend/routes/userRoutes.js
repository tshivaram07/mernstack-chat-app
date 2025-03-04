const express=require('express');
const { registerUser, authUser, allusers } = require('../controllers/userControllers');
const { protect } = require('../middleware/authMiddileware');
const  router=express.Router();
router.post('/',registerUser);
router.post('/login',authUser);
router.get('/',protect,allusers);
module.exports=router;