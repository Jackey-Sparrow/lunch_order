var User = require('../models/User');
var Menus = require('../models/Menus');
var MenusDescription = require('../models/MenusDescription');
var BSON = require('mongodb').BSONPure;

var OrderRecord = require('../models/OrderRecord');
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
            var orderFilter = {
                userId: req.session.user._id,
                dateOrder: getDateStr()
            };
            OrderRecord.getTodayOrderByFilter(orderFilter, function (err, records) {
                if (err) {
                    console.error('get today order error');
                }
                //fill record's menu
                var num = 0,
                    total = 0;
                for (var i = 0; i < records.length; i++) {
                    var menuId = records[i].menuId;
                    var menu = menus.filter(function (item) {
                        return item.id === menuId;
                    });
                    if (menu) {
                        records[i].menu = menu[0];
                        var price = menu[0].price;
                        total += price * records[i].num;
                    }

                    num += records[i].num;
                }
                res.render('index',
                    {
                        title: 'ITWOCloud Lunch Order System',
                        menus: menus,
                        user: req.session.user,
                        orderRecords: records,
                        num: num,
                        total: total
                        //success: req.flash('success').toString()
                        //message: req.flash('error').toString()
                    }
                );
            });

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

        var comment = {
            desc: req.body.comment,
            userName: req.session.user.userName,
            menuId: parseInt(req.params.id),
            dateInsert: getDateStr()
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

    app.post('/addOrder', function (req, res) {
        var menuId = parseInt(req.body.menuId);
        var record = {
            menuId: menuId,
            userId: req.session.user._id,
            userName: req.session.user.userName,
            dateOrder: getDateStr(),
            payStatus: 0,
            payWay: ''
        };

        var filter = {
            menuId: record.menuId,
            userId: record.userId,
            dateOrder: record.dateOrder
        };

        OrderRecord.getTodayOrderByFilter(filter, function (err, records) {
            if (err) {
                console.error('get today order error');
            }

            if (records.length) {
                //update
                var oldRecord = records[0];
                oldRecord.num = oldRecord.num + 1;
                OrderRecord.updateOrder(oldRecord, function (err, result) {
                    if (err) {
                        console.error('update order record error');
                        res.send({data: 'fail'});
                    }
                    console.log(result);
                    if (result === 1) {
                        res.send({data: 'success'});
                    }
                });
            } else {
                //insert
                var orderRecord = new OrderRecord(record);
                orderRecord.AddRecord(function (err, newRecord) {
                    if (err) {
                        console.error('add record error');
                        res.send({data: 'fail'});
                    }
                    res.send({data: 'success'});
                });
            }

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

    function getDateStr() {
        var nowDate = new Date();
        var month = nowDate.getMonth() + 1;
        month = month < 10 ? ('0' + month.toString()) : month.toString();
        return nowDate.getFullYear().toString() + '-' + month + '-' + nowDate.getDate().toString();
    }
};
