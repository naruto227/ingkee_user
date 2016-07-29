var express = require('express');
var router = express.Router();

var User = require('../models/user');
var crypto = require('crypto');
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.get('/getUsers',function (req, res, next) {
    User.getUsers(req.query.num,function (err,users,total) {
        if(err){
            return res.json({msg:"error",error:err});
        }
        res.json({msg:"success",data:users,total:total});
    })
    
});
router.post('/usercollection', function (req, res, next) {
    console.log(JSON.stringify(req.body));
    var uid = req.body.uid,
        error_msg = req.body.error_msg,
        phone = req.body.phone,
        session = req.body.session,
        secret = req.body.secret,
        first_login = req.body.first_login,
        dm_error = req.body.dm_error,
        isused = 0;
    //生成手机的 md5 值。
    /*var md5 = crypto.createHash('md5'),
     phone = md5.update(req.body.phone).digest('hex');*/
    var newUser = new User({
        uid: uid,
        error_msg: error_msg,
        phone: phone,
        session: session,
        secret: secret,
        first_login: first_login,
        dm_error: dm_error,
        isused: isused
    });

    User.get(newUser.phone, function (err, user) {
        if (err) {
            return res.json({'error': err});
        }
        if (user) {
            return res.json({'error': '电话号码已存在!'});
        }
        //如果不存在则新增用户
        newUser.save(function (err, user) {
            if (err) {
                res.json({'error': err});
            }
            res.json({msg: "success", 'user': user});
        });
    });
});
//将数据集合中的phone 字段设置为唯一
router.post('/multiuser', function (req, res, next) {
    console.log(JSON.stringify(req.body));
    var values = [];
    for (var i = 0; i < req.body.data.length; i++) {
        /**var item = req.body.data[i];
        var uid = item.uid,
            error_msg = item.error_msg,
            phone = item.phone,
            session = item.session,
            secret = item.secret,
            first_login = item.first_login,
            dm_error = item.dm_error,
            isused = 0;*/
        values.push(req.body.data[i]);
        //生成手机的 md5 值。
        /*var md5 = crypto.createHash('md5'),
         phone = md5.update(req.body.phone).digest('hex');*/
        /*var newUser = new user({
         uid: uid,
         error_msg: error_msg,
         phone: phone,
         session: session,
         secret: secret,
         first_login: first_login,
         dm_error: dm_error,
         isused: isused
         });*/

    }
    User.savemulti(values, function (err, user) {
        if (err) {
            res.json({'error': err});
        }
        res.json({msg: "success", 'user': user});
    });

});


module.exports = router;
