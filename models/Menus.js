/**
 * Created by Jackey Li on 2015/5/15.
 */

var mongodb = require('./db'),
    BSON = require('mongodb').BSONPure;

var dataTableName = 'Menus';

var Menus = function (menu) {
    this.id = menu.id;
    this.name = menu.name;
    this.price = menu.price;
    this.imageUrl = menu.imageUrl;
    this.desc = menu.desc;
    this.isHot = menu.isHot;
    this.isSpecialty = menu.isSpecialty;
};

Menus.getMenuById = function (id, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }

        db.collection(dataTableName, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }

            collection.findOne({
                id: id
            }, function (err, menu) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, menu);//成功！返回查询的用户信息
            });
        });
    });
};

Menus.getAll = function (callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(dataTableName, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find().toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};

module.exports = Menus;