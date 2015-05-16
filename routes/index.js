var User = require('../models/User');
var Menus = require('../models/Menus');
var MenusDescription = require('../models/MenusDescription');

module.exports = function (app) {
    /* GET home page. */
    app.get('/', function (req, res, next) {
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
                    menus: menus
                }
            );
        });
    });

    app.get('/submit/:id', function (req, res, next) {
        var id = parseInt(req.params.id);
        Menus.getMenuById(id, function (err, menu) {
            if (err) {
                console.error('get menu error');
            }

            MenusDescription.getDescriptionByMenuId(id, function (err, descs) {
                console.log(descs);
                if (err) {
                    descs = [];
                }
                res.render('submit',
                    {
                        title: 'ITWOCloud Lunch Order System',
                        descs: descs,
                        menu: menu,
                        hasDesc: descs.length
                    }
                );
            });
        });


    });

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
};
