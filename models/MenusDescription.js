/**
 * Created by Jackey Li on 2015/5/16.
 */

var mongodb = require('./db'),
    BSON = require('mongodb').BSONPure;

var dataTableName = 'Menus_Description';

var MenusDescription = function (desc) {
    this.menuId = desc.menuId;
    this.userId = desc.userId;
    this.dateInsert = desc.dateInsert;
    this.desc = desc.desc;
};


//TODO:ADD COMMENTaaaaaaaaaaaAZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ

MenusDescription.getDescriptionByMenuId = function (id, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        db.collection(dataTableName, function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            collection.find({menuId: parseInt(id, 10)}).toArray(function (err, docs) {
                mongodb.close();
                if (err) {
                    return callback(err);
                }
                callback(null, docs);
            });
        });
    });
};

module.exports = MenusDescription;

