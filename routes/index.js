var User = require('../models/User');
var Menus = require('../models/Menus');
var MenusDescription = require('../models/MenusDescription');
var BSON = require('mongodb').BSONPure;
//todo: use promise
//var allPromise = Q.all([ fs_readFile('file1.txt'), fs_readFile('file2.txt') ])
//allPromise.then(console.log, console.error)

module.exports = function (app) {
    /**
     * home page
     */
    app.get('/', checkLogin);
    app.get('/', function (req, res) {
        //checkLogin(req, res, next);

        Menus.getAll(function (err, menus) {
            if (err) {
                menus = [];
            }
            menus.sort(function (item1, item2) {
                var id1 = parseInt(item1.id);
                var id2 = parseInt(item2.id);
                return id1 - id2;
            });
            res.render('index',
                {
                    title: 'ITWOCloud Lunch Order System',
                    menus: menus,
                    user: req.session.user
                    //success: req.flash('success').toString()
                    //message: req.flash('error').toString()
                }
            );
        });
    });

    /**
     * menu detail and comment
     */
    app.get('/submit/:id', checkLogin);
    app.get('/submit/:id', function (req, res, next) {
        var id = parseInt(req.params.id);
        Menus.getMenuById(id, function (err, menu) {
            if (err) {
                console.error('get menu error');
            }

            MenusDescription.getDescriptionByMenuId(id, function (err, descs) {

                if (err) {
                    descs = [];
                }

                res.render('submit',
                    {
                        title: 'ITWOCloud Lunch Order System',
                        descs: descs,
                        menu: menu,
                        hasDesc: descs.length,
                        user: req.session.user
                    }
                );
            });
        });
    });

    app.post('/submit/:id', function (req, res) {
        var nowDate = new Date();
        var comment = {
            desc: req.body.comment,
            userName: req.session.user.userName,
            menuId: parseInt(req.params.id),
            dateInsert: nowDate.getFullYear().toString() + '-' + (nowDate.getMonth() + 1).toString() + '-' + nowDate.getDate().toString()
        };
        var menusDescription = new MenusDescription(comment);
        menusDescription.addComment(function (err, newComment) {
            if (err) {
                console.log('add new comment error');
            }
            return res.redirect('/submit/' + comment.menuId);
        });
    });

    /**
     * temp
     */
    app.post('/user', function (req, res, next) {
        //var user = {};
        //user.firstName = req.body.firstName;
        //user.lastName = req.body.lastName;
        //var newUser = new User(user);
        //newUser.AddOne(function (err, user) {
        //    if (err) {
        //        return;
        //    }
        //    req.flash('success', '添加成功');
        //    res.redirect('/');
        //});
    });

    /**
     * login
     */
    app.get('/login', function (req, res) {
        var error = req.flash('error').toString();
        res.render('login', {
            title: 'ITWOCloud Lunch Order System',
            errorMessage: error
        });
    });

    /**
     * login post
     */
    app.post('/login', function (req, res) {
        // var md5 = crypto.createHash('md5'),
        var password = req.body.password;//.digest('hex');
        User.getAllByName(req.body.userName, function (err, users) {
            if (!users.length) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }
            var user = users[0];
            if (user.password != password.toString()) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            req.flash('success', '登陆成功!');
            res.redirect('/');
        });
    });

    /**
     * check login
     *
     * @param req
     * @param res
     * @param next
     */
    function checkLogin(req, res, next) {
        if (!req.session.user) {
            req.flash('error', '请先登录');
            return res.redirect('/login');
        }
        next();
    }

    /**
     * check not login
     *
     * @param req
     * @param res
     * @param next
     */
    function checkNotLogin(req, res, next) {
        if (req.session.user) {
            req.flash('error', '已登录!');
            return res.redirect('back');
        }
        next();
    }
};
