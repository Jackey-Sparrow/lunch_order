var User = require('../models/User');
var Menus = require('../models/Menus');
var PayStatus = require('../models/PayStatus');
var PayWay = require('../models/PayWay');
//var MenusComment = require('../models/MenusComment');
var ModelBasicClass = require('../models/ModelBasicClass');

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

        ModelBasicClass.getAll('Menus', function (err, menus) {
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
            ModelBasicClass.getItemsByFilter(orderFilter, 'Order_Record', function (err, records) {
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
        var filter = {id: id};
        ModelBasicClass.getItemByFilter(filter, 'Menus', function (err, menu) {
            if (err) {
                console.error('get menu error');
            }

            ModelBasicClass.getItemsByFilter({menuId: parseInt(id, 10)}, 'Menus_Comment', function (err, descs) {

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
        //add new comment
        ModelBasicClass.addItem(comment, 'Menus_Comment', function (err, newComment) {
            if (err) {
                console.log('add new comment error');
            }
            return res.redirect('/submit/' + comment.menuId);
        });
    });


    /**
     * login
     */
    app.get('/login', checkNotLogin);
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
        var rememberMe = req.body.rememberMe;
        var password = req.body.password;
        var filter = {userName: req.body.userName.trim()};
        ModelBasicClass.getItemsByFilter(filter, 'User_Admin', function (err, users) {

            if (!users.length) {
                req.flash('error', '用户不存在!');
                return res.redirect('/login');
            }

            var user = users[0];

            if (user.password.toString().trim() != password.toString().trim()) {
                req.flash('error', '密码错误!');
                return res.redirect('/login');
            }
            req.session.user = user;
            if (rememberMe) {
                var cookiesArray = [];
                cookiesArray.push('_id=' + user._id);
                cookiesArray.push('userName=' + user.userName);
                cookiesArray.push('password=' + user.password);
                cookiesArray.push('role=' + user.role);

                res.setHeader("Set-Cookie", cookiesArray);
            }
            req.flash('success', '登陆成功!');
            res.redirect('/');
        });
    });

    /**
     * add order
     */
    app.post('/addOrder', function (req, res) {
        var menuId = parseInt(req.body.menuId);
        console.log(req.session.user);
        var record = {
            menuId: menuId,
            userId: req.session.user._id,
            userName: req.session.user.userName,
            dateOrder: getDateStr(),
            payStatus: 1,
            payWay: 0,
            num: 1
        };

        var filter = {
            menuId: record.menuId,
            userId: record.userId,
            dateOrder: record.dateOrder
        };
        ModelBasicClass.getItemsByFilter(filter, 'Order_Record', function (err, records) {
            if (err) {
                console.error('get today order error');
            }

            if (records.length) {
                //update
                var oldRecord = records[0];
                oldRecord.num = oldRecord.num + 1;
                ModelBasicClass.UpdateItem(oldRecord, 'Order_Record', function (err, result) {
                    if (err) {
                        console.error('update order record error');
                        res.send({data: 'fail'});
                    }
                    if (result === 1) {
                        res.send({data: 'success'});
                    }
                });
            } else {
                //insert
                ModelBasicClass.addItem(record, 'Order_Record', function (err, newRecord) {
                    if (err) {
                        console.error('add record error');
                        res.send({data: 'fail'});
                    }
                    res.send(
                        {
                            data: 'success',
                            record: newRecord
                        });
                });
            }

        });
    });

    /**
     * delete Order By Id
     */
    app.post('/deleteOrder', function (req, res) {
        var orderId = req.body.orderId;
        ModelBasicClass.DeleteItemById(orderId, 'Order_Record', function (err, result) {

            if (err) {
                console.log('delete order fail' + err);
                res.send(
                    {
                        data: 'fail'
                    }
                );
            }

            res.send(
                {
                    data: 'success',
                    result: result
                }
            );

        });
    });

    /**
     * history order
     */
    app.get('/history', checkLogin);
    app.get('/history', function (req, res) {
        var filter = {
            userId: req.session.user._id
        };

        ModelBasicClass.getAll('Menus', function (err, menus) {
            if (err) {
                console.error('get menus error');
            }
            ModelBasicClass.getItemsByFilter(filter, 'Order_Record', function (err, records) {
                if (err) {
                    console.error('get all history record error');
                }

                var result = [];
                for (var i = 0; i < records.length; i++) {
                    var record = records[i];
                    //payStatus
                    record.payStatusEntity = PayStatus[record.payStatus];
                    //payway
                    record.payWayEntity = PayWay[record.payWay];

                    var menuId = record.menuId;
                    var menu = menus.filter(function (item) {
                        return item.id === menuId;
                    });
                    record.menu = menu[0];

                    var index = -1;
                    for (var j = 0; j < result.length; j++) {
                        var dateOrder = result[j].date;
                        if (dateOrder === records[i].dateOrder) {
                            index = j;
                            break;
                        }
                    }

                    if (index === -1) {
                        result.push(
                            {
                                date: record.dateOrder,
                                data: [record]
                            }
                        );
                    } else {
                        result[index].data.push(record);
                    }

                }

                result.sort(function (item1, item2) {
                    var date1 = item1.date.replace('-', '');
                    var date2 = item2.date.replace('-', '');
                    return date1 < date2;
                });

                res.render('history',
                    {
                        title: 'ITWOCloud Lunch Order System',
                        user: req.session.user,
                        historys: result
                    }
                );
            });
        });

    });

    /**
     * log out
     * remove seesion and cookies
     */
    app.get('/logout', function (req, res) {
        req.session.destroy();
        res.clearCookie('_id');
        res.clearCookie('userName');
        res.clearCookie('password');
        res.clearCookie('role');
        res.redirect('/login');
    });

    /**
     * check login
     *
     * @param req
     * @param res
     * @param next
     */
    function checkLogin(req, res, next) {
        var cookies = getCookies(req.headers.cookie);
        if (cookies._id) {
            req.session.user = cookies;
        }
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

    function getCookies(cookie) {
        var cookies = {};
        cookie && cookie.split(';').forEach(function (cookie) {
            var parts = cookie.split('=');
            cookies[parts[0].trim()] = ( parts[1] || '' ).trim();
        });
        return cookies;
    }
};
